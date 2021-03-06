exports.init = function(version,questname){	//}
	var Q = questname;
	
	var getItemName = function(name){
		if(name.have(Q)) return name;
		else return Q + '-' + name;
	}
	
	
	var convertSetEvent = function(event){
		if(typeof event !== 'string') return event;
		if(s.quest.event['$SET_' + event]) return s.quest.event['$SET_' + event]
	}
	var convertGetEvent = function(event){
		if(typeof event !== 'string') return event;
		if(s.quest.event['$GET_' + event]) return s.quest.event['$GET_' + event]
	}
	
	var parseViewedIf = function(vif){
		if(typeof vif !== 'string') return vif;
		else return convertGetEvent(vif);
	}
	var parseEvent = function(event){
		if(typeof event !== 'string') return event;
		else return convertSetEvent(event);
	}
	var parseExtra = function(extra){
		if(!extra) return {quest:Q};
		if(extra.viewedIf) extra.viewedIf = parseViewedIf(extra.viewedIf);
		if(extra.name) extra.context = extra.name;
		extra.quest = Q;
		return extra;
	}
	
	
	var s = {};	
	s.interval = function(num){ return Loop.interval(num); }
	
	s.quest = Quest.template(Q);
	
	s.startQuest = function(key,auto){
		if(List.main[key].questActive === Q) return;
		if(auto && !List.main[key].questActive) Quest.start(key,Q);
		else Main.openWindow(List.main[key],'quest',Q);	
	}
	
	s.abandonQuest = function(key){
		Quest.abandon(key,Q);
	}
	
	s.completeQuest = function(key){
		Quest.complete(key,Q);
	}
	
	s.get = function(key,attr){
		if(!List.main[key]) return;	//case enemy
		var mq = List.main[key].quest[Q];	
		var a = mq[attr];
		return typeof a === 'object' ? Tk.deepClone(a) : a;	//prevent setting
	}

	s.set = function(key,attr,value){
		var mq = List.main[key].quest[Q];	
		
		if(!mq._active){
			Chat.add(key,"You need to start this quest via the Quest Tab before making progress in it."); 
			return;
		}
		if(typeof value === 'string' && typeof mq[attr] === 'number' && !isNaN(value) && (value[0] === '+' || value[0] === '-'))	mq[attr] += (+value);
		else mq[attr] = value;	
		Quest.updateHint(key,Q);		
	}

	s.getAct = function(key){
		return List.all[key];
	}
	
	s.setTimeout = function(key,name,time,func){
		Actor.setTimeout(s.getAct(key),Q + '-' + name,time,func);	
	};
	
	s.teamForEach = function(key,func,action){
		var bool = true;
		
		var team = List.team[s.getAct(key).team].list;
		
		for(var i in team){
			var teammate = s.getAct(i); if(!teammate){ ERROR(3,'no teammate'); continue; }
			bool = bool && func(i);
		}
		
		if(bool && action){
			for(var i in team)	action(i);
		}
		return bool;	
	}
	
	s.highscoreWindow = function(key,category){
		if(!Db.highscore[Q + '-' + category]) return ERROR(2,'hs category not exist',Q + '-' + category);
		Main.openWindow(List.main[key],'highscore',Q + '-' + category);
	}
	
	s.usePreset = function(key,name){
		var preset = Db.quest[Q].preset[name];
		if(!preset) return ERROR(3,'no preset with name',name);
		preset = Tk.deepClone(preset);
		var act = s.getAct(key);
		Actor.setCombatContext(act,'quest');
		act.abilityList.quest = {};
		
		for(var i = 0 ; i < preset.ability.length; i++){
			if(preset.ability[i]){
				act.abilityList.quest[preset.ability[i]] = 1;
				Actor.ability.swap(act,preset.ability[i],i);
			}
		}
		
		
		act.equip.quest.piece = preset.equip;
		s.rechargeAbility(key);
	}
	
	
	s.chat = function(key,text){
		Chat.add(key,text);
	}
	s.question = function(key,text,func,option){
		if(option === undefined	) option = true;
		Chat.question(key,{text:text,func:func,option:option});
	}	
	
	s.dialogue = function(key,npc,convo,node){		
		if(!s.get(key,'_active')){ s.startQuest(key); return; }
		Dialogue.start(key,{group:Q,npc:npc,convo:convo,node:node});
	}

	s.teleport = function(key,map,letter,instance,newmap){	//
		if(Quest.test.simple) return Chat.add(key,"Can't teleport because in simple mode.");
		
		if(List.main[key].questActive !== Q) return Chat.add(key,"Can't teleport because quest not active.");
		var p = s.getAct(key);
		
		if(instance === 'team') map += '@';
		if(instance === 'solo') map += '@@';
		if(newmap){
			var targetmap = Actor.teleport.getMapName(p,map);
			if(List.map[targetmap]){	//TODO verify if other players in instance
				if(p.map === targetmap){	//if player in map, teleport out,
					Actor.teleport(p,{x:0,y:0,map:'test@MAIN'});
				} 
				Map.remove(List.map[targetmap]);
			}
		}
		var spot = s.getSpot(map,Q,letter);		
		Actor.teleport(s.getAct(key),spot);
		
		/*
		if(!popup) Actor.teleport(s.getAct(key),spot);
		
		else {
			Chat.question(key,{
				//could show text to where hes going
				func:function(){Actor.teleport(s.getAct(key),spot);},
				option:true,
			});
		}
		*/
	}
	
	s.setRespawn = function(key,map,letter,safe){	//must be same map
		var spot = s.getSpot(map,Q,letter);
		if(!spot) return ERROR(3,'no spot');
		Actor.setRespawn(s.getAct(key),spot,safe);
	}

	s.getMapAddon = function(key){
		return List.map[s.getAct(key).map].addon[Q];
	}
	
	s.getSpot = function(id,addon,spot){
		var a = Db.map[Map.getModel(id)].addon[addon].spot[spot];	//cant use list cuz map could not be created yet
		if(!a){ ERROR(3,'spot not found ',id,addon,spot); return }
		return {x:a.x,y:a.y,map:id}
	}
	
	s.setSprite = function(key,name,size){
		var tmp = {};
		if(name) tmp.name = name;
		if(size) tmp.sizeMod = size;
		Sprite.change(s.getAct(key),tmp);
	}

	s.boost = function(key,boost){
		Actor.boost(s.getAct(key),boost);	
	}
	
	//Item
	s.itemFormat = function(item,amount){
		var list = Itemlist.format(item,amount,false);
		var goodList = {};
		for(var i in list) goodList[getItemName(i)] = list[i];
		return goodList;
	}
	
	s.addItem = function(key,item,amount){
		if(s.get(key,'_active') === false) return false;
		
		Itemlist.add(key,s.itemFormat(item,amount));
	}

	s.removeItem = function(key,item,amount){
		Itemlist.remove(key,s.itemFormat(item,amount));
	}

	s.haveItem = function(key,item,amount,removeifgood){
		var list = s.itemFormat(item,amount);
		var success = Itemlist.have(key,list);
		if(success && (removeifgood || amount === true)) Itemlist.remove(key,list);
		return success;
	}

	s.testItem = function (key,item,amount,addifgood,variable){
		if(s.get(key,'_active') === false) return false;
		
		var list = s.itemFormat(item,amount);
		var success = Itemlist.test(key,list);
		if(success && ((addifgood || amount) === true)) Itemlist.add(key,list);
		
		if(success && (variable || typeof addifgood === 'string')){
			s.set(key,variable || addifgood,true);
		}
		return success;
	}
	
	s.getTeam = function(key){	//TODO
		
	}

	//Cutscene
	s.cutscene = function(key,map,path){
		var act = s.getAct(key);
		if(Map.getModel(act.map) !== map){ ERROR(3,'act in wrong map for cutscene'); return; }
		Actor.setCutscene(act,s.quest.map[map][Q].path[path]);
		//ts("p.x = 1500; p.y = 3000;Actor.setCutscene(p,[{x:1600,y:3100},25*10,{x:1800,y:3200}]);")
	}

	s.freeze = function(key,time,cb){
		Actor.freeze(s.getAct(key),time,cb);
	}
	
	s.unfreeze = function(key){
		Actor.freeze.remove(s.getAct(key));
	}

	s.getNpc = function(key,tag){
		var list = List.map[s.getAct(key).map].list.npc;
		for(var i in list){
			if(List.all[i].tag === tag)
				return List.all[i];
		}
		return null;
	}

	s.actor = function(key,spot,cat,variant,extra,lvl){
		var spot = s.getSpot(s.getAct(key).map,Q,spot);
		return Actor.creation({spot:spot,category:cat,variant:variant,lvl:lvl || 0,extra:parseExtra(extra)});
	}
	
	s.actorGroup = function(key,spot,respawn,list,extra){
		var spot = s.getSpot(s.getAct(key).map,Q,spot);
		var tmp = [];
		for(var i in list){
			var m = list[i];
			tmp.push({"category":m[0],"variant":m[1],'amount':m[2] || 1,'modAmount':true,'extra':parseExtra(m[3])});
		}
		return Actor.creation.group({'spot':spot,'respawn':respawn},tmp);
	}
	
	s.drop = function(key,e,item,amount){
		item = getItemName(item);
		amount = amount || 1;
		
		var tmp = {'x':e.x,y:e.y,map:e.map,"item":item,"amount":amount};
		tmp.viewedIf = Tk.arrayfy(key);	//key can be string or array of keys
		Drop.creation(tmp);			
	}
	
	s.chrono = function(key,name,action,text){
		return Main.chrono(List.main[key],Q + '-' + name, action, text);
	}
	
	s.rechargeAbility = function(key){
		var p = s.getAct(key);
		var ab = Actor.getAbility(p);
		p.abilityChange.globalCooldown = 0;
		for(var i in ab){
			var ss = ab[i]; if(!ss) continue;	//cuz can have hole if player
			p.abilityChange.charge[ss.id] = 1000;
		}
	}
	
	
	//Map
	var m = s.map = {};
	m.map = Init.db.map.template;
	m.bullet = function(spot,atk,angle,dif){
		var act = {damageIf:dif || 'player-simple',spot:spot};
		Map.convertSpot(act);
		
		Attack.creation(act,atk,{angle:angle});
	}
	
	m.strike = function(spot,atk,angle,dif,extra){
		Combat.attack.simple({damageIf:dif || 'player-simple',spot:spot,angle:angle},atk,parseExtra(extra));
	}
	
	m.actor = function(spot,cat,variant,extra,lvl){
		return Actor.creation({spot:spot,category:cat,variant:variant,lvl:lvl || 0,extra:parseExtra(extra)});
	}

	m.actorGroup = function(spot,respawn,list,extra){
		var tmp = [];
		for(var i in list){
			var m = list[i];
			tmp.push({"category":m[0],"variant":m[1],'amount':m[2] || 1,'modAmount':true,'extra':parseExtra(m[3])});
		}
		return Actor.creation.group({'spot':spot,'respawn':respawn},tmp);
	}

	m.collision = function(spot,cb){
		if(!Loop.interval(5)) return;
			Map.collisionRect(spot.map,spot,'player',cb);
	}

	m.block = function(zone,viewedIf,sprite,extra){	//only support spikes
		extra = extra || {};
		if(viewedIf) extra.viewedIf = viewedIf;
		if(!sprite){
			extra['sprite,name'] = 'invisible';
		}
		extra = parseExtra(extra);
		
		var totalinit = Math.abs(zone[1] - zone[0])/32 + Math.abs(zone[3] - zone[2])/32 + 1; //one should have value, other be 0
		var total = totalinit;	
		var a9 = Math.floor(total/9);	total -= a9*9;
		var a5 = Math.floor(total/5);	total -= a5*5;
		var a3 = Math.floor(total/3);	total -= a3*3;
		var a1 = total;
		var list = {'1':a1,'3':a3,'5':a5,'9':a9};	
		var block = true;		
		
		if(zone[2] === zone[3]){	//horizontal
			var x = zone[0] + 16;
			for(var i in list){
				var ext = Tk.deepClone(extra);
				if(sprite) ext['sprite,name'] = 'block-spike1x' + i;
				
				for(var j = 0 ; j < list[i]; j++){
					if(block) ext.block = {size:[0,totalinit-1,0,0]};
					m.actor({x:x,y:zone[2]+16,map:zone.map,addon:zone.addon},'block','template',ext);
					if(block){ ext = Tk.deepClone(ext); delete ext.block; block = false;}
					x += 32*(+i);
				}
			}
		}
		if(zone[0] === zone[1]){	//vertical
			var y = zone[2] + 16;
			for(var i in list){
				var ext = Tk.deepClone(extra);
				if(sprite) ext['sprite,name'] = 'block-spike' + i + 'x1';
					
				for(var j = 0 ; j < list[i]; j++){
					if(block) ext.block = {size:[0,0,0,totalinit-1]};
					m.actor({x:zone[0]+16,y:y,map:zone.map,addon:zone.addon},'block','template',ext);
					if(block){ ext = Tk.deepClone(ext); delete ext.block; block = false;}
					y += 32*(+i);
				}
			}
		}
	}

	m.drop = function(key,spot,name,amount,time){	//TOFIX
		time = time || 25*120;
		if(!s.existItem(Q+ '-' + name)) return;
		
		var tmp = {'spot':spot,"item":Q + '-' + name,"amount":amount,'timer':time};
		if(typeof key === 'string') tmp.viewedIf = [key];
		Drop.creation(tmp);	
	}
	
	m.toggle = function(spot,viewedIf,on,off,sprite,extraOff,extraOn){
		sprite = sprite || 'box';
		viewedIf = parseViewedIf(viewedIf);
		
		//Off
		extraOff = parseExtra(extraOff);
		extraOff.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return viewedIf(key) === true;
		};
		extraOff.toggle = parseEvent(on);

		m.actor(spot,'toggle',sprite+'Off',extraOff);

		//On
		extraOn = parseExtra(extraOn);
		extraOn.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return viewedIf(key) === false;
		};
		if(off) extraOn.toggle = parseEvent(off);
		
		m.actor(spot,'toggle',sprite + 'On',extraOn);
	}
	
	m.teleport = function(spot,event,sprite,extra){
		extra = extra || {};
		extra.teleport = event;
		m.actor(spot,'teleport',sprite || 'zone',extra);
	}
	
	m.waypoint = function(spot,safe,extra){
		extra = parseExtra(extra);
		if(safe) extra.waypoint = 2;
		m.actor(spot,'waypoint','grave',extra);
	}
	
	m.loot = function(spot,viewedIf,open,sprite,extraOff,extraOn){
		sprite = sprite || 'chest';
		viewedIf = parseViewedIf(viewedIf);
		
		//Off
		extraOff = parseExtra(extraOff);
		extraOff.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return viewedIf(key) === true;
		};
		extraOff.loot = open;

		m.actor(spot,'loot',sprite + 'Off',extraOff);

		//On
		extraOn = parseExtra(extraOn);
		extraOn.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return viewedIf(key) === false;
		};
		
		m.actor(spot,'loot',sprite + 'On',extraOn);
	}
	
	m.skillPlot = function(spot,type,num){
		var plot = Db.skillPlot[type];
		
		//create 2 copy. if not harvest, view up tree. else view down
		Actor.creation({'spot':spot,
			"category":plot.category,"variant":plot.variant,"extra":{
				skillPlot:{quest:Q,	num:num,type:type},
				viewedIf:function(key,eid){
					if(List.all[key].type !== 'player') return true;
					var plot = List.all[eid].skillPlot;
					return List.main[key].quest[plot.quest]._skillPlot[plot.num] == 0;			
				}		
			}
		});

		Actor.creation({'spot':spot,
			"category":plot.category,"variant":"down","extra":{
				skillPlot:{quest:Q,	num:num,type:'down'},
				viewedIf:function(key,eid){
					if(List.all[key].type !== 'player') return true;
					var plot = List.all[eid].skillPlot;
					return List.main[key].quest[plot.quest]._skillPlot[plot.num] == 1;			
				},
				
			}
		});
	}
	
	//Minimized
	m.actor.count = 0;
	m.actor.list = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','e1','e2','e3','e4','e5','e6','e7','n1','n2','n3','n4','t1','t2','t3','t4','q1','q2','q3','q4','b1','b2','b3','b4'];
	
	m.actor.simple = function(name,extra){
		var spot = List.map['simpleMap@MAIN'].addon[Q].spot[m.actor.list[m.actor.count++]];
		extra = parseExtra(extra);
		
		extra.context = name;
		extra.name = name;
		extra.nevermove = 1;
		extra.nevercombat = 1;
		extra.angle = 90;
		m.actor(spot,'npc','regular',extra);
	};
	
	m.toggle.simple = function(name,viewedIf,on,off){ 
		var spot = List.map['simpleMap@MAIN'].addon[Q].spot[m.actor.list[m.actor.count++]];
		
		var extra = {context:name,name:name};
		m.toggle(spot,viewedIf,on,off,'box',extra,Tk.deepClone(extra));
	}
	
	m.loot.simple = function(name,viewedIf,open){ 
		var spot = List.map['simpleMap@MAIN'].addon[Q].spot[m.actor.list[m.actor.count++]];
		
		var extra = {context:name,name:name};
		
		m.loot(spot,viewedIf,open,'chest',extra,Tk.deepClone(extra));
	}
	
	
	//Boss
	var b = s.boss = {};
	b.init = Boss.template;
	b.attack = Boss.attack;
	b.summon = Boss.summon;

	
	
	//Template
	s.requirement = function(){
		if(Quest.requirement.template[arguments[0]])
			return Quest.requirement.template[arguments[0]](arguments[1],arguments[2],arguments[3],arguments[4]);	
	}
	
	s.challenge = function(){
		if(Quest.challenge.template[arguments[0]])
			return Quest.challenge.template[arguments[0]](arguments[1],arguments[2],arguments[3],arguments[4]);	
	}
	
	s.item = function(name,icon,option,description){
		var tmp = {name:name,icon:icon || 'minimapIcon.loot',description:description||name,option:[],trade:0,stack:1,bank:0,drop:0,quest:Q};
		for(var i in option){
			tmp.option.push({'name':option[i][0],'func':option[i][1],'description':option[i][2] || option[i][0],'param':[]});
		}
		return tmp;
	}
	
	
	s.ERROR = function(txt){
		ERROR(3,txt);
	}
	return s;
}















