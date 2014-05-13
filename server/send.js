var BISON = require('./client/js/shared/BISON');

Change = {};

Change.send = function(){
	//Send what has changed to the client.for (var key in List.socket){
	for(var key in List.socket){
		var socket = List.socket[key];
		if(!socket.clientReady) continue;
		if(key === Server.botwatch.watcher) continue;
		var sa = Change.send.template();
		
		//Update Private Player
		var player = List.all[key];
		sa.p = player.privateChange;
		sa.p = Change.send.compressXYA(sa.p);
		
		//Update Activelist AKA List.all
		for (var i in player.activeList){
			var obj = List.all[i];
			if(!obj){ delete player.activeList[i]; ERROR(2,'no act'); continue; }
			
			var id = obj.publicId || obj.id;
			
			if(player.activeList[i] === 1){		//Need to Init
				sa.i[id] = Change.send.init(obj);
				player.activeList[i] = 2;
			} else sa.u[id] = Change.send.compressXYA(obj.change);	//Only Update
			
		}
		//Remove List
		sa.r = player.removeList;
		
		//Main
		sa.m = List.main[key].change;
		
		//Anim
		//note: remove map and viewedif from .target and slot?
		for(var i in List.map[player.map].list.anim){
			var anim = List.map[player.map].list.anim[i];
			
			if(typeof anim.target === 'string'){	//aka target is an obj
				var targ = List.all[anim.target];
				if(!targ){ ERROR(2,'noact'); continue; }	//possible if summoned died
				if(player.id === targ.id || Activelist.test(player,targ)){
					sa.a.push(Change.send.init.anim(anim)); 
				}
			}
			if(typeof anim.target !== 'string'){	//aka target is already in form {x:1,y:1,map:1}
				if(Activelist.test(player,anim.target)){
					sa.a.push(Change.send.init.anim(anim)); 
				}
			}
		}
		
		
		//Delete things that are empty
		sa = Change.send.clearEmpty(sa);
		//if(Object.keys(sa).length === 0){ continue; }	//cuz need to send something to update bullet
		
		//Send
		if(BISON.active) sa = BISON.encode(sa);
		socket.emit('change', sa );
		
		if(key === Server.botwatch.watched){
			if(List.socket[Server.botwatch.watcher])
				List.socket[Server.botwatch.watcher].emit('change', sa );
			else {
				Server.botwatch.watcher = null;
				Server.botwatch.watched = null;
			}
		}
		
		Performance.bandwidth('upload',sa,socket);
	}
	
	Change.send.reset();

}

Change.send.template = function(){
	return {
		i:{},  //init (first time seen by player		
		u:{},  //update (already init-ed)
		p:{},	//player
		m:{},	//main
		r:{},	//removeList
		a:[],  //animation
	}
}

Change.send.clearEmpty = function(sa){
	if(sa.a.length === 0){ delete sa.a }
		
	if(Object.keys(sa.i).length === 0){ delete sa.i }
	if(Object.keys(sa.p).length === 0){ delete sa.p }
	if(Object.keys(sa.m).length === 0){ delete sa.m }
	if(Object.keys(sa.r).length === 0){ delete sa.r }
	
	if(Loop.frame % 10 !== 0 ){ //other, if nothing moves, client thinks enemy is removed
		for(var i in sa.u) if(Object.keys(sa.u[i]).length === 0) delete sa.u[i] 
	}
	if(Object.keys(sa.u).length === 0){ delete sa.u }
	
	return sa;

}

Change.send.compressXYA = function(info){
	//if only change is x,y and angle, compress it into [x,y,angle]
	if(info.x !== undefined && info.y !== undefined){ 
		if(info.angle !== undefined){
			if(Object.keys(info).length === 3){ info = [info.x,info.y,info.angle];}
			else { info.xya = [info.x,info.y,info.angle]; }
		} else {
			if(Object.keys(info).length === 2){ info = [info.x,info.y];}
			else { info.xy = [info.x,info.y]; }
		}
		
		delete info.x
		delete info.y
		delete info.angle		
	}
	return info;
}

Change.send.reset = function(){
	Anim.removeAll();
	for(var i in List.all){ List.all[i].change = {}; }
	for(var i in List.main){ 
		List.main[i].change = {}; 
		List.all[i].privateChange = {}; 	
		List.all[i].removeList = {};
	}
}

//####################################
Change.send.init = function(obj){ //create object that has all info for the client to init the object
	if(obj.type == 'bullet') return Change.send.init.bullet(obj);
	else if(obj.type == 'strike') return Change.send.init.strike(obj);
	else if(obj.type == 'drop') return Change.send.init.drop(obj);
	else if(obj.type == 'npc' || obj.type == 'player')	return Change.send.init.actor(obj);
}

Change.send.init.bullet = function(bullet){	//For Init
	var draw = [
		'b',
		Math.round(bullet.x),
		Math.round(bullet.y),
		Math.round(bullet.moveAngle),
		bullet.sprite.name,
		bullet.sprite.sizeMod,
	];
	if(bullet.normal) draw.push(bullet.spd);
	
	return draw;
}

Change.send.init.strike = function(s){
	var p = s.point;
	var r = Math.round;
	
	return [
		's',
		s.delay,
		r(p[0].x),r(p[0].y),
		r(p[2].x),r(p[2].y),
		r(p[8].x),r(p[8].y),
		r(p[6].x),r(p[6].y),
	];
}



Change.send.init.actor = function(act){	//For Init
	var draw = {};
	draw.id = act.publicId;
	draw.xya = [Math.round(act.x),Math.round(act.y),Math.round(act.angle)];
	draw.sprite = {'name':act.sprite.name,'anim':act.sprite.initAnim || "walk",'sizeMod':act.sprite.sizeMod || 1};
	draw.hp = Math.round(act.hp);
	draw.resource = {'hp':{'max':Math.round(act.resource.hp.max)}};
	draw.maxSpd = Math.round(act.maxSpd);
	draw.type = act.type;
	draw.combat = act.combat;
	draw.context = act.context;
	if(act.minimapIcon){ draw.minimapIcon = act.minimapIcon; }
	return draw;
}

Change.send.init.drop = function(drop){
	var draw = {};
	draw.x = Math.round(drop.x);
	draw.y = Math.round(drop.y);
	draw.id = drop.publicId;
	draw.type = drop.type;
	draw.item = Db.item[drop.item].icon;
	draw.context = Db.item[drop.item].name;
	
	return draw;
}

Change.send.init.anim = function(anim){
	var t = {name:anim.name};
	if(anim.sizeMod !== 1) t.sizeMod = anim.sizeMod;
	if(typeof anim.target === 'string')
		t.target = List.all[anim.target].publicId || List.all[anim.target].id;
	else
		t.target = {x:Math.round(anim.target.x),y:Math.round(anim.target.y)}
	
	return t;
};

//########################################

Change.send.convert = {};

Change.send.convert.optionList = function(ol){
	var draw = {};
	draw.x = ol.x;
	draw.y = ol.y;
	draw.name = ol.name;
	
	draw.option = [];
	for(var i = 0; i < ol.option.length ; i++){
		var tmp = {'name':ol.option[i].name};
		if(ol.option[i].description) tmp.description = ol.option[i].description;
		if(ol.option[i].question) tmp.question = ol.option[i].question;
		draw.option.push(tmp);
	}
	return draw;
}

Change.send.convert.itemlist = function(inv){
	var draw = [];
	for(var i in inv.data){
		draw[i] = '';
		if(inv.data[i][0]){
			draw[i] = [];
			draw[i][0] = Db.item[inv.data[i][0]].icon;
			draw[i][1] = inv.data[i][1];
			draw[i][2] = Db.item[inv.data[i][0]].name;
		}
	}
	inv.toUpdate = 0;
	return draw;
}



Change.send.convert.windowList = function(data){
	if(data.trade)	data.trade = Change.send.convert.windowList.trade(Tk.deepClone(data.trade));
	return data;
}

Change.send.convert.windowList.trade = function(data){
	var draw = Tk.deepClone(data);
	draw.tradeList = Change.send.convert.itemlist(draw.tradeList);
	draw.trader = List.all[draw.trader].publicId;
	return draw;
}

Change.send.convert.ability = function(ab,act){
	var list = ab[act.combatContext || 'regular'];
	var tmp = [];
	for(var i in list){
		tmp[i] = list[i] ? list[i].id : 0;		
	}
	return tmp;
}

Change.send.convert.abilityList = function(ab,act){
	return ab[act.combatContext || 'regular'];
}

Change.send.convert.abilityChangeClient = function(info){
	var tmp = '';
	for(var i in info)
		tmp += info[i] === 1 ? 'R' : Math.round(info[i]*35).toString(36).slice(0,1);
	return tmp;	
}

Change.send.convert.map = function(name){
	//used for instanced. client doesnt need to know its instanced
	return List.map[name].graphic;
}


Change.send.convert.equipPiece = function(w){ 
	if(!w) return '';
	return {'icon':w.icon,id:w.id} 
}
				
Change.send.convert.equipWeapon = function(w){ 
	if(!w) return '';
	return {'type':w.type,'piece':w.piece,'icon':w.icon,id:w.id} 
}

Change.send.convert.equip = function(eq,act){
	return eq[act.combatContext || 'regular'];
}


Change.send.convert.resource = function(w){
	for(var i in w)
		for(var j in w[i])
			w[i][j] = Math.round(w[i][j]); 
	return w;				
}



