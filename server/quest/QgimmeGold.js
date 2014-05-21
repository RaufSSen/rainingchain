"use strict";
var s = require('./../Quest_exports').init('v1.0','QgimmeGold');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "[NAME]";

/* STEPS TO COMPLETE QUEST
	Goal: Cheer up the sad guy by giving him 3 gold.

	STEPS:
	-Kill Dragon and get 1 gold
	-Answer Quizz and get 1 gold
	-Activate switch to unlock chest
	-Loot the chest to get 1 gold.
	-Talk with sad guy and give him 3 gold.


	NEED:
	Item Gold

	Dragon with deathFunc
		Quest variable so player can't get multiple gold.
		
	NPC with dialogue (quizz)
		Quest variable so player can't claim reward multiple times.

	Toggle that opens chest 
		Quest variable for chest locked/unlocked.

	Chest
		Quest variable if chest already looted.
		
	NPC with cheer up dialogue
		Test if have 3 gold

*/

q.variable = {

};

q.event = {
	talkRingo:function(key){
		s.dialogue(key,'ringo','cheerup','intro');
	},
	cheerUp:function(key){
		s.completeQuest(key);
	}
};	

q.item = {

};

q.dialogue['ringo'] = {
	cheerup:{
		intro:{
			text:"Hello, I'm sad.",
			option:[
				{text:"I'll cheer you up.",
					next:{node:'yes'},
					event:q.event.cheerUp
				},
				{text:"Bye."},
			]
		},
		yes:{
			text:"Thanks a lot."
		}
	}
};

q.minimizedMap = function(){
	m.minimized.actor('ringo',{dialogue:q.event.talkRingo});
}

exports.quest = q;





