var db = requireDb();


Quest.start = function(key,id){	//verification done in command
	var q = Db.quest[id];
	var mq = List.main[key].quest[id];
	mq._active = 1;
	List.main[key].questActive = id;
	
	if(q.event._start)	q.event._start(key);	
	
	for(var i in mq._challenge){
		if(mq._challenge[i]) q.challenge[i].start(key,id);
	}
	Quest.start.updateChallengeDoneBonus(key,id);
	
}

Quest.start.updateChallengeDoneBonus = function(key,id){
	var mq = List.main[key].quest[id];
	var q = Db.quest[id];
	var b = mq._bonus.challengeDone;
	
	b.item = 1;
	b.exp = 1;
	b.passive = 1;
	
	for(var i in mq._challengeDone){
		if(!mq._challengeDone[i]) continue;
		b.item *= q.challenge[i].bonus.perm.item;
		b.exp *= q.challenge[i].bonus.perm.exp;
		b.passive *= q.challenge[i].bonus.perm.passive;
	}
	
}	

Quest.abandon = function(key,id){
	if(Db.quest[id].event._abandon)	Db.quest[id].event._abandon(key);
	Quest.reset(key,id,1);
}

Quest.complete = function(key,id){
	var mq = List.main[key].quest[id];
	var q = Db.quest[id];
	
	Quest.complete.highscore(key,mq,q);
	Quest.complete.challenge(key,mq,q);
	
	Chat.add(key,"Congratulations! You have completed the quest \"" + q.name + '\"!');
	mq._complete++;
	
	if(q.event._complete) q.event._complete(key); 
	
	mq._bonus.cycle.exp = Math.max(mq._bonus.cycle.exp-0.20,0);
	mq._bonus.cycle.item = Math.max(mq._bonus.cycle.exp-0.20,0);
	
	Quest.reward(key,id);
	Quest.reset(key,id);
	Server.log(1,key,'Quest.complete',id);
}

Quest.complete.highscore = function(key,mq,q){
	for(var i in q.highscore){
		var score = q.highscore[i].getScore(key);
		if(!typeof score === 'number') continue;
		if(mq._highscore[i] == null
			|| (q.highscore[i].order === 'ascending' && score < mq._highscore[i])
			|| (q.highscore[i].order === 'descending' && score > mq._highscore[i])){
			mq._highscore[i] = score;
			
			var tmp = {'$set':{}};	tmp['$set'][q.highscore.id] = score;
			
			db.update('highscore',{username:List.all[key].username},tmp);
			Chat.add(key,'New Highscore for ' + q.highscore[i].name + ': ' + Tk.round(score,5) + '.'); 
		}
	}
}

Quest.complete.challenge = function(key,mq,q){
	for(var i in mq._challenge){
		if(!mq._challenge[i]) continue;
		if(q.challenge[i].successIf(key)){	
			if(!mq._challengeDone[i]){	//first time
				mq._challengeDone[i] = 1;
				Server.log(1,key,'Quest.complete.challenge',id,i);
				sum += q.challenge[i].success
			} 
		}
	}
}

Quest.reward = function(key,id){
	var mq = List.main[key].quest[id];
	var q = Db.quest[id];
	
	var bonus = Quest.getBonus(key,id);
	var reward = Quest.getReward(q,bonus);
	if(q.event._getScoreMod) reward.passive *= q.event._getScoreMod(key) || 0;
	
	if(mq._rewardScore === 0) mq._rewardScore = Math.pow(10,4*q.reward.passive.min/q.reward.passive.max);	//aka first time
	mq._rewardScore += reward.passive;
	
	mq._rewardPt = Math.min(Math.log10(mq._rewardScore)/4,1) * q.reward.passive.max;
	
	Skill.addExp(key,reward.exp,false);
	
	Chat.add(key,"You total quest score is " + Tk.round(mq._rewardScore,1) + " equivalent to " + Tk.round(mq._rewardPt,3) + " passive point. Repeat the quest to improve your reward.");
		
}

Quest.getBonus = function(key,id,includechallenge){
	var mq = List.main[key].quest[id];
	var q = Db.quest[id];
	var r = q.reward;
	var b = mq._bonus;
	
	var tmp = {
		item:b.orb.item * b.cycle.item * b.challengeDone.item,
		exp:b.orb.exp * b.cycle.exp * b.challengeDone.exp,
		passive:b.orb.passive * b.challengeDone.passive,
	};
	
	
	
	if(includechallenge !== false){
		for(var i in mq._challenge){
			if(!mq._challenge[i]) continue;
			if(q.challenge[i].successIf(key)){
				tmp.item *= q.challenge[i].bonus.success.item;
				tmp.exp *= q.challenge[i].bonus.success.exp;
				tmp.passive *= q.challenge[i].bonus.success.passive;
			} else {
				tmp.item *= q.challenge[i].bonus.failure.item;
				tmp.exp *= q.challenge[i].bonus.failure.exp;
				tmp.passive *= q.challenge[i].bonus.failure.passive;
			}
		}
	}
	return tmp;
}

Quest.getReward = function(q,bonus){	//TODO item? or not?
	var reward = Tk.deepClone(q.reward);
	var tmp = {passive:0,item:{},exp:{}};
	
	tmp.passive = reward.passive.mod * bonus.passive;
	
	for(var i in reward.exp) tmp.exp[i] = reward.exp[i] * bonus.exp;
	
	return tmp;
}




Quest.updateHint = function(key,id){
	if(Db.quest[id].event._hint) List.main[key].quest[id]._hint = Db.quest[id].event._hint(key);
}

Quest.reset = function(key,qid,abandon){
	var main = List.main[key];
	Actor.setCombatContext(List.all[key],'regular');
	var mq = main.quest[qid];
	
	var keep = ['_rewardScore','_rewardPt','_complete','_challengeDone','_highscore'];
	if(abandon){ keep.push('_skillPlot'); keep.push('_enemyKilled'); }
	var tmp = {};
	for(var i in keep) tmp[keep[i]] = mq[keep[i]];
	
	
	
	for(var i in Db.quest[qid].item){
		Itemlist.remove(main.invList,qid + '-' + i, 100000);
		Itemlist.remove(main.bankList,qid + '-' + i, 100000);
	}
	
	for(var i in mq._challenge){
		if(mq._challenge[i]) Db.quest[qid].challenge[i].off(key,qid);
	}
	
	var newmq = Main.template.quest[qid]();
	for(var i in tmp) newmq[i] = tmp[i];
	
	main.questActive = '';
	main.quest[qid] = newmq;
	Dialogue.end(key);
}

Quest.orb = function(key,quest,amount){	//when using orb on quest, only boost passive
	var mq = List.main[key].quest[quest];
	mq._orbAmount += amount;
	mq._bonus.orb.passive = Craft.orb.upgrade.formula(mq._orbAmount);
}



Quest.challenge = {};
Quest.challenge.toggle = function(key,qid,bid){	//when a player click on a quest bonus
	var mq = List.main[key].quest[qid];
	mq._challenge[bid] = !mq._challenge[bid];
	
	if(mq._challenge[bid])	Chat.add(key,'Bonus Turned On.');	//function activate when starting quest
	else 	Chat.add(key,'Bonus Turned Off.');
	
	Quest.challenge.update(key,qid);	
}
Quest.challenge.signIn = function(key){
	var mq = List.main[key].quest;
	var qa = List.main[key].questActive;
	if(!qa) return;
	for(var i in mq[qa]._challenge){
		if(mq[qa]._challenge[i])	Db.quest[qa].challenge[i].signIn(key,qa);
	}

}

Quest.challenge.update = function(key,qid){	//only used for visual, assume success
	var mq = List.main[key].quest[qid];
	
	mq._bonus.challenge.item = 1;
	mq._bonus.challenge.passive = 1;
	mq._bonus.challenge.exp = 1;
	
	for(var i in mq._challenge){
		if(mq._challenge[i]){	//active
			for(var j in Db.quest[qid].challenge[i].bonus.success)
				mq._bonus.challenge[j] *= Db.quest[qid].challenge[i].bonus.success[j];
		}	
	}
}

Quest.challenge.template = {};
Quest.challenge.template.speedrun = function(time,bonus){
	if(typeof time === 'string') time = time.chronoToTime();
	
	return {
		name:'Speedrunner',
		description:'Complete the quest in less than ' + time.toChrono() + '.',
		
		start:function(key,qid){
			var main = List.main[key];
			Actor.setTimeout(List.all[key],'timerquest',50,function(){
				Main.chrono(main,qid,'start',Db.quest[qid].name);	//this is importnat part, timeout not needed
			});
		},
		signIn:function(key,qid){},
		off:function(key,qid){
			Main.chrono(List.main[key],qid,'stop');
		},
		successIf:function(key,qid){
			return Main.chrono(List.main[key],qid,'stop') < this.timeLimit;
		},
		timeLimit:time,
		bonus:bonus || {
			success:{item:1.2,passive:1.5,exp:1.2},	
			failure:{item:0.8,passive:0.8,exp:0.8},
			perm:{item:1.02,passive:1.05,exp:1.02},	
		},
	}
}

Quest.challenge.template.survivor = function(amount,bonus){
	amount = amount || 1;
	return {
		name:'Survivor',
		description:'Complete the quest dying less than ' + amount + ' times.',
		
		start:function(key,qid){},
		signIn:function(key,qid){},
		off:function(key,qid){},
		successIf:function(key,qid){
			return List.main[key].quest[qid]._deathCount < this.deathLimit;
		},
		deathLimit:amount,
		bonus:bonus || {
			success:{item:1.2,passive:1.5,exp:1.2},	
			failure:{item:0.8,passive:0.8,exp:0.8},
			perm:{item:1.02,passive:1.05,exp:1.02},	
		},
	}
}

Quest.challenge.template.boost = function(boost,bonus){
	return {
		name:'Nerfed Stats',
		description:'Complete this quest with nerfed stats.',
		
		start:function(key,qid){
			Actor.permBoost(List.all[key],qid + 'boostChallenge', boost);
		},
		signIn:function(key,qid){
			Actor.permBoost(List.all[key],qid + 'boostChallenge', boost);
		},
		off:function(key,qid){
			Actor.permBoost(List.all[key],qid + 'boostChallenge');
		},
		successIf:function(key,qid){	return true;},
		
		bonus:bonus || {
			success:{item:1.2,passive:1.5,exp:1.2},	
			failure:{item:0.8,passive:0.8,exp:0.8},
			perm:{item:1.02,passive:1.05,exp:1.02},	
		},
	}
}



Quest.requirement = {};

Quest.requirement.update = function(key,id){
	//update the test about hte quest req (strike if done)
	var temp = '';	
	var q = Db.quest[id];
	
	for(var i in q.requirement){
		temp += q.requirement[i].func(key) ? '1' : '0';
	}
	List.main[key].quest[id].requirement = temp;
}

Quest.requirement.template = {}

Quest.requirement.template.skill = function(skill,lvl){
	return {
		func:function(key){
			return List.all[key].skill.lvl[skill] >= lvl;
		},		
		name:'Level ' + lvl + ' ' + skill.capitalize(),
		description:'Having at least level ' + lvl + ' in ' + skill.capitalize() + '.',	
	}
}

Quest.requirement.template.quest = function(quest){
	return {
		func:function(key){
			return List.main[key].quest[quest]._complete;		
		},		
		name:'Quest "' + Db.quest[quest].name + '"',
		description:'Having completed the quest ' + Db.quest[quest].name + '.',
	}
}

Quest.requirement.template.map = function(map,name){	//unused, bad... cant know map name cuz not model created yet
	return {
		func:function(key){
			if(!List.all[key].map.have(map,1)) return false;	//could add zone	
			return true;			
		},		
		name:'Map "' + name + '"',
		description:'You need to be in the map "' + name + '".',
	}
}









Quest.highscore = {};
Quest.highscore.template = function(){
	return {
		name:"Fastest Completion",
		order:"ascending",	//descending
	}
}

Quest.highscore.fetch = function(category,cb){
	var req = {}; req[category] = {$ne:null};
	var proj = {username:1,_id:0};	proj[category] = 1;
	var sort = {}; sort[category] = Db.highscore[category].order === 'ascending' ? 1 : -1;
	
	db.find('highscore',req,proj).limit(15).sort(sort,function(err,res){ if(err) throw err;
		for(var i = 0; i < res.length; i++){
			res[i].rank = i+1;
			res[i].score = res[i][category];
			delete res[i][category];
		}
		cb(res);
	});	
	
	//ts("Quest.highscore.fetch(key,'Qbtt-time')")
}

Quest.highscore.fetchRank = function(key,category,cb){
	var score = List.main[key].quest[Quest.highscore.getQuest(category)]._highscore[Quest.highscore.getCategory(category)];
	
	var tmp = {};
	if(Db.highscore[category].order === 'ascending') tmp[category] = {$lt: score || Cst.bigInt,$ne:null};
	else tmp[category] = {$gt: score || 0,$ne:null};
	
	db.count('highscore',tmp,function(err,result){	
		cb({
			rank:result.n+1,		//+1 cuz gt instead of gte
			username:List.main[key].username,
			score:score,
		});
	});
}

Quest.highscore.getQuest = function(str){
	return str.split('-')[0];
}

Quest.highscore.getCategory = function(str){
	return str.split('-')[1];
}

