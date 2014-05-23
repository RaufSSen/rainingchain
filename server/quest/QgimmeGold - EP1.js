"use strict";
var s = require('./../Quest_exports').init('v1.0','QgimmeGold');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "[NAME]";

/* STEPS TO COMPLETE QUEST
	STEPS:
	-Talk with sad guy and cheer him up.
*/

q.variable = {
};

q.event = {
	talkRingo:function(key){
		s.dialogue(key,'ringo','cheerup','intro');
	},
	ceerUp:function(key){
		s.completeQuest(key);
	}
};	

q.dialogue['ringo'] = {
	cheerup:{
		intro:{
			text:"Hello, I'm sad.",
			option:[
				{text:"I'll cheer you up.",next:{'node':'yes'},
					event:q.event.cheerUp
				},
				{text:"Bye."},
			]
		},
		yes:{
			text:"Thanks a lot."
		},
	}
};

	

q.minimizedMap = function(){
	m.minimizedActor('ringo',{dialogue:q.event.talkRingo});
};
exports.quest = q;





