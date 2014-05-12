
Actor.death = function(act){	
	var killers = Actor.death.getKillers(act);
	Actor.death.summon(act);
	if(act.type === 'npc') Actor.death.npc(act,killers);
	if(act.type === 'player') Actor.death.player(act,killers);
}

Actor.death.summon = function(act){
	for(var i in act.summon){
		for(var j in act.summon[i].child){
			Actor.remove(List.all[j]);
		}		
	}
}

Actor.death.player = function(act,killers){
	Server.log(3,act.id,'death');
	var key = act.id;
	var main = List.main[key];
	
	Main.screenEffect(main,{'name':'fadeout','time':50,'maxTimer':50,'color':'black'});
	
	//Quest
	if(main.questActive){
		main.quest[main.questActive]._deathCount++;	
		if(Db.quest[main.questActive].event.death) Db.quest[main.questActive].event.death(key);
	}
	//Message
	var string = 'You are dead... ';
	var array = [
		"Please don't ragequit.",
		"You just got a free teleport to a safe place. Lucky you.",
		"Try harder next time.",
		"You're feeling giddy!",
		"Is that all what you got?",
		"This game is harder than it looks.",
		"If someone asks, just say you died on purpose.",	
	];
	string += array.random();
	Chat.add(key,string);
	
	
	act.dead = 1;
	act.respawn = 25;
	
	if(act.deathEvent && killers[0]) 
		act.deathEvent(act.id,killers[0]);	
	
}

Actor.death.getKillers = function(act){
	for(var i in act.damagedBy) if(!List.all[i]) delete act.damagedBy[i];

	var tmp = Object.keys(act.damagedBy);	

	for(var i = tmp.length-1; i >= 0; i--){
		if(!List.main[tmp[i]]) tmp.splice(i,1);	//remove non-player
	}
	return tmp;

}

Actor.death.npc = function(act,killers){
	act.dead = 1;
	
	if(act.deathEvent) for(var i in killers) act.deathEvent(killers[i],act,act.map); 
	if(act.deathEventArray) act.deathEventArray(killers,act,act.map); 
	
	Actor.death.drop(act,killers);	//increase _enemyKilled here
	Actor.death.exp(act,killers);
	Actor.death.performAbility(act);				//custom death ability function
	Activelist.clear(act);
}

Actor.death.performAbility = function(act){
	for(var i in act.deathAbility){
		Actor.performAbility(act,Actor.getAbility(act)[act.deathAbility[i]],false,false);
	}
}

Actor.death.drop = function(act,killers){		//TOFIX toremove
	if(!act.quest) return;
	for(var p in killers){
		var key = killers[p];

		var drop = Db.quest[act.quest].drop;
		var chanceMod = drop.getDropMod(List.main[key].quest[act.quest]._enemyKilled++,key);
		
		var quantity = List.all[key].item.quantity; 
		var quality = List.all[key].item.quality; 	//only for plan
		var rarity = List.all[key].item.rarity; 	//only for plan
		
		
		
		//Category
		var list = Drop.getCategoryList(drop.category,act.lvl,quantity);
		console.log(list);
		
		for(var i in list){
			var item = list[i];
			if(Math.random() < Math.probability(item.chance,chanceMod)){	//quantity applied in Drop.getList
				var amount = Math.round(item.amount[0] + Math.random()*(item.amount[1]-item.amount[0]));	
				Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':item.name,'amount':amount,'timer':Drop.TIMER,'viewedIf':[key]});			
			}
		}
			
		
		//Plan
		for(var i in drop.plan){
			var random = Math.random();
			var prob = Math.probability(drop.plan[i],chanceMod);
			var type = '';
			if(random/5 < prob) type = 'white'
			else if(random < prob) type = 'regular';
			else continue;
			
			var id = Plan.creation({	//craft plan
				'rarity':rarity,
				'quality':quality,
				'piece':Cst.getPiece(i),
				'type':Cst.getType(i),
				'lvl':act.lvl,
				'category':'equip',
				'minAmount':type === 'white' ? 0 : undefined,
				'maxAmount':type === 'white' ? 1 : undefined,
			});
		
			Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':id,'amount':1,'timer':Drop.TIMER,'viewedIf':[key]});	
			break;
		}
	}

}

Actor.death.respawn = function(act){	//for player
	var rec = act.respawnLoc.recent;
	
	var good = List.map[Actor.teleport.getMapName(act,rec.map)] ? rec : act.respawnLoc.safe;
	Actor.teleport(act, good);
		
	Combat.clearStatus(act);
	Actor.boost.removeAll(act);
	for(var i in act.resource)
		act[i] = act.resource[i].max;
	act.dead = 0;
	
	Server.log(3,act.id,'respawn',act.x,act.y,act.map);
	
}
//ts("Plan.creation({'rarity':0,'quality':0,'piece':'melee','lvl':10,'category':'equip',});")


Actor.death.exp = function(act,killers){
	if(!act.quest) return;
	var q = Db.quest[act.quest].drop;
	for(var i in killers){
		var key = killers[i];
		var amount = List.main[key].quest[act.quest]._enemyKilled;
		var exp = q.getExp(q.getDropMod(amount,key),amount,key);
		var mod = Math.pow(Math.max( (Actor.getCombatLevel(List.all[key]) + 5)/act.lvl , 1),2);	//if 5 less => 100%, if 10 less, lvl/lvl ^ 2
		mod *= Quest.getBonus(key,act.quest,false).item;
		Skill.addExp(key,exp,true,mod);
	}
}







