"use strict";
var s = require('./../Quest_exports').init('v1.0','Qtest');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "Invisible...";
q.variable = {
	
};

q.highscore = {
	
};

q.event = {
	_start:function(key){
		var act = s.getAct(key);
		s.addItem(key,'generator');
		s.addItem(key,'equipGenerator');
		Test.generateEquip(key,0,5);
				
		s.addItem(key,'weapon');
		Actor.equip(act,'Qtest-weapon');
		
		//act.abilityList = {'Qtest-simple':1};
		//Actor.ability.swap(act,'Qtest-simple',0);
		
		Test.removeEquipInventory(key);
		
	}
}

q.item['generator'] = {'name':'Generator','icon':'magic.staff','stack':1,'drop':0,'option':[		
	{'name':'Tele','param':[],'func':function(key){
		Chat.question(key,{text:"x,y,map", func:function(key,x,y,map){
			if(map == '1'){ s.getAct(key).x += +x; s.getAct(key).y += +y; return; }
			Actor.teleport(s.getAct(key),{x:+x,y:+y,map:map});		
		}});	
	}},	
	{'name':'Item','param':[],'func':function(key){
		Chat.question(key,{text:"item,amount", func:function(key,item,amount){
			if(Db.item[item])	Itemlist.add(key,item,amount || 1);
			else Chat.add(key,'wrong');
		}});	
	}},
	{'name':'Enemy','param':[],'func':function(key){
		Chat.question(key,{text:"Category,Variant", func:function(key,cat,variant){
			Test.spawnEnemy(key,cat,variant);		
		}});	
	}},
	{'name':'Quest','param':[],'func':function(key){
		Chat.question(key,{text:"quest", func:function(key,quest){
			if(Db.quest[quest])
				Itemlist.add(key,quest + '-QuestTester');
		}});	
	}},
	{'name':'Invincible','param':[],'func':Test.invincible},
	{'name':'Ghost','param':[],'func':Test.ghost},
]};	

q.item['equipGenerator'] = {'name':'Equip Gen','icon':'system.gold','stack':1,'option':[
	{'name':'Craft Armor','func':'Plan.use','param':['randomArmor'],question:true,description:'Generate a armor'},
	{'name':'Craft Weapon','func':'Plan.use','param':['randomWeapon']},
	{'name':'Craft Weapon2','func':'Plan.use','param':['randomWeapon2']},
	{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
]};	

q.equip['weapon'] = {'piece': 'melee','type': 'mace','icon':'melee.mace',
	'name':"Mace",'sprite':{'name':"mace",'sizeMod':1},
	'dmg':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
}

q.ability['simple'] = {'type':'attack','name':'Fire Basic','icon':'attackMagic.fireball',
	'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
	'action':{'func':'Combat.attack','param':{
		'type':"bullet",'angle':0,'amount':1,
		'objImg':{'name':"fireball",'sizeMod':1.2},'hitImg':{'name':"fireHit",'sizeMod':0.5},
		'dmg':{'main':100,'ratio':{'melee':100,'range':100,'magic':100,'fire':100,'cold':100,'lightning':100}},
	}
}};
	

//{Map
q.map.test = function(){
	var map = m.map();
	map.name = "Test Zone";
	map.graphic = "goblinLand";
	map.tileset = 'v1.1';
	map.lvl = 0;	

	var a = map.addon.main = {};
	return map;
};



q.map.simpleMap = function(){
	var map = m.map();
	map.name = "Simple Map";
	map.graphic = "simpleMap";
	map.lvl = 0;
	map.tileset = "v1.2";
	map.grid = ["00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000"]
	var a = map.addon[q.id] = {};
	a.spot = {"a":{"x":240,"y":272},"b":{"x":400,"y":272},"c":{"x":560,"y":272},"d":{"x":720,"y":272},"e":{"x":880,"y":272},"f":{"x":1040,"y":272},"g":{"x":1200,"y":272},"h":{"x":1360,"y":272},"i":{"x":240,"y":464},"j":{"x":400,"y":464},"k":{"x":560,"y":464},"l":{"x":720,"y":464},"m":{"x":880,"y":464},"n":{"x":1040,"y":464},"o":{"x":1200,"y":464},"p":{"x":1360,"y":464},"q":{"x":240,"y":656},"r":{"x":400,"y":656},"s":{"x":560,"y":656},"t":{"x":720,"y":656},"u":{"x":880,"y":656},"v":{"x":1040,"y":656},"w":{"x":1200,"y":656},"x":{"x":1360,"y":656},"A":{"x":784,"y":752},"e1":{"x":240,"y":848},"e2":{"x":400,"y":848},"e3":{"x":560,"y":848},"e4":{"x":720,"y":848},"e5":{"x":880,"y":848},"e6":{"x":1040,"y":848},"e7":{"x":1200,"y":848},"e8":{"x":1360,"y":848},"n1":{"x":240,"y":1040},"n2":{"x":400,"y":1040},"n3":{"x":560,"y":1040},"n4":{"x":720,"y":1040},"t1":{"x":880,"y":1040},"t2":{"x":1040,"y":1040},"t3":{"x":1200,"y":1040},"t4":{"x":1360,"y":1040},"q1":{"x":240,"y":1232},"q2":{"x":400,"y":1232},"q3":{"x":560,"y":1232},"q4":{"x":720,"y":1232},"b1":{"x":880,"y":1232},"b2":{"x":1040,"y":1232},"b3":{"x":1200,"y":1232},"b4":{"x":1360,"y":1232}}
	a.path = {}
	a.variable = {}; 
	a.load = function(spot){} 
	a.loop = function(spot){} 
	return map;
};


//}


exports.quest = q;






