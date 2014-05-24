"use strict";
var s = require('./../Quest_exports').init('v1.0','Qbtt');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "Break The Targets";

q.reward = {
	exp:{},
	item:{},
	passive:{min:0.1,max:0.5,mod:10},
};

q.challenge = {
	speedrunner:s.challenge('speedrun','1:05:10.10'),
};

q.variable = {
	killTarget:0,
	time:0,
	lastReset:0,
};

q.highscore = {
	time:{name:'Fastest Time',order:'ascending',getScore:function(key){
		return s.get(key,'time');	
	}},
}

var TARGETAMOUNT = 10;

	
	
q.equip['start-body'] = {'name':"Body",'piece':'body','type':'metal','icon':'body.metal',
	'def':{'main':2.451,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
}
	
q.preset = {
	target:{
		equip:{},
		ability:['simple','boomerang','5ways','','reset','fastmove'],	
	}
}


q.event = {
	test:function(key){
		s.usePreset(key,'bob');
	},
	_hint:function(key){
		if(!s.get(key,'_active')) return 'You can start this quest by talking to the girl south west of Goblin Land';
		return "Good luck!";
	},
	_test:{
		signIn:function(key){
			
		},
		firstSignIn:function(key){
			s.teleport(key,'goblinLand','n1');
			s.setRespawn(key,'goblinLand','n1');
		}
	},	
	_signIn:function(key){
		s.abandonQuest(key);
	},
	_start:function(key){
		
		
	},
	_getScoreMod:function(key){
		if(s.get(key,'time') < 10000) return 2;
		return 1;
	},
	_abandon:function(key){
		s.teleport(key,'goblinLand','n1');
		s.setRespawn(key,'goblinLand','n1');
		s.chrono(key,'timer','remove');
	},
	_complete:function(key){
		
		
	},
	talkJenny:function(key){
		s.startQuest(key,true);
		s.dialogue(key,'jenny','intro','first');
		s.chat(key,"Press F to restart quickly.");
	},
	teleportCourse:function(key){
		s.teleport(key,'btt001','q1','solo',1);
		s.chrono(key,'timer','remove');
		s.usePreset(key,'target');
		s.freeze(key,1*25,q.event.startCourse);
	},
	startCourse:function(key){
		s.chat(key,"GO!");
		s.chrono(key,'timer','start');
	},
	killTarget:function(key){
		s.set(key,'killTarget','+1');
		if(s.get(key,'killTarget') >= TARGETAMOUNT){
			q.event.endCourse(key);
		}
	},
	endCourse:function(key){
		var time = s.chrono(key,'timer','stop');
		s.set(key,'time',time);
		s.chat(key,'Your time is : ' + time + ' milliseconds.');
		s.teleport(key,'goblinLand','n1');
		s.highscoreWindow(key,'time');
		s.completeQuest(key);
	},
	resetCourse:function(key){
		if(Date.now() - s.get(key,'lastReset') < 2000) return;
		s.set(key,'lastReset',Date.now())
		s.set(key,'killTarget',0);
		q.event.teleportCourse(key);
	},
};	

q.ability['simple'] = {'type':'attack','name':'Ghost','icon':'attackMagic.fireball',
	'spd':{'main':1,'support':0},'period':{'own':15,'global':15},
	'action':{'func':'Combat.attack','param':{
		'type':"bullet",'angle':0,'amount':1,
		'objImg':{'name':"arrow",'sizeMod':1.2},'hitImg':{'name':"fireHit",'sizeMod':0.5},
		'dmg':{'main':100,'ratio':{'melee':100,'range':100,'magic':100,'fire':100,'cold':100,'lightning':100}},
	}
}};

q.ability['boomerang'] = {'type':'attack','name':'Boomerang','icon':'attackMagic.fireball',
	'spd':{'main':1,'support':0},'period':{'own':25,'global':15},
	'action':{'func':'Combat.attack','param':{
		'type':"bullet",'angle':0,'amount':1,
		'objImg':{'name':"bone",'sizeMod':1},'hitImg':{'name':"strikeHit",'sizeMod':0.5},
		'dmg':{'main':100,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
		'boomerang':{'spdBack':0.3,'spd':1},
		pierce:{chance:1,amount:100,dmgReduc:1},
		ghost:1,
	}
}};

q.ability['5ways'] = {'type':'attack','name':'4 Bullets','icon':'attackMagic.fireball',
	'spd':{'main':1,'support':0},'period':{'own':100,'global':15},
	'action':{'func':'Combat.attack','param':{
		'type':"bullet",'angle':360,'amount':5,
		'objImg':{'name':"fireball",'sizeMod':1.2},'hitImg':{'name':"fireHit",'sizeMod':0.5},
		'dmg':{'main':100,'ratio':{'melee':100,'range':100,'magic':100,'fire':100,'cold':100,'lightning':100}},
		ghost:1,
	}
}};

	
q.ability['reset'] = {'type':'boost','name':'Reset','icon':'attackMagic.fireball',
	'spd':{'main':1,'support':0},'period':{'own':10,'global':10},
	'action':{'func':q.event.resetCourse,'param':{},
}};

q.ability['fastmove'] = {'type':'dodge','name':'Invincibility','icon':'blessing.spike',
	'spd':{'main':1,'support':0},'period':{'own':25,'global':25,'bypassGlobalCooldown':true},'cost':{"mana":50},
	'action':{'animOnSprite':'boostWhite','func':'Actor.dodge','param':[4,200]}
};	


q.dialogue['jenny'] = {'face':{'image':'villager-female.0','name':'Jenny'},
	'intro':{
		'first':{
			'text':"Hey! Break all the targets and receive a reward!",
			'exit':0,
			'option':[
				{'text':"Sure. Why not!",event:q.event.teleportCourse},
				{'text':"No."},
			],
		},
	},
};


q.map.btt001 = function(){
	var map = m.map();
	map.name = "Btt001";
	map.graphic = "btt001";
	map.lvl = 0;
	map.tileset = "v1.1";
	map.grid = ["00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000001111111111111111111111111111111111100000000","00000011111111111111111111111111111111111110000000","00000111111111111111111111111111111111111111000000","00000111111111111111111111111111111111111111000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000111000000011100000000000000011000000","00000110000000111000000011100000000000000011000000","00000110000000111000000011100000000000000011000000","00000110000000111111000011111110000000000011000000","00000110000000000111000011111110000000000011000000","00000110000000000111000011100000000000000011000000","00000110000000000111000011100000000000000011000000","00000110000000000000000011100000001110000011000000","00000110000000000000000000000000001110000011000000","00000110000000000000000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000111111111000000000000001110000011000000","00000110000111111111000000000000000000000011000000","00000110000111111111111111000111000000000011000000","00000110000111111111111111000111000000000011000000","00000110000000000000111111000111000000000011000000","00000110000000000000111111000111000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000011111111111111111111111111111111111110000000","00000001111111111111111111111111111111111100000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000"]
	var a = map.addon[q.id] = {};
	a.spot = {"e3":{"x":592,"y":496},"e6":{"x":912,"y":496},"e8":{"x":1104,"y":560},"e4":{"x":464,"y":624},"e7":{"x":976,"y":688},"e5":{"x":688,"y":720},"ea":{"x":1232,"y":784},"e2":{"x":464,"y":848},"q1":{"x":816,"y":848},"e1":{"x":496,"y":1136},"eb":{"x":1136,"y":1136}}
	a.path = {}
	a.variable = {}; 
	a.load = function(spot){
	
		m.actor(spot.e1,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e2,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e3,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e4,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e5,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e6,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e7,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e8,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.ea,'system',"target",{deathEvent:q.event.killTarget});
		m.actor(spot.eb,'system',"target",{deathEvent:q.event.killTarget});	
	
	} 
	a.loop = function(spot){} 
	return map;
};


q.mapAddon.goblinLand = {
	spot:{"n1":{"x":2704,"y":6032}},
	path:{},
	variable:{},
	load:function(spot){
		m.actor(spot.n1,"npc","regular",{
			name:'Jenny',
			'sprite,name':"villager-female0",
			angle:180,
			nevermove:1,
			dialogue:q.event.talkJenny,
		});
	
	}, 
	loop:function(spot){} 
}


exports.quest = q;





