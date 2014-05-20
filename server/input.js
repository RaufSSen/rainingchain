Input = {};
Input.click = function(socket,d){
	//data format: [side,x,y]
	socket.timer = 0;
	var key = socket.key;
	d[1] = d[1].mm(0,Cst.WIDTH);
	d[2] = d[2].mm(0,Cst.HEIGHT);
	
	Button.test(key,d[1],d[2],d[0]);
	Button.reset(key);
}

Input.key = function(socket,d){
	socket.timer = 0;
	var player = List.all[socket.key];
	
	if(d.i){
		//d.i format: right,down,left,up,ability0,ability1...
		var move = d.i.slice(0,4);
		for(var i = 0 ; i < 4 ; i++){player.moveInput[i] = +move[i];}
		player.abilityChange.press = d.i.slice(4);
		
		if(player.abilityChange.press !== '000000' && player.combat) Actor.loop.ability.test(player);
	}
	
	if(d.m){
		player.mouseX = Math.min(Math.max(d.m[0],0),Cst.WIDTH);
		player.mouseY = Math.min(Math.max(d.m[1],0),Cst.HEIGHT);
	}
	player.angle = Tk.atan2(player.mouseY - Cst.HEIGHT/2,player.mouseX - Cst.WIDTH/2);	
}
















