"use strict";
var s = require('./../Quest_exports').init('v1.0','QgimmeGold');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "[NAME]";

/* STEPS TO COMPLETE QUEST
	-Talk with a guy and select the option to cheer him up.
	
	NEED:
	1 npc that has a dialogue.
	dialogue has 2 options: cheer up and nope
	if choose cheer up, quest complete

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





