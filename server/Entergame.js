var db = requireDb();

Load.enterGame = function(key,account,act,main,socket){ //Called when player logs in
	if(account.lastSignIn === null) Load.enterGame.first(key,account);
	else if(Date.nowDate(account.lastSignIn) !== Date.nowDate())
		Cycle.day.quest(key);
		
	db.update('account',{username:account.username},{'$set':{online:1,lastSignIn:Date.now()}},function(err, res) { if(err) throw err
		socket.emit('signIn', { success:1, data:Load.enterGame.initData(key,act,main)});
	});
	
	var time = Math.floor(account.timePlayedThisWeek/Cst.HOUR) + 'h ' + Math.floor(account.timePlayedThisWeek%Cst.HOUR/Cst.MIN) + 'm';
	Chat.add(key,"You have played " + time + " this week.");
	
	
	Load.enterGame.hideHUD(key);
	Load.enterGame.quest(key);
	Load.enterGame.teleport(key);
	if(Server.testing) Load.enterGame.testing(key);
	
	
	act.boost.list['bullet-spd'].permBase *= 3;
	Actor.update.permBoost(act);
		
	
	Actor.setTimeout(act,'bugAbility',2*25,Test.setAbility);	//TOFIX
	//if(!List.main[key].questActive) Quest.start(key,'QgoblinJewel');
	if(Quest.test.name) Chat.add(key,'Game engine set to create the quest: \"' + Quest.test.name + '\".');
}

Load.enterGame.testing = function(key){
	Db.quest["Qtest"].event._start(key);	//test
	if(Quest.test.name){
		Itemlist.add(key,Quest.test.name + '-QuestTester');
		if(Db.quest[Quest.test.name].event._test && Db.quest[Quest.test.name].event._test.signIn)
			Db.quest[Quest.test.name].event._test.signIn(key);
	}
	
	if(Quest.test.minimized) Actor.teleport(List.all[key],{map:'minimizedMap',x:100,y:100});
}

Load.enterGame.initData = function(key,player,main){
	//Value sent to client when starting game
    var data = {'player':{},'main':{},'other':{}};
    var obj = {'player':player, 'main':main}

    var array = {
        'player':{
            'name':0,
            'x':0,
            'y':0,
            'map':Change.send.convert.map,
            'equip':Change.send.convert.equip,
            'weapon':0,
            'skill':0,
            'ability':Change.send.convert.ability,
            'abilityList':Change.send.convert.abilityList,
			'permBoost':0,
        },
        'main':{
            'passive':0,
            'social':0,
            'quest':0,
			'questActive':0,
			'invList':Change.send.convert.itemlist,
			'bankList':Change.send.convert.itemlist,
			'tradeList':Change.send.convert.itemlist,
			'hideHUD':0,			
        }
    }
    for(var i in array){
        for(var j in array[i]){
            if(array[i][j]){ data[i][j] = array[i][j](obj[i][j],player);  continue;}
            data[i][j] = obj[i][j];
        }
    }
		
	data.other.passiveGrid = [
		Db.passiveGrid.moddedGrid[main.passive.freeze[0] || Date.nowDate()],
		Db.passiveGrid.moddedGrid[main.passive.freeze[1] || Date.nowDate()]
	];
	
	var q = {};	for(var i in Db.quest) if(Db.quest[i].visible) q[i] = Db.quest[i].name;
	data.other.quest = q;
	
	var h = {}; for(var i in Db.highscore) h[i] = Db.highscore[i].name;
	data.other.highscore = h;
	
	data.other.infoDay = Load.enterGame.infoDay.random();
	data.other.questTest = Quest.test.name;
	
	return data;
}

Load.enterGame.teleport = function(key){
	var act = List.all[key];
	act.map = null;
	
	var recentmap = Actor.teleport.getMapName(act,act.respawnLoc.recent.map);
	if(List.map[recentmap])
		Actor.teleport(act,act.respawnLoc.recent);
	else Actor.teleport(act,act.respawnLoc.safe);
}

Load.enterGame.first = function(key){
	var inv = List.main[key].invList;
	var act = List.all[key];
			
	Chat.add(act.id,"Note: This is a very early beta. Expect things to change... A LOT.");
	Chat.add(act.id,"Control: WADS. (For AZERTY users, change key binding via Pref Tab)");
	
	Actor.setRespawn(act,{x:1800,y:5600,map:'goblinLand@MAIN'});	//here if no Quest.test.name
	if(Db.quest[Quest.test.name] && Db.quest[Quest.test.name].event._test && Db.quest[Quest.test.name].event._test.firstSignIn){
		Db.quest[Quest.test.name].event._test.firstSignIn(key);
	}
	
	for(var i in Cst.equip.armor.piece)
		Actor.equip(act,'start-' + Cst.equip.armor.piece[i]);
	Actor.equip(act,'start-weapon');
	
	
}

Load.enterGame.fixAbilityCharge = function(key){
	for(var i in List.all[key].abilityChange.charge) 
		List.all[key].abilityChange.charge[i] = 0;
}

Load.enterGame.hideHUD = function(key){
	var total = Skill.getTotalLvl(key);
	if(total < 40) List.main[key].hideHUD.advancedAbility = 1;
	if(total < 30) List.main[key].hideHUD.equipOrb = 1;
	if(total < 25) List.main[key].hideHUD.questOrb = 1;
	if(total < 20) List.main[key].hideHUD.questChallenge = 1;
	if(total < 15) List.main[key].hideHUD.advancedStat = 1;
	if(total < 10) List.main[key].hideHUD.passive = 1;
}

Load.enterGame.quest = function(key){
	var mq = List.main[key].questActive;
	
	if(mq && Db.quest[mq].event._signIn)
		Db.quest[mq].event._signIn(key);	
}


Load.enterGame.infoDay = [ //{
	"If popup text doesn't disappear, press Esc.",
	"Press Tab to reply to last player who PMed you.",
	"Press Esc to remove current input in chat.",
	"If someone is bothering you, add him to your mute list. ($mute,[name] or right-click his name in the chat.)",
	"This game started off as a Flash game.",
	"Coding for this game was done exclusively with Notepad++.",
	"There are 3 modes for map instances: public, team and solo.",
	"You can use any ability with any weapon. However, the damage will be decreased if they don't match well.",
	"If you plan on sharing your Passive Build, don't forget that you can freeze the values to prevent popularity changes.",
	"Every day, every quest receives a bonus to its rewards (stackable bonus). Completing the quest will reset this bonus.",
	"You can only harvest Skill Plots once (ex: trees). To harvest it again, you need to complete the related quest. This is to prevent farming/grinding and botters.",
	"Monsters give exp and items upon killing. However, the loot has diminishing returns. (The more you kill, the less likely you will get loot.) Completing the quest related to the enemies will reset the diminishing returns.",
	"Levelling your combat stats will increase damage dealt and your defence. It will also allow you to wear better weapons and armors.",
	"If you no longer need an equip, you can salvage it into shards that can be used to craft new better equips.",
	
	"In a regular game, random tips like this one are shown on loading screens. Unfortunately, this game has none so I needed to show them that way XD.",
	"This game supports <a title=\"Puush is a 3rd party software that allows images and texts sharing instantly via a keyboard shortcut.\" href=\"http://puush.me/\" target=\"blank\">puush</a> links. Just copy paste the link in the chat and it will turn into a clickable link. By default, you can only click puush links from your friends.",
	
	"In the quest tab, you can shift-left click to start/abandon quests quickly. (Useful for speedruns)",
	
];//}





