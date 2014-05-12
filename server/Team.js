Team = {};

Team.template = function(){
	return {
		list:{},
		leader:'',	
	}
}

Team.join = function(act,name){
	Team.leave(act);
	
	act.team = name;
	
	if(!List.team[name]) Team.creation(act,name);
	
	if(Team.testQuest(act,name) === false){
		Chat.add(act.id,"You can't join this team because one of more players do not share the same active quest than you. Abandon your active quest or make sure they are doing the same than yours. You have been moved in a temporary team instead.");
		name = '!TEMP-' + act.name;
		Team.creation(act,name);
		act.team = name;
	}
	
	for(var i in List.team[name].list){
		if(i !== act.id) Chat.add(i,act.name + ' joined your team.');
	}
	
	List.team[name].list[act.id] = act.id;	
	
	
	Chat.add(act.id, 'You are now in team "' + name + '".');
}

Team.leave = function(act){
	var team = List.team[act.team];
	if(!team){ return; }	//normal if player loggin in
	
	delete team.list[act.id];

	if(team.list.$length() === 0){ delete List.team[act.team]; return; }
	
	if(team.leader === act.id){
		team.leader = team.list.random();
		for(var i in team.list)	Chat.add(i,"Your new team leader is " + List.all[team.leader].name + '.');
	}

	
}



Team.testQuest = function(act,name,questid){	//return true if OK
	name = name || act.team;
	var quest = questid || List.main[act.id].questActive;
	if(!quest) return true;
	
	for(var i in List.team[name].list){
		if(List.main[i].questActive && List.main[i].questActive !== quest) 
			return false
	}
	return true;
}

Team.creation = function(act,name){
	List.team[name] = {
		'leader':act.id,
		'id':name,
		'list':{
			
		
		}	
	}
	List.team[name].list[act.id] = act.id;
}
