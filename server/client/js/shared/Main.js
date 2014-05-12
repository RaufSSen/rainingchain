
Main = {};

Main.template = function(key){
	var main = {
		'temp':{'reset':{}},
		"optionList":null,
		'chatInput':'',
		'pref':Main.template.pref(),
		
		"currentTab":"inventory",
		"windowList":{'highscore':0,'bank':0,'trade':0,'offensive':0,'defensive':0,'ability':0,'passive':0,'quest':0,'binding':0},
		"popupList":{'equip':0,'plan':0},
		'hideHUD':{'tab':0,'chat':0,'window':0,'popup':0,'minimap':0,'state':0,'advancedStat':0,'passive':0,'advancedAbility':0,questChallenge:0,questOrb:0,equipOrb:0},	
		
		'invList': [],
		'bankList':[],
		'tradeList':[],
		'dialogue':null,
		'name':'player000',		
		'username':'player000',	
		'sfx':'',
		'song':'',
		'chrono':{},
		'screenEffect':null,
		
		'pvpScore':[],
		
		
		'help':'',
		'passive':Passive.template(),
		'social':{
			'message':[],
			'list':{
				'friend':{},
				'mute':{},
				'clan':[],
			},
			'puush':0,
			'symbol':'',
			'status':'on',
			'muted':0,
		},
		
		questActive:'',
		quest:{},
		
	};
	if(SERVER){
		main['change'] = [];
		main['quest'] = Main.template.quest();
		main['invList'] = Itemlist.template('inventory');
		main['bankList'] = Itemlist.template('bank');
		main['tradeList'] = Itemlist.template('inventory');
		main['old'] = {};
		main['id'] = key;
	} else {
		main['context'] = {'text':''};
	}
	return main;
}

Main.passiveAdd = function(main,num,i,j){
	var key = main.id;
	//when player wants to add a passive
	if(Passive.getUnusedPt(key,num) <= 0){ Chat.add(key,"You don't have any Passive Points to use."); return;}
	if(main.passive.grid[num][i][j] !== '0'){ Chat.add(key,"You already have this passive.");	return;}
	if(!Passive.test.add(main.passive.grid[num],i,j)){Chat.add(key,"You can't choose this passive yet.");	return;}
	
	main.passive.grid[num][i] = main.passive.grid[num][i].set(j,'1');
	
	Passive.updatePt(key);
	Passive.updateBoost(key);
}

Main.passiveRemove = function(main,num,i,j){
	var key = main.id;
	//when player wants to add a passive
	if(main.passive.removePt <= 0){ Chat.add(key,"You don't have any Passive Remove Points to use."); return;}
	if(main.passive.grid[num][i][j] !== '1'){ Chat.add(key,"You don't have this passive.");	return;}
	if(!Passive.test.remove(main.passive.grid[num],i,j)){Chat.add(key,"You can't remove this passive because it would create 2 subgroups.");	return;}
	
	main.passive.grid[num][i] = main.passive.grid[num][i].set(j,'0');
	
	Passive.updatePt(key);
	Passive.updateBoost(key);
}

Main.closeAllWindow = function(main){
	if(main.windowList.trade && main.windowList.trade.trader){ List.main[main.windowList.trade.trader].windowList.trade = 0; }
	
	for(var i in main.windowList){
		main.windowList[i] = 0;
	}
}

Main.openWindow = function(main,name,param){
	Main.closeAllWindow(main);
	main.windowList[name] = 1;
		
	var key = main.id;
	
	if(name === 'quest'){
		main.windowList.quest = param;
		Quest.requirement.update(key,param);
		Quest.updateHint(key,param);
	}
	if(name === 'trade'){	//TOFIX BROKEN
		var tradermain = List.main[param];
		if(tradermain.windowList.trade || tradermain.windowList.bank) return Chat.add(key,'This player is busy.');
		Main.closeAllWindow(tradermain);
		main.windowList.trade = {'trader':param,'tradeList':tradermain.tradeList,'confirm':{'self':0,'other':0}};
		tradermain.windowList.trade = {'trader':key,'tradeList':main.tradeList,'confirm':{'self':0,'other':0}};		
	}
	if(name === 'highscore'){	
		main.windowList.highscore = param;
	}
}

Main.openPopup = function(main,name,id){
	var player = List.all[main.id];
	if(name === 'equip') main.popupList.equip = {'x':player.mouseX,'y':player.mouseY,'id':id};
	if(name === 'plan')	main.popupList.plan = {'x':player.mouseX,'y':player.mouseY,'id':id};
}

Main.examine = function(main, type, id){
	Main.openPopup(main,type,id);
}

Main.selectInv = function(main,obj){
	main.selectInv = {count:1,data:obj};
}

Main.abilityModClick = function(main,id){
	if(!main.windowList.ability){
		Chat.add(main.id,'The Ability Window needs to be opened to use this mod. It will have the following effect: <br>' + Db.abilityMod[id].info);
		return;
	} else {
		main.chatInput = ['$win,ability,addMod,' + id + ','   ,   0];
	}	
}

Main.chrono = function(main,name,action,text){
	var chrono = main.chrono;
	if(action === 'start')
		chrono[name] = {start:Date.now(),active:1,text:text || ''};
	if(action === 'stop'){
		if(!chrono[name]) return;
		if(chrono[name].active) chrono[name].end = Date.now(); 
		chrono[name].active = 0;
		return chrono[name].end - chrono[name].start;
	}
	if(action === 'remove')
		delete chrono[name];
}

Main.dropInv = function(main,id,amount){
	var inv = main.invList;
	var amount = Math.min(1,Itemlist.have(inv,id,0,'amount'));
	if(!amount) return false;
	
	var act = List.all[main.id];
	Itemlist.remove(inv,id,amount);
	Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':id,'amount':amount,'timer':25*30});
	Server.log(3,act.id,'dropInv',id,amount);
	return true;
}

Main.destroyInv = function(main,id,amount){
	var inv = main.invList;
	var amount = Math.min(1,Itemlist.have(inv,id,0,'amount'));
	if(!amount) return false;
	
	Itemlist.remove(inv,id,amount);
	Server.log(3,main.id,'destroyInv',id,amount);
	return true;
}

Main.screenEffect = function(main,info){
	main.screenEffect = info;
}




















