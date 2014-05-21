//Skill
Skill = {};
//TODO: same than itemlist
Skill.addExp = function(key,skill,amount,bonus,globalmod){
	if(typeof skill === 'object') Skill.addExp.action(key,skill,amount,bonus);
	else {
		var tmp = {}; tmp[skill] = amount || 0;
		Skill.addExp.action(key,tmp,bonus,globalmod || 1);
	} 
}



Skill.addExp.action = function(key,obj,bonus,globalmod){
	var player = List.all[key];
	for(var i in obj){
		var mod = globalmod * (bonus === false ? 1 : player.bonus.exp[i]);
		var amount = typeof obj[i] !== 'function' ? obj[i] : obj[i](player.skill.lvl[i],key);
		player.skill.exp[i] += amount * mod;		
		Skill.updateLvl(key,i);
		Server.log(2,key,'addExp',i,amount);
	}
}


Skill.updateLvl = function(key,sk){
	var ps = List.all[key].skill;
	var main = List.main[key];
	
	if(!sk) sk = Cst.skill.list;	//if no sk, update all skills
	sk = Tk.arrayfy(sk);
	
	for(var i in sk){
		var s = sk[i];
		if(ps.exp[s] >= Cst.exp.list[ps.lvl[s]+1]){
			var newLvl = Skill.getLvlViaExp(ps.exp[s]);			
			var lvlDiff = newLvl-ps.lvl[s];
			
			ps.lvl[s] = newLvl;
			Skill.lvlUp(key,s);
		}
	}
}

Skill.getLvlViaExp = function(exp){
	return Tk.binarySearch(Cst.exp.list,exp)
}


Skill.lvlUp = function(key,skill){
	var sk = List.all[key].skill;
	Chat.add(key,'You are level ' + sk.lvl[skill] + ' in ' + skill.capitalize() + '!');
	Server.log(1,key,'Skill.lvlUp',skill,sk.lvl[skill]);
	Skill.applyLvlDmgBoost(key);
}

Skill.unlockableContent = function(key){
	var total = Skill.getTotalLvl(key);
	var m = List.main[key];
	
	switch (total){
		case 10: Chat.add(key,"You have unlocked the Passive Grid! You can access it via the Equip Tab. The Passive Grid allows you to customize your character when you level up."); m.hideHUD.passive = 0; break;
		case 15: Chat.add(key,"The offensive and defensive windows now display the complete Elemental Dmg and Def formula! You can access it via the Equip Tab."); m.hideHUD.advancedStat = 0; break;
		case 20: Chat.add(key,"You can now increase the quest difficulty by activating Quest Challenges via the Quest Window."); m.hideHUD.questChallenge = 0; break;
		case 25: Chat.add(key,"You can now use Quest Orbs to increase your quest reward via the Quest Window."); m.hideHUD.questOrb = 0; break;
		case 30: Chat.add(key,"You can now use Upgrade Orbs to improve your equipment."); m.hideHUD.equipOrb = 0; break;
		case 40: Chat.add(key,"You can now use Upgrade Orbs to improve your abilities."); m.hideHUD.advancedAbility = 0; break;
	}
	
}

Skill.testLvl = function(key,sk,lvl){	//for req
	var player = List.all[key];
	
	if(typeof sk !== 'object'){	var skill = {};	skill[sk] = lvl;	} 
	else {var skill = sk;}
	
	for(var i in skill){
		if(player.skill.lvl[i] < skill[i]) return false;		
	}
		
	return true;
}


Skill.getTotalLvl = function(key){
	var sum = 0;
	for(var i in List.all[key].skill.lvl)
		sum += List.all[key].skill.lvl[i];
	return sum;
}

Skill.applyLvlDmgBoost = function(key){
	var act = List.all[key];
	var combatlvl = Actor.getCombatLevel(act);
	var boost = (10+combatlvl)/(10+combatlvl/2);
	
	Actor.permBoost(act,'applyLvlDmgBoost',[{stat:'globalDmg',value:boost,type:'***'}]);
	
}



Db.skillPlot = {
	'tree-red':{
		category:'tree',
		variant:'red',
		lvl:0,
		skill:'woodcutting',
		exp:100,
		getSuccess:function(lvl){
			return true;	
		},
		item:{
			'wood-0':0.5,
			'leaf-0':0.5,			
		},
	},
}










