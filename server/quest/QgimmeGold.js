"use strict";
var s = require('./../Quest_exports').init('v1.0','QgimmeGold');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "[NAME]";

/* STEPS TO COMPLETE QUEST
	Goal: Cheer up the sad guy by giving him 3 gold.

	STEPS:
	-Kill Dragon and get 1 gold
	-Answer Quiz and get 1 gold
	-Activate switch to unlock chest
	-Loot the chest to get 1 gold.
	-Talk with sad guy and give him 3 gold.


	NEED:
	Item Gold

	Dragon with deathFunc
		Quest variable so player can't get multiple gold.
		
	NPC with dialogue (quiz)
		Quest variable so player can't claim reward multiple times.

	Toggle that opens chest 
		Quest variable for chest locked/unlocked.

	Chest
		Quest variable if chest already looted.
		
	NPC with cheer up dialogue
		Test if have 3 gold
	
*/

q.variable = {
	killDragon:0,
	haveDoneQuiz:false,
	chestLocked:true,
	lootChest:false,
};

q.event = {
	viewChest:function(key){
		return s.get(key,'lootChest') === false;
	},
	lootChest:function(key){
		if(s.get(key,'chestLocked') === false){
			s.addItem(key,'gold',1);
			s.set(key,'lootChest',true);
		} else {
			s.chat(key,'This chest is locked.');
		}
	},
	viewTgOn:function(key){
		return s.get(key,'chestLocked') === true;
	},
	tgOnChest:function(key){
		s.set(key,'chestLocked',false);
	},
	talkRingo:function(key){
		s.dialogue(key,'ringo','cheerup','intro');
	},
	killDragon:function(key){
		if(s.get(key,'killDragon') === 0){
			s.addItem(key,'gold',1);
			s.set(key,'killDragon',1);
		}
	},
	giveGold:function(key){
		s.addItem(key,'gold',1);
		s.set(key,'haveDoneQuiz',true);
	},
	talkBob:function(key){
		if(s.get(key,'haveDoneQuiz') === false){
			s.dialogue(key,'bob','quiz','intro');
		} else {
			s.dialogue(key,'bob','quiz','alreadydone');
		}
	},
	testCheerUp:function(key){
		if(s.haveItem(key,'gold',3) === true){
			s.dialogue(key,'ringo','cheerup','yes');
			s.completeQuest(key);
		} else {
			s.dialogue(key,'ringo','cheerup','no');
		}
	}
};	

q.item['gold'] = s.item('Gold');

q.dialogue['ringo'] = {
	cheerup:{
		intro:{
			text:"Hello, I'm sad.",
			option:[
				{text:"I'll cheer you up.",
					event:q.event.testCheerUp
				},
				{text:"Bye."},
			]
		},
		yes:{
			text:"Thanks a lot."
		},
		no:{
			text:"You don't have 3 gold."
		},
	}
};

	
q.dialogue['bob'] = {
	quiz:{
		intro:{
			text:"Hello, let's do a quiz.",
			option:[
				{text:"Sure.",
					next:{node:'question1'},
				},
				{text:"Bye."},
			]
		},
		alreadydone:{
			text:"You have already done the quiz!",
		},
		wrong:{
			text:"Wrong!",
		},
		question1:{
			text:"What is the name of the NPC you want to cheer up:",
			option:[
				{text:"Zezima.",next:{node:'wrong'}},
				{text:"Ringo.",next:{node:'question2'}},
				{text:"Hulk.",next:{node:'wrong'}},
			]
		},
		question2:{
			text:"0,1,1,2,3,5,8,13,...:",
			option:[
				{text:"21.",next:{node:'success'}},
				{text:"18.",next:{node:'wrong'}},
				{text:"9001.",next:{node:'wrong'}},
			]
		},
		success:{
			text:"Congratz! Here's your gold!",
			event:q.event.giveGold,
		},
	}
};

q.map.tinyTown = function(){
	var map = m.map();
	map.name = "Tiny Town";
	map.graphic = "tinyTown";
	map.lvl = 0;
	map.tileset = "v1.2";
	map.grid = ["00000000000000000000000000000111100000001111000011","00011111111111111111111111111111000000000111111011","00111111111111111111111111111110000000000011111100","01111111111111111111111111111100000000000001111110","01111111111111111111111111111000000000000000111110","01100000000000000000000000000000000000000000000110","01100000000000000000000000000000000000000000000110","01100000111111111110000000000000000000000001100110","01100001000000000001000000000000000000000001100110","01100001000000000001000111100000000000000000000110","01100001000000000001000111100000000000000000000110","01100001000000000001000111100000000000000000000110","01100001000000000001000000000000000000000000000110","01100001000000000001000000000000000000000000000110","01100001000000000001000000000000000000000000000110","01100001100010001011000000000000000000000000000110","01100001111110001111000000000000000000000000000110","01100000111110001110000000000000000000001111000110","01100000000010001000000000000000000000001111000110","01100110000000000000000000000000000000001111000110","01100110000000000000000000000000000000000000000110","01100000000000000000000000000000011111111100000110","00111111100000000000000000000111111111111111000110","00011111110000000000000000011111111111111111110110","00000000011000000000000000011111111111111111110110","00000000001100000000000000011111111111111111110110","00011110000110000000000000011111111111111111110110","00011110011011000000000000011111111111111111110110","00011110011001100000000000011111111111111111110110","00000000000011100000000000011111111111111111110110","00000000000111100000000000011111111111111111110110","00000000111111000000000000011111111111111111110110","00000001111110000000000000011111111111111111110110","01100011111100000000000000011111111111111111110110","01100011111000000000000000011111111111111111110110","00000011000011110000000000000000011111111111110110","00000011000011110000000000001111011111111111110110","00000011000011110000000000001111011111111100110110","00000011000000000000000000001111011111111100110110","00000001111100000000000000000000000000000000000110","00000000111110000000000000000000000000000000000110","00000000000011000000000000000000000000000000000110","00111100000001100000000000000000000000001111000110","00111100000001101111111100000000000000001111000110","00111100000001101111111100000000000000001111000110","00111100011001101111100000000000000000000000000110","00000000011001100000000000000000000000000000000110","00000000000000111111111111111111111111111111111100","00000000000000011111111111111111111111111111111000","00000000000000000000000000000000000000000000000000"]
	var a = map.addon[q.id] = {};
	a.spot = {"e1":{"x":1136,"y":80},"q1":{"x":336,"y":336},"q2":{"x":496,"y":336},"n1":{"x":656,"y":1200},"n2":{"x":1168,"y":1360}}
	a.load = function(spot){
		m.actor(spot.n1,"npc","regular",{dialogue:q.event.talkRingo});
		m.actor(spot.n2,"npc","regular",{dialogue:q.event.talkBob,name:"Bob"});
		m.actorGroup(spot.e1,25*15,[["dragon","king",1,{deathEvent:q.event.killDragon}]]);	
		m.toggle(spot.q1,q.event.viewTgOn,q.event.tgOnChest);
		m.loot(spot.q2,q.event.viewChest,q.event.lootChest,'chest');
	
	} 
	return map;
};
exports.quest = q;





