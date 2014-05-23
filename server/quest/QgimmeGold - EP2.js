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

q.map.simple = function(){
	m.actor.simple('ringo',{dialogue:q.event.talkRingo});
	m.actor('bob',{dialogue:q.event.talkBob});
	m.minimized.actor('dragon',{deathEvent:q.event.killDragon});
	m.minimized.toggle('switch',q.event.viewTgOn,q.event.tgOnChest);
	m.minimized.loot('chest',q.event.viewChest,q.event.lootChest));
};

exports.quest = q;





