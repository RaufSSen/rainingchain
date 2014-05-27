Draw = {};
Draw.old = {'fl':'','quest':'','abilityShowed':'bulletMulti','abilityTypeShowed':'attack','abilitySub':''};
Draw.refresh = {};

Draw.loop = function (){
	//Clear
	for(var i in List.ctx){
		if(i === 'minimap') continue;	//managed  in Draw.minimap
		List.ctx[i].clearRect(0, 0, Cst.WIDTH, Cst.HEIGHT);
	}
	Draw.loop.visibility();
	
	
	List.btn = [];
	Input.event.mouse.drag.update();
	
	//Draw
	Draw.map('b');   //below player
	Draw.anim('b');  //below player
	Draw.drop();
	Draw.strike();
	Draw.actor();
	Draw.bullet();
	Draw.anim('a');  //above player
	Draw.map('a');   //above player
	Draw.actor.chatHead();

	Draw.screenEffect(main.screenEffect);
	
	if(!main.hideHUD.tab) Draw.tab();     //bottom right
	if(!main.hideHUD.chat) Draw.chat();    //bottom left

	if(!main.hideHUD.window) Draw.window();
	if(!main.hideHUD.popup) Draw.popup();
	
	if(!main.hideHUD.minimap && Loop.interval(3)) Draw.minimap();
	if(!main.hideHUD.state) Draw.state();

	Draw.logout();
	Draw.optionList();    //option when right-click

	Button.context();	//update for client buttons only
	Draw.context();     //top left
	Draw.hint();
	Draw.command();		
	
}

Draw.loop.visibility = function(){	
	for(var i in html){ 
		if(!Draw.loop.visibility.test[i]){ html[i].div.style.visibility = 'hidden'; continue; }
		
		if(Draw.loop.visibility.test[i]() && html[i].div.style.visibility !== 'visible'){	//aka true
			html[i].div.style.visibility = 'visible'
		}
		if(!Draw.loop.visibility.test[i]() && html[i].div.style.visibility !== 'hidden'){	//aka true
			html[i].div.style.visibility = 'hidden'
		}
	}
}

Draw.loop.visibility.test = {
	warning:function(){	return true;},
	map:function(){ return true; },
	pm:function(){ return true; },
	highscoreWin:function(){ return !!main.windowList.highscore; },
	chat:function(){ return !main.dialogue; },
	dialogue:function(){ return !!main.dialogue; },
}

Draw.map = function (layer){ ctxrestore();
	var SIZEFACT = Draw.map.cst.sizeFact;	

	ctx = List.ctx.stage;
	var map = Map.getMap();
	
	var IMAGERATIO = Draw.map.cst.imageRatio;
	var iw = Cst.WIDTH / IMAGERATIO;
	var ih = Cst.HEIGHT / IMAGERATIO;
	var mapAmount = IMAGERATIO/2+1;		//ex: ratio=4 => 2x2 maps makes whole screen => 3x3 to see everything if player is middle
	
	var startX = (player.x-Cst.WIDTH/2)/SIZEFACT;		//top right of screen in map ratio
	var startY = (player.y-Cst.HEIGHT/2)/SIZEFACT;
	
	var offsetX = -(startX % iw);				//offset where we need to draw first map
	var offsetY = -(startY % ih);
	
	if(startX < 0) offsetX -= iw;		//if negative, fucks the modulo
	if(startY < 0) offsetY -= ih;
	
	for(var i = 0; i < mapAmount; i++){
		for(var j = 0; j < mapAmount; j++){
			var mapX = Math.floor(startX/iw) + i;
			var mapY = Math.floor(startY/ih) + j;
			if(!map.img[layer][mapX] || !map.img[layer][mapX][mapY]) continue;
			var mapXY = map.img[layer][mapX][mapY];
			
			//problem is map not whole
			ctx.drawImage(mapXY, 0,0,iw,ih,(offsetX + iw*i)*SIZEFACT ,(offsetY + ih*j)*SIZEFACT,iw*SIZEFACT,ih*SIZEFACT);
		}
	}
	
}

Draw.map.cst = {
	sizeFact:2,		//enlarge the map image by this factor
	imageRatio:2  	//basically 1280 / size of 1 image
}

Draw.screenEffect = function(fx){
	if(!fx || fx.time < 0) return;
	if(fx.name === 'fadeout'){
		var a = Math.abs(fx.maxTimer/2 - fx.time);
		a = (1 - a/fx.maxTimer*2);
		ctx.globalAlpha = a;
		ctx.fillStyle = fx.color || 'black';
		ctx.fillRect(0,0,Cst.WIDTH,Cst.HEIGHT);
		ctx.globalAlpha = 1;
	}

	fx.time--;
}

Draw.logout = function(){
	ctx = List.ctx.pop;
	var size = 24;
	Draw.icon('system.close',Cst.WIDTH-size,0,size);
	Button.creation(0,{
		'rect':[Cst.WIDTH-size,Cst.WIDTH,0,size],
		"shiftLeft":{'func':Command.send,'param':['logout,' + i]},
		'text':"Shift-Left Click to safely leave the game.",
	});	
	
	//contact me
	Draw.icon('system.flag',Cst.WIDTH-size*2,0,size);
	Button.creation(0,{
		'rect':[Cst.WIDTH-size*2,Cst.WIDTH-size,0,size],
		"shiftLeft":{'func':function(){ $("#contactMe").dialog("open"); },'param':[]},
		'text':"Shift-Left to contact admin to report bug/player/hack/other.",
	});	
}

//Option
Draw.optionList = function(){ ctxrestore();
	if(!main.optionList) return;
	ctx = List.ctx.pop;
	
	//Draw Item Options
	var option = main.optionList.option;
	var name = main.optionList.name;
	var sx = main.optionList.x-60;
	var sy = main.optionList.y;
	
	var nameX = 5;
	var nameY = 20;
	var optionX = 7;
	var optionY = 25;

	var w = 120;
	var h = nameY + optionY*option.length
	
	sx = Math.min(sx,Cst.WIDTH - w);
	sx = Math.max(sx,0);
	sy = Math.min(sy,Cst.HEIGHT - h);
	sy = Math.max(sy,0);
	
	

	ctx.textAlign = 'left';
	
	//Name Frame;
	ctx.fillStyle = "#333333";
	ctx.fillRect(sx,sy,w,nameY);
	
	ctx.strokeStyle="black";
	ctx.strokeRect(sx,sy,w,nameY);
	
	ctx.setFont(15);
	ctx.fillStyle = "white";
	ctx.fillText(name,sx+nameX,sy);
		
		
	//Option Frame
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#696969";
	ctx.fillRect(sx,sy+nameY,w,optionY*option.length);
	ctx.globalAlpha = 1;
	
	ctx.strokeStyle="black";
	ctx.strokeRect(sx,sy+nameY,w,optionY*option.length);


	//Text + Button
	ctx.setFont(14);
	ctx.fillStyle = "yellow";
		
	for(var i = 0 ; i < option.length ; i++){
	
		var name = Draw.optionList.parse(option[i].name);	//no idea if still used
		ctx.fillText(name,sx+optionX,sy+optionY*(i+1));
		
		if(main.optionList.client || option[i].client){ 
			Button.creation(0,{
				'rect':[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
				"left":option[i],	//contain everything including func and param
				'text':option[i].description || option[i].name,
				});		
				
		}else {
			Button.creation(0,{
				'rect':[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
				"left":{'func':Command.send,'param':['option,' + i],question:option[i].question},
				'text':option[i].description || option[i].name,
				});	
		}
				
		
	}
	
}

Draw.optionList.parse = function(data){
	if(data.indexOf('\{') == -1) return data; 
	for(var i = 0 ; i < data.length ; i++){
		if(data[i] == '{' && data[i+1] == '{'){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == '}' && data[j+1] == '}'){
					var end = j+1;
					var tag = data.slice(start+2,end-1);
					
					if(tag.length > 100)  return data;
					data = data.replaceAll(
					'\\{\\{' + tag + '\\}\\}',
					eval(tag)
					);
					break;
				}
			}
		}
	}
	return data;
}

//Chat
Draw.chat = function(){ ctxrestore();
	ctx = List.ctx.stage;
	Draw.chat.main();
	
	if(main.dialogue){
		Draw.chat.dialogue();
	} else {
		var s = Draw.chat.constant();
		ctx.beginPath();
		ctx.moveTo(s.x,s.y+s.h-s.personalChatY-3);
		ctx.lineTo(s.w,s.y+s.h-s.personalChatY-3);
		ctx.stroke();	
	}
}

Draw.chat.main = function(){
	var s = Draw.chat.constant();
	
	//PM
	html.pm.div.style.left = (s.x + s.divX) + 'px'; 
	html.pm.div.style.top = (s.y + s.divY - s.pmY - s.pmDivY - s.disPmY) + 'px'; 
	
	html.pm.text.style.font = s.pmcharY + 'px Kelly Slab';
	html.pm.text.style.width = (s.w - 2*s.divX) + 'px';
	html.pm.text.style.height = (s.pmY) + 'px'
	html.pm.text.style.left = s.divX + 'px'; 
	html.pm.text.style.top = (s.divY- s.pmY - s.pmDivY - s.disPmY) + 'px'; 
	
	//Clan
	var str = 'Clan: ';
	for(var i in main.social.list.clan){ str += main.social.list.clan[i] + '  '; }
	ctx.setFont(15);
	ctx.fillStyle = 'white';
	ctx.fillText(str,(s.x + s.divX),(s.y - s.disPmY));
	
	
	//HTML
	html.chat.div.style.left = (s.x + s.divX) + 'px'; 
	html.chat.div.style.top = (s.y + s.divY) + 'px'; 
	
	html.chat.text.style.font = s.chatcharY + 'px Kelly Slab';
	html.chat.text.style.width = (s.w - 2*s.divX) + 'px';
	html.chat.text.style.height = (s.h - 2*s.divY - s.personalChatY) + 'px'
	html.chat.text.style.left = s.divX + 'px'; 
	html.chat.text.style.top = s.divY + 'px'; 
	
	chatUserName.style.font = s.personalChatY + 'px Kelly Slab';
	
	html.chat.input.size=(50-player.name.length).toString();
	html.chat.input.maxlength="150";	
	html.chat.input.style.font = s.personalChatY + 'px Kelly Slab';
	html.chat.input.style.height = s.personalChatY + 'px'
	
	/*	
	html.dialogue.div.style.width = (s.w - 2*s.divX) + 'px';
	html.dialogue.div.style.height = (s.h - 2*s.divY) + 'px'
	html.dialogue.div.style.left = (s.x + s.divX) + 'px'; 
	html.dialogue.div.style.top = (s.y + s.divY + s.dialogueTopDiffY) + 'px'; 
	*/
	
	//MainBox
	ctx.globalAlpha = 0.8;
	ctx.fillStyle="#F5DEB3";
	ctx.fillRect(s.x,s.y,s.w,s.h);
	ctx.globalAlpha = 1;
	ctx.strokeStyle="black";
	ctx.strokeRect(s.x,s.y,s.w,s.h);
	ctx.fillStyle="black";

}

Draw.chat.dialogue = function(){
	var s = Draw.chat.constant();
	var dia = main.dialogue;
	
	if(dia.face){	s.numX += s.faceX;} 
	if(dia.option){ var nY = s.y+s.h-10-dia.option.length*20; }	
			
	html.dialogue.text.style.width = s.w - 2*s.textBorder + 'px';
	html.dialogue.text.style.font = '20px Kelly Slab';
	html.dialogue.div.style.top = (s.y + s.divY*2) + 'px';
		
	if(dia.face){
		html.dialogue.text.style.width = s.w - 2*s.textBorder-s.faceX + 'px';
		html.dialogue.div.style.left = (s.x + s.divX + s.textBorder + s.faceX) + 'px';
		Draw.face(dia.face,s.facesX,s.y+s.facesY,96);
	} 
	
	//Options
	var str = dia.text;
	for(var i in dia.option){
		str  += '<br><span ' +
			'onclick="Command.send(\'dialogue,option,' + i + '\');" ' +
			'>' +
			'<font size="4">&nbsp; - ' + dia.option[i].text + '</font>' +
			'</span>';
	}
	Draw.setInnerHTML(html.dialogue.text,str);
	
	
	if(dia.exit !== 0){
		Draw.icon('system.close',s.w-24,s.y,24,{
			"left":{'func':Command.send,'param':['dialogue,option,-1']},
			'text':"End dialogue.",
		});	
	}
	
}


Draw.chat.constant = function(){
	return  {
		w:600,
		h:200,
		x:0,
		y:Cst.HEIGHT-200,
		numX:5,			//border for text
		faceX:96 + 5,	//push dia text by that if has face
		facesX:15,		//border for face	
		facesY:30,		//border for face
		optionY:20,		//Y between options
		textBorder:20, //distance between border of box and where text starts, applied to start and end
		personalChatY:20, //size for player own written stuff (chatBox not dialogue)
		
		dialogueTopDiffY:10,
		
		chatcharY:20, 
		
		divX:5,
		divY:5,
		
		//pm
		pmY:200,
		disPmY:20, //distance between botoom of pm and top of chat
		pmcharY:20,
		pmDivY:5,
	}
}

Draw.icon = function(info,x,y,size,text){
	size = size || 32;
	var slot = Img.icon.index[info];
	
	var whatImage = Math.floor(slot.y/(Img.icon.row*48));

	ctx.drawImage(
		Img.icon[whatImage],
		slot.x,
		slot.y%(Img.icon.row*48),
		Cst.ICON,
		Cst.ICON,
		x,
		y,
		size,
		size
	);
		
	if(!text) return;
	var button = Tk.deepClone(text);
	if(typeof button === 'string') button = {text:button};
	button.rect = [x,x+size,y,y + size];
	Button.creation(0,button);

	return Collision.PtRect(Collision.getMouse(),button.rect);
}


Draw.item = function(info,x,y,size,cb){
	size = size || 32;
	info = typeof info === 'string' ? [info,1] : info;
	
	Draw.icon(info[0],x,y,size,cb);
	var amount = info[1];
	
	if(amount === 1) return;
	
	if(amount >= 100000){
		amount = Math.floor(amount/1000);
		if(amount >= 10000)	amount = Math.floor(amount/1000) + "M";
		else amount = amount + "K";
	}
		
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = "black";
	ctx.strokeStyle = "white";
	ctx.roundRect(x-2,y+size-2,size+4,15);
	ctx.globalAlpha = 1;
	
			
	ctx.fillStyle = "yellow";
	ctx.setFont(size/32*13);
	ctx.fillText(amount,x,y+size-2);
	
}

Draw.element = function(x,y,w,h,data,noover){
	var initCtx = ctx.name;
	var xx = x;
	ctx.save();
	ctx.textAlign = 'left';
	ctx.strokeRect(x,y,w,h);
	var total = 0; for(var i in data){	total += data[i]; }
	
	var mx = Math.min(Input.mouse.x,Cst.WIDTH-150);
	var my = Math.min(Input.mouse.y,Cst.HEIGHT-25);
	
	for(var i in data){
		var length = w*data[i]/total;
		
		if(length > 2){
			ctx.fillStyle = Cst.element.toColor[i];
			ctx.roundRect(x,y,length,h);
		}
		if(Collision.PtRect(Collision.getMouse(),[x,x+length,y,y+h])){
			var mouseOverRatio = i; 
		}
		x += length;
	}
	
	ctx.lineWidth = 2;
	ctx.roundRect(xx,y,w,h,0,1);
	ctx.lineWidth = 1;
	
	if(!noover && mouseOverRatio){
		ctx = List.ctx['pop'];
		var amount = data[mouseOverRatio];
		if(amount < 1){ amount = Tk.round(data[mouseOverRatio]*100,0) + '%' }
		else { amount = Tk.round(data[mouseOverRatio],0) }
		
		var text = mouseOverRatio.capitalize() + ': ' + amount;
		var width = ctx.measureText(text).width;
		ctx.fillStyle = Cst.element.toColor[mouseOverRatio];
		ctx.roundRect(mx,my-30,width+10,30);
		ctx.fillStyle = 'black';
		ctx.fillText(text,mx+5,my+3-30);
	}
	ctx = List.ctx[initCtx];
	ctx.restore();
}

Draw.convert = {};

Draw.convert.boost = function(boost){
	//Convert a boost object into a string.
	if(boost.type === 'custom'){ return Db.customBoost[boost.value].name; }
	
	
	var name = Db.stat[boost.stat].name;
	
	//Round and add %
	var value = boost.value;
	var rawValue = boost.value;
	if(Math.abs(value) < 1){ 
		value *= 100; value = Tk.round(value,2).toString() + '%';
	} else { value = Tk.round(value,2)};
	
	
	var last = name[name.length-1];
	if(last == 'x' ||  last == '*' || last == '+' || last == '^'){
		if(rawValue < 0){value = '-' + last + value;}
		if(rawValue > 0){value = last + value;}
		name = name.slice(0,-1);
	} else {
		if(value < 0){value = '-' + value;}
		if(value > 0){value = '+' + value;}
	}
	
	return [name,value];
	 
	/*
	if(boost.type == 'base'){	}
	else if(boost.type == 'max'){
		return '-Set Max ' + prename + ' to ' + value;
	} else if(boost.type == 'min'){
		return '-Set Min ' + prename + ' to ' + value;
	}
	*/
}

Draw.gradientRG = function(n){
	n = Math.min(1,Math.max(0,n));
	if(n<0.5){
		var R = 0+(n*(255/0.5));
		var G = 255;
		var B = 0;
	} else {
		var n = n-0.5;
		var R = 255;
		var G = 255-(n*(255/0.5));
		var B = 0;
	} 
	return 'rgb(' + Math.round(R) + ',' + Math.round(G) + ',' + Math.round(B) + ')';
}

Draw.context = function (){ ctxrestore();
	var text = main.context.text;
	if(!text) return;
	
	var top = main.context.textTop;
	var hc = html.context.div;
	
	hc.style.visibility = 'visible';
	if(hc.innerHTML === text) return;	//same texts
	
	if(!top){
		hc.innerHTML = text;
		hc.style.left = (Input.mouse.x + 25).mm(0,Cst.WIDTH-hc.offsetWidth) + 'px';
		hc.style.top = (Input.mouse.y + 25).mm(0,Cst.HEIGHT-hc.offsetHeight) + 'px';
	} else {
		hc.style.left = Cst.WIDTH/2-150 + 'px'
		hc.style.top = "25px";
		text = '<font size="5">' + text + '</font>'
		hc.innerHTML = text;
	}
	
	
}

Draw.command = function(){
	html.command.div.style.visibility = html.command.div.innerHTML ? 'visible' : 'hidden';
	
	html.command.div.style.top = '550px';
	html.command.div.style.left = '100px';
	
	if(html.chat.input.value[0] !== '$'){
		html.command.div.innerHTML = '';
		return;
	}
	
	if(Draw.old.command === html.chat.input.value) return;
	
	Draw.old.command = html.chat.input.value;
	
	var info = html.command.div;
	
	var txt = html.chat.input.value.slice(1);
	for(var i in Command.list){
		if(txt.have(i)){
			var cmd = Command.list[i].doc;
			var str = cmd.description;
			for(var j in cmd.param){
				str += '<br>@param' + j + ' ' + cmd.param[j].name + ' [' + cmd.param[j].type + ']';
				if(cmd.param[j].optional) str += ' -Optional'
			}
			info.innerHTML = str;	
			return;			
		}
	}
	info.innerHTML = '';
	
}

Draw.setInnerHTML = function(el,str,name){
	name = name || (new Error()).stack.split('\n    at ')[2];

	if(Draw.old[name] !== str){
		Draw.old[name] = str;
		el.innerHTML = str;
	}

}

Draw.face = function(info,x,y,size){
	size = size || 96;
	if(info === 'player') info = {image:'warrior-man.0','name':player.name};
	var slot = Img.face.index[info.image];
	ctx.drawImage(Img.face,slot.x,slot.y,Cst.FACE,Cst.FACE,x,y,size,size);

	Button.creation(0,{
		'rect':[x,x+size,y,y + size],
		'text':info.name,
	});	
	
	ctx.textAlign = 'center';
	ctx.fillText(info.name,x+size/2,y+size+5);
	ctx.textAlign = 'left';
	
}




Draw.mapOtherSystemUnused = function(){
	//'map':{'a':{'canvas':$("#mapAbove" + "Canvas")[0],'ctx':$("#mapAbove" + "Canvas")[0].getContext('2d')},'b':{'canvas':$("#mapBelow" + "Canvas")[0],'ctx':$("#mapBelow" + "Canvas")[0].getContext('2d')}},
	//<canvas id="mapAboveCanvas" class='posAbs' width='12800' height='7200' style="z-index:-9; width:12800px; height:7200px; background-color:red;"></canvas>
	//<canvas id="mapBelowCanvas" class='posAbs' width='12800' height='7200' style="z-index:-11; width:12800px; height:7200px; background-color:yellow;"></canvas>
					
	Draw.mapLoop = function(layer){
		html.map.a.canvas.style.left = (-player.x + Cst.WIDTH/2) + 'px';
		html.map.a.canvas.style.top = (-player.y + Cst.HEIGHT/2) + 'px';
		html.map.b.canvas.style.left = (-player.x + Cst.WIDTH/2) + 'px';
		html.map.b.canvas.style.top = (-player.y + Cst.HEIGHT/2) + 'px';
	}

	Draw.mapInit = function(layer){
		var map = Map.getMap();
		var mapAmount = 10;
		var width = 640;
		var height = 360;
		
		for(var i = 0; i < mapAmount; i++){
			for(var j = 0; j < mapAmount; j++){
				if(!map.img['b'][i] || !map.img['b'][i][j]) continue;
				//problem is map not whole
				//html.map.b.ctx.drawImage(map.img['b'][i][j],0,0,width,height, i*width*2,j*height*2,width*2,height*2);
				html.map.a.ctx.drawImage(map.img['a'][i][j],0,0,width,height, i*width*2,j*height*2,width*2,height*2);
			}
		}
	}
}




