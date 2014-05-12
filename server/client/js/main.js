//############################################

var gameStarted = false;
var key = 0;

main = Main.template();

List = {
	all:{},		//EVERYTHING (player id refers to actor)
	actor:{},	//all mortals (player,enemy)
	bullet:{},	//all bullet
	anim:{},	//all anim
	strike:{},	//all strike
	group:{},	//all enemy group
	drop:{},	//all drop
	anim:{},	//all animation
	main:{},	//all List.main of player. (player id) List.main[id].something on server => window.something on client
	map:{},		//all maps including instance 
	socket:{},	//all socket (player id)
	btn:{},		//all buttons
	ctx:{},		//all of canvas (window,popup,stage)
	sfx:{}, 	//all sfx
};
//local compilation of information so server doesnt send many times the same info
Db = {equip:{},ability:{},item:{},plan:{},quest:{},customMod:{},customImg:{},highscore:{}};



//############################################




//Log In
Sign = {};
Sign.in = function(){
	var user = $("#lg-username")[0].value;
	var pass = $("#lg-password")[0].value;
	if(!window.chrome) Sign.log("This game is only compatible with Google Chrome.<br>"+
	"You are currently using " + navigator.browserVersion + '.<br>' +
	'You can download Google Chrome at <br><a href="https://www.google.com/chrome/">www.google.com/chrome/</a>');
	else socket.emit('signIn', { 'username': user,'password': pass });
}

Sign.up = function (){
	var user = $("#lg-username")[0].value;
	var pass = $("#lg-password")[0].value;
	var confirm = pass;
	//var confirm = $("#confirmSignUp")[0].value;
	if(pass !== confirm){ Sign.log('Passwords do not match.'); return;}
	if(user && pass){ socket.emit('signUp', { 'username': user,'password': pass }); }
}

Sign.log = function(text){
	$("#lg-message")[0].innerHTML = text;	
}


socket.on('signIn', function (data) {
	if(data.success) Init.game(data.data); 
	else Sign.log(data.message); 
	
});

socket.on('signUp', function (data) {
	Sign.log(data.message);
});



//############################################


//Init
Init.game = function (data) {
	Init.game.main(data);
	Init.game.other(data);
	
	//Add Canvas. param2 = z-index
	//-11: mapBelow
	Init.game.addCanvas('stage','stage',-10);
	$("#stage").css({"border":'1px solid #000000'});
	//-9: mapAbove
	Init.game.addCanvas('minimap','minimapCanvas',-8);
	
	Init.game.addCanvas('win','windowCanvas',10);
	Init.game.addCanvas('passiveGrid','passiveGridCanvas',11);
	Init.game.addCanvas('pop','popCanvas',30);
			
	$("#minimapCanvas").css({"border":'4px solid #000000',"background":'#000000','top':'0px'});
	Draw.minimap.map.updateSize();
	
	html.chat.text.innerHTML = 'Welcome!';
	html.pm.text.innerHTML = '<br>'
	
	for(var i in main.social.message){Chat.receive(main.social.message[i]);}	main.social.message = [];   //for offline pm
	
	//Note: a part of Init.db are directly in index.html
	Init.db.customBoost();
	Init.db.stat();
	Init.actor();
	Init.db.ability();	//for orb/mod stuff
	
	Img.preload(Img.preloader,function(){   //load images
		$("#startDiv")[0].style.display = "none"; 	//remove enter user and psw
		$("#gameDiv")[0].style.display = "inline";  //show game
		
		localStorage.setItem('username',$("#lg-username")[0].value);
		
		Init.game.player(data);
		gameStarted = true;
		Song.play(Object.keys(Db.song).random());
		
		//setInterval(Loop,40);	//in Receive now
		socket.emit('clientReady',1); 
		
	});
}

Init.game.main = function(data){
	for(var i in data.main){ main[i] = data.main[i]; }    //set init values sent by server
	main.pref = JSON.parse(localStorage.getItem('pref')) || main.pref;
}
Init.game.player = function(data){  
	player = Tk.useTemplate(Actor.template('player'),data.player);	
	$("#chatUserName")[0].innerHTML = player.name + ': '; 
}
Init.game.other = function(data){
	Db.passiveGrid = data.other.passiveGrid;
	Db.passiveGrid.height = 20;
	Db.passiveGrid.width = 20;
	
	Db.questNameConvert = data.other.quest;	//TOFIX
	
	//highcore
	Db.highscoreList = data.other.highscore; //TOFIX
	
	var str = '';
	for(var i in Db.questNameConvert) str += '<option value="' + i + '">' + Db.questNameConvert[i] + '</option>';
	$("#highscoreWinSelectQuest")[0].innerHTML = str;
	$(document).on('change','#highscoreWinSelectQuest',function(){
		Draw.window.highscore.changeQuest();
	});
	
	$(document).on('change','#highscoreWinSelectCategory',function(){
		Command.send('win,open,highscore,' + this.value);
	});
	
}
Init.game.addCanvas = function(name,id,z){
	//To add a canvas to the game
	var cv = document.createElement("canvas");
	cv.id = id;
	var fact = (name === 'minimap') ? main.pref.mapRatio : 1;
	cv.width = Cst.WIDTH / fact;
	cv.height = Cst.HEIGHT / fact;
	cv.style.position = 'absolute';
	cv.style.left = '0px';
	cv.style.top = '0px';
	cv.style.zIndex = z;
	if(z > 0) cv.style.pointerEvents = "none";
	
	cv.draggable = false;
	cv.onmousedown = function(e) {e.preventDefault();	return false; };
	$("#canvasDiv")[0].appendChild(cv);
	
	var ctx = cv.getContext("2d");
	ctx.canvas = cv;
	ctx.name = name;
	ctx.font = '20px Kelly Slab';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.save();
	List.ctx[name] = ctx;
}


socket.on('warning', function (d) {
	$("#warningText")[0].innerHTML = '<strong>Alert:</strong> ' + d.text;
	$("#warningDiv")[0].style.visibility = 'visible';
	if(d.signOff) setTimeout(function(){location.reload();},5000);
	else setTimeout(function(){$("#warningDiv")[0].style.visibility = 'hidden';},20000);
});



