var questList = [
	'Qtest',
	'QgoblinJewel',
	'Mtest',
	'Qbtt',
	//'Qmytest',
	'QgimmeGold',
];
Quest.test = 'QgimmeGold';

//##### DONT TOUCH BELOW ############
Db.quest = {};
Db.highscore = {};
Quest.test = {name:Quest.test,simple:false};
Init.db.quest = function(){
	var questVar = {};
	for(var i in Db.quest){
		Db.quest[i] = Quest.creation(Db.quest[i]);
		if(Db.quest[i].visible) questVar[i] = Db.quest[i].variable;
	}
	Main.template.quest = {};
	Main.template.quest = new Function('return ' + Tk.stringify(questVar));	
	for(var i in questVar)	Main.template.quest[i] = new Function('return ' + Tk.stringify(questVar[i]));	
		
}

Init.db.quest.map = function(){	//called before Init.db.quest
	for(var i in questList){
		Db.quest[questList[i]] = require('./quest/'+questList[i]).quest;
	}
	
	for(var i in Db.quest){
		for(var j in Db.quest[i].map){
			if(Db.map[j]) ERROR(1,"THERES ALREADY A MAP WITH THAT NAME.",j,i); 
			if(j === 'simple'){	
				Quest.creation.simpleMap(Db.quest[i]);
				if(i === Quest.test.name) Quest.test.simple = true; 
				continue; 
			}
			Db.map[j] = Db.quest[i].map[j];
			Db.quest[i].map[j] = Db.quest[i].map[j]().addon;
		}
	}
}

Quest.creation = function(q){
	Quest.creation.tester(q);
		
	//Default Event
	for(var i in q.variable){
		(function(i){
			q.event['$GET_' + i] = function(key){ 
				if(List.all[key].type !== 'player') return true;
				return List.main[key].quest[q.id][i];
			}
			q.event['$GET_!' + i] = function(key){
				if(List.all[key].type !== 'player') return true;
				return !List.main[key].quest[q.id][i];
			}
			q.event['$SET_' + i] = function(key){ 
				if(List.all[key].type !== 'player') return;
				List.main[key].quest[q.id][i] = true;
			}
			q.event['$SET_!' + i] = function(key){ 
				if(List.all[key].type !== 'player') return;
				List.main[key].quest[q.id][i] = false;
			}
		}(i));
	}
	
	//Variable
	q.variable = Tk.useTemplate(Quest.template.variable(),q.variable);
	for(var j in q.challenge){
		q.variable._challenge[j] = 0; 	//0:non-active, 1:active
		q.variable._challengeDone[j] = 0;
	}
	for(var j in q.requirement) q.variable._requirement += '0'; 	//0:non-met, 1:met
	for(var j in q.highscore) q.variable._highscore[j] = null;
	
	//Event
	q.event = Tk.useTemplate(Quest.template.event(),q.event);
	q.drop = Tk.useTemplate(Quest.template.drop(),q.drop);
	
	//Highscore
	for(var j in q.highscore){
		q.highscore[j].id = q.id + '-' + j;
		Db.highscore[q.id + '-' + j] = q.highscore[j];
	}
	
	
	Db.dialogue[q.id] = {};
	for(var i in q.dialogue)	Db.dialogue[q.id][i] = q.dialogue[i];		
	
	//load map via Init.db.quest.map
	for(var i in q.mapAddon)	Db.map[i].addon[q.id] = q.mapAddon[i];
	
	Db.npc[q.id] = {};
	for(var i in q.npc)	Db.npc[q.id][i] = q.npc[i];
	for(var i in q.boss) Db.boss[q.id+'-'+ i] = q.boss[i];
	
	for(var i in q.item){
		q.item[i].id = q.id+'-'+ i;
		Item.creation(q.item[i]);
	}
	
	for(var i in q.equip){
		q.equip[i].id = q.id+'-'+ i;
		Equip.creation(q.equip[i]);
	}
	
	for(var i in q.ability){
		q.ability[i].id = q.id+'-'+ i;
		Ability.creation(q.ability[i]);
	}
	
	
	
	
	for(var i in q.preset){
		/*preset.bob = {
			ability:['asd','','asdsd'],
			equip:{melee:'asdsd',helm:'asd',}		
		}*/
		var tmp = {'ability':q.preset[i].ability,'equip':{"melee":"","range":"","magic":"","":"","helm":"","ring":"","gloves":"","body":"","shield":"","bracelet":"","pants":"","boots":""}};
		
		for(var j in tmp.ability) if(tmp.ability[j]) tmp.ability[j] = q.id + '-' + tmp.ability[j];
		for(var j in q.preset[i].equip)	if(q.preset[i].equip[j]) tmp.equip[j] = q.id + '-' + q.preset[i].equip[j];
		q.preset[i] = tmp;
	}
	
	for(var i in q.plan){
		q.plan[i].id = q.id+'-'+ i;
		Plan.creation(q.plan[i]);
	}
	
	

	return q;
}

Quest.creation.simpleMap = function(q){
	
	q.mapAddon.simpleMap = {
		spot:{"a":{"x":240,"y":272},"b":{"x":400,"y":272},"c":{"x":560,"y":272},"d":{"x":720,"y":272},"e":{"x":880,"y":272},"f":{"x":1040,"y":272},"g":{"x":1200,"y":272},"h":{"x":1360,"y":272},"i":{"x":240,"y":464},"j":{"x":400,"y":464},"k":{"x":560,"y":464},"l":{"x":720,"y":464},"m":{"x":880,"y":464},"n":{"x":1040,"y":464},"o":{"x":1200,"y":464},"p":{"x":1360,"y":464},"q":{"x":240,"y":656},"r":{"x":400,"y":656},"s":{"x":560,"y":656},"t":{"x":720,"y":656},"u":{"x":880,"y":656},"v":{"x":1040,"y":656},"w":{"x":1200,"y":656},"x":{"x":1360,"y":656},"A":{"x":784,"y":752},"e1":{"x":240,"y":848},"e2":{"x":400,"y":848},"e3":{"x":560,"y":848},"e4":{"x":720,"y":848},"e5":{"x":880,"y":848},"e6":{"x":1040,"y":848},"e7":{"x":1200,"y":848},"e8":{"x":1360,"y":848},"n1":{"x":240,"y":1040},"n2":{"x":400,"y":1040},"n3":{"x":560,"y":1040},"n4":{"x":720,"y":1040},"t1":{"x":880,"y":1040},"t2":{"x":1040,"y":1040},"t3":{"x":1200,"y":1040},"t4":{"x":1360,"y":1040},"q1":{"x":240,"y":1232},"q2":{"x":400,"y":1232},"q3":{"x":560,"y":1232},"q4":{"x":720,"y":1232},"b1":{"x":880,"y":1232},"b2":{"x":1040,"y":1232},"b3":{"x":1200,"y":1232},"b4":{"x":1360,"y":1232}},
		path:{},
		variable:{},
		load:q.map.simple,
		loop:function(spot){} 
	}
	delete q.map.simple;
}


Quest.creation.tester = function(q){
	var item = {"id":q.id + '-QuestTester','name':q.id + " Tester",'icon':'system.gold','stack':1,'drop':0,'option':[]};
	
	item.option.push({name:'Teleport','func':function(key){
		Chat.question(key,{text:"enter spot",func:function(key,param){
			try{ 
				var spot = List.map[List.all[key].map].addon[q.id].spot[param];
				Actor.teleport(List.all[key],spot);
			} catch(err) { ERROR.err(err); Chat.add(key,"no found"); }
		}});
	}});
	
	item.option.push({name:'Add Item','func':function(key){
		Chat.question(key,{text:"item,amount", func:function(key,item,amount){
			item = q.id + '-' + item;
			if(Db.item[item])	Itemlist.add(key,item,amount || 1);
			else Chat.add(key,'wrong');
		}});	
	}});
	
	item.option.push({name:'Call Event','func':function(key){
		Chat.question(key,{text:'event',func:function(key,param){
			if(q.event[param]) return q.event[param](key);
			else for(var i in q.event.test)	if(q.event.test[param]) return q.event.test[param](key);
			Chat.add(key,"no found");
		}});
	}});
	
	item.option.push({name:'Change Var','func':function(key){
		Chat.question(key,{text:'variable,value',func:function(key,param,value){
			var mq = List.main[key].quest[q.id];
			if(value === undefined)	return Chat.add(key,param + ' : ' + mq[param]);
			if(mq[param] !== undefined){
				if(value === 'true') mq[param] = true;
				else if(value === 'false') mq[param] = false;
				else if(!isNaN(value)) mq[param] = +value;
				else mq[param] = value;
			}
			else Chat.add(key,"bad name");
		}});
	}});
	
	
	Item.creation(item);
}

Quest.template = function(id,version){
	return {
		id:id || Math.random(),
		version: version || 'v1.0',
		name:'Default Quest',
		icon:'skill.melee',
		reward:{
			passive:{max:1,base:0.25,mod:10},
			exp:{},
			item:{},
		},
		description:"Default Description",
		lvl:0,
		difficulty:'Easy',
		variable:{},
		requirement:[],		
		dialogue:{},
		challenge:{},
		mapAddon:{},
		map:{},
		item:{}, 
		equip:{},
		npc:{},
		ability:{},
		plan:{},
		event:{},
		skillPlot:[],
		boss:{},
		visible:id[0] !== 'M',
		author:'rc',
	};
}

Quest.template.variable = function(){
	return {
		_hint:'None.',
		_rewardScore:0,
		_rewardPt:0,
		_complete:0,
		_active:0,
		_deathCount:0,
		_bonus:{
			challengeDone:{passive:1,exp:1,item:1},
			challenge:{passive:1,exp:1,item:1},	//only used so client can see, only hold success values
			orb:{passive:1,exp:1,item:1},
			cycle:{passive:1,exp:1,item:1},
		},
		_challenge:{},
		_challengeDone:{},		//TODO
		_requirement:'',
		_skillPlot:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		_orbAmount:0,
		_highscore:{},
		_enemyKilled:0,
	};
}


Quest.template.event = function(){
	return {
		_complete:Cst.func,
		_start:Cst.func,
		_abandon:Cst.func,
		_signIn:Cst.func,
		_hint:Cst.func,
		_death:Cst.func,
		_test:{
			signIn:Cst.func,
			firstSignIn:Cst.func,
		},
		_getScoreMod:Cst.func,	//return NUMBER
	}
}

Quest.template.drop = function(){
	return {
		category:{},
		getDropMod:function(amount,key){		//amount is _enemyKilled
			return Math.min(1,100 / amount);	//below 100 => 1, at 200 => 1/2, 300 => 1/3	
		},
		plan:{},
		getExp:function(mod,amount,key){	//mod is from getDropMod
			return {};	
		}
	}
}





