/*
"mace":{                               //id of the sprite
    "src":"img/Sprite/human.png"        //image src
    "size":1.5,                         //size factor
    "side":[2,6,0,4,1,5,3,7],           //side[0] = 2 => the right-facing position is in the 3rd row. 
    "hpBar":-40,                        //hp bar distance from center (in y)
    "legs":35,                          //used when sorting draw by y.
	"preHitBox":[ -12,12,-35,35 ],      //hitbox before size factor (for dmg collision)
	"preBumperBox":[ -12,12,0,35 ],     //bumperbox before size factor  (for map collision)
	"anim": {                           //list of animations
		"walk":{            //name
		    "startY":0,     //startY pixel
	    	"frame":4,      //how many frames?
	    	"sizeX":70,     //size of 1 frame in x
	    	"sizeY":70,     //size of 1 frame in y
	    	"dir":8,        //how many direction can it face? (usually 4 or 8 if diagonal)
	    	"spd":0.8,      //speed of animation. 1 spd => every game frame, it moves to the next frame
	    	"walk":1,       //if walk, movement speed will impact frame spd
	    	"next":"walk"   //once animation complete, what animation to do?    //default is Walk
	    },
		"attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"walk"}
	}},
*/

Init.db.sprite = function(){
	
	var a = Db.sprite =	{};
    //ts('Sprite.change(p,{name:"taurus"});')
    //{ PLAYER
    a["mace"] = {"src":"actor/main.png","size":2.5,"side":[1,2,3,0],"hpBar":-50/3,"legs":20,
    	"preHitBox":[ -36/3,36/3,-16/3,56/3],"preBumperBox":[ -36/3,36/3,-16/3,56/3 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,"next":"walk"}
    	}};
		
	a["sword"] = {"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	a["spear"] = {"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	a["bow"] ={"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	a["wand"] ={"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	//}
    //{ NPC
   
	
	var list = {'warrior-male':6,'warrior-female':5,'villager-male':10,'villager-female':9,'villager-child':6,'fairy':8,'bad-monster':3,'bad-human':5};
	for(var i in list)	for(var j = 0; j < list[i]; j++) a[i + j] = {"src":"actor/" + i + j +".png",rgpvx:1};

	a["villager-female1"] ={"src":"actor/villager-female1.png","size":2,"side":[0,1,2,3],"hpBar":-22,"legs":16,
    	"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    	}};
	
		
    //}	
    //{ ENEMY
    a["slime"] ={"src":"actor/slimeJerome.png","size":1,"side":[0,1,2,3],"hpBar":-110,"legs":70,
    	"preHitBox":[ -70,70,-45,90 ],"preBumperBox":[ -55,55,-15,80 ],"anim": {
    		"walk":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"next":"walk"},
    	}};
    
    a["troll"] ={"src":"actor/troll.png","size":1,"side":[0,1,2,3],"hpBar":-70,"legs":35,
    	"preHitBox":[ -33,33,-30,64 ],"preBumperBox":[ -33,33,-30,64 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,"next":"walk"},
    	}};
    	
		
	a["orc-magic"] ={"src":"actor/orc-magic.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	a["orc-melee"] ={"src":"actor/orc-melee.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	a["orc-range"] ={"src":"actor/orc-range.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	//}
	//{ RPG MAKER
	a["aquanite"] = {"src":"actor/aquanite.png",rgpvx:1};
	a["aquagoblin"] ={"src":"actor/aquagoblin.png","size":2,"side":[2,0,1,3],"hpBar":-40,"legs":35,
    	"preHitBox":[ -15,15,-15,32 ],"preBumperBox":[ -15,15,-15,32 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":48,"sizeY":64,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":48,"sizeY":64,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	
	a["bat"] = {"src":"actor/bat.png",rgpvx:1};
	
	a["basilisk"] ={"src":"actor/basilisk.png","size":1,"side":[2,0,1,3],"hpBar":-40,"legs":35,
    	"preHitBox":[ -15,15,-15,32 ],"preBumperBox":[ -15,15,-15,32 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["bee"] = {"src":"actor/bee.png",rgpvx:1};
	
	a["draco"] ={"src":"actor/draco.png","size":1,"side":[2,0,1,3],"hpBar":-55,"legs":50,
    	"preHitBox":[ -30,30,-30,40 ],"preBumperBox":[ -30,30,-30,40 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["demon"] = {"src":"actor/demon.png",rgpvx:1};
	a["dragon"] = {"src":"actor/dragon.png",rgpvx:1};
	a["dragonBaby"] = {"src":"actor/dragonBaby.png",rgpvx:1};
	a["death"] = {"src":"actor/death.png",rgpvx:1};
	
	a["dragonKing"] ={"src":"actor/dragonKing.png","size":1,"side":[2,0,1,3],"hpBar":-55,"legs":50,
    	"preHitBox":[ -30,30,-30,40 ],"preBumperBox":[ -30,30,-30,40 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};
		
	a["larva"] = {"src":"actor/larva.png",rgpvx:1};
	a["gargoyle"] = {"src":"actor/gargoyle.png",rgpvx:1};
	a["ghost"] = {"src":"actor/ghost.png",rgpvx:1};
	a["goblin"] = {"src":"actor/goblin.png",rgpvx:1};
	a["goddessFire"] = {"src":"actor/goddessFire.png",rgpvx:1};
	a["goddessIce"] = {"src":"actor/goddessIce.png",rgpvx:1};
	
	a["plant"] = {"src":"actor/plant.png",rgpvx:1};
	a["mushroom"] = {"src":"actor/mushroom.png",rgpvx:1};
	a["skeleton"] = {"src":"actor/skeleton.png",rgpvx:1};
	a["mosquito"] = {"src":"actor/mosquito.png",rgpvx:1};
	
	
	a["scorpion"] ={"src":"actor/scorpion.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":50,
    	"preHitBox":[ -15,15,-15,20 ],"preBumperBox":[ -15,15,-15,20 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["mummy"] ={"src":"actor/mummy.png","size":1.5,"side":[2,0,1,3],"hpBar":-40,"legs":40,
    	"preHitBox":[ -30,30,-20,40 ],"preBumperBox":[ -30,30,-20,40 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":80,"sizeY":80,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":80,"sizeY":80,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["birdBlue"] ={"src":"actor/birdBlue.png","size":1,"side":[2,0,1,3],"hpBar":-50,"legs":50,
    	"preHitBox":[ -30,30,-20,40 ],"preBumperBox":[ -30,30,-20,40 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
		
		
	a["salamander"] ={"src":"actor/salamander.png","size":2,"side":[2,0,1,3],"hpBar":-40,"legs":40,
    	"preHitBox":[ -30,30,-20,30 ],"preBumperBox":[ -30,30,-20,30 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":64,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":64,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};	
		
	a["spirit"] = {"src":"actor/spirit.png",rgpvx:1};
	
	a["slime"] ={"src":"actor/slime.png","size":1.5,"side":[2,0,1,3],"hpBar":-30,"legs":30,
    	"preHitBox":[ -20,20,-10,20 ],"preBumperBox":[ -20,20,-10,20 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
		
	a["snake"] ={"src":"actor/snake.png","size":1,"side":[2,0,1,3],"hpBar":-30,"legs":30,
    	"preHitBox":[ -20,20,-10,20 ],"preBumperBox":[ -20,20,-10,20 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
		
	a["birdRed"] ={"src":"actor/birdRed.png","size":1,"side":[2,0,1,3],"hpBar":-50,"legs":50,
    	"preHitBox":[ -40,40,-30,40 ],"preBumperBox":[ -40,40,-30,40 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};
		
	a["taurus"] ={"src":"actor/taurus.png","size":1.5,"side":[2,0,1,3],"hpBar":-55,"legs":50,
    	"preHitBox":[ -60,60,-40,60 ],"preBumperBox":[ -60,60,-40,60 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
	
	a["werewolf"] ={"src":"actor/werewolf.png","size":2,"side":[2,0,1,3],"hpBar":-40,"legs":32,
    	"preHitBox":[ -30,30,-20,30 ],"preBumperBox":[ -30,30,-20,30 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":64,"sizeY":48,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":64,"sizeY":48,"dir":4,"spd":0.5,"next":"walk"}
    	}};		
	//}	
    //{ BULLET
    a["fireball"] ={"src":"bullet/fireball.png","size":1,"side":[0,1,2,3],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":4,"spd":0.2,"next":"travel"},
    	}};
    			
    a["iceshard"] ={"src":"bullet/iceshard.png","size":1,"side":[0,1,2,3,4,5,6,7],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":8,"spd":0,"next":"travel"},
    	}};
    a["lightningball"] ={"src":"bullet/lightningball.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"travel"},
    	}};
    	
    a["arrow"] ={"src":"bullet/arrow.png","size":1,"side":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":42,"sizeY":42,"dir":16,"spd":0,"next":"travel"},
    	}};
     a["dart"] ={"src":"bullet/dart.png","size":2,"side":[0,1,2,3,4],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":16,"sizeY":16,"dir":4,"spd":0,"next":"travel"},
    	}};	
    a["boomerang"] ={"src":"bullet/boomerang.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":8,"sizeX":52,"sizeY":52,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["bone"] ={"src":"bullet/bone.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":8,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["spore"] ={"src":"bullet/spore.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["rock"] ={"src":"bullet/rock.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["shadowball"] ={"src":"bullet/shadowball.png","size":1,"side":[0],'link':'http://mohsin-kun.deviantart.com/art/Shadow-Ball-73303663',"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};	
	a["tornado"] ={"src":"bullet/tornado.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":5,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};	

    //}	
    //{ System
	a["system-target"] ={"src":"picture/target.png","size":0.5,"preBumperBox":[ -48,48,-48,48 ]};
	
	a["pushable-rock1x1"] ={"src":"picture/pushable-rock2x2.png","size":0.5,"preBumperBox":[ -32,32,-32,32 ]};
	a["waypoint-grave"] ={"src":"picture/waypoint-grave.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["loot-chestOn"] ={"src":"picture/loot-chestOn.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["loot-chestOff"] ={"src":"picture/loot-chestOff.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["toggle-boxOff"] ={"src":"picture/toggle-boxOff.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["toggle-boxOn"] ={"src":"picture/toggle-boxOn.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["toggle-wallOff"] ={"src":"picture/toggle-wallOff.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["toggle-wallOn"] ={"src":"picture/toggle-wallOn.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["tree-red"] ={"src":"picture/tree-red.png","size":2,"preBumperBox":[ -32,32,-40,40 ]};
	a["tree-down"] ={"src":"picture/tree-down.png","size":2,"preBumperBox":[ -32,32,-40,40 ]};
	
	a["teleport-door"] ={"src":"picture/teleport-door.png","size":2,"preBumperBox":[ -16,16,-8,40 ]};
	a["teleport-zone"] ={"src":"picture/teleport-zone.png","size":1.5,"side":[0,1,2,3],"preBumperBox":[ -16,16,-16,16 ]};
	a["teleport-underground"] ={"src":"picture/teleport-underground.png","size":2.5,"preBumperBox":[ -16,16,-16,16 ]};
	a["teleport-well"] ={"src":"picture/teleport-well.png","size":2,"preBumperBox":[ -24,24,-24,24 ]};
	
	a["block-rock1x1"] ={"src":"picture/block-rock2x2.png","size":0.5,"preBumperBox":[ -32,32,-32,32 ]};
	a["block-barrier"] ={"src":"picture/block-barrier.png","size":1,"preBumperBox":[ -64,64,-32,32 ]};
	a["block-spike"] ={"src":"picture/block-spike1x1.png","size":2,"preBumperBox":[ -8,8,-16,16 ]};
	a["block-spike1x1"] ={"src":"picture/block-spike1x1.png","size":2,"preBumperBox":[ -8,8,-16,16 ]};
	
	a["block-spike1x3"] ={"src":"picture/block-spike1x3.png","size":2,"preBumperBox":[ -8,40,-16,16 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":80,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike1x5"] ={"src":"picture/block-spike1x5.png","size":2,"preBumperBox":[ -8,72,-16,16 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":144,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike1x9"] ={"src":"picture/block-spike1x9.png","size":2,"preBumperBox":[ -8,104,-16,16 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":272,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	
	a["block-spike3x1"] ={"src":"picture/block-spike3x1.png","size":2,"preBumperBox":[ -8,8,-16,48 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":16,"sizeY":96,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike5x1"] ={"src":"picture/block-spike5x1.png","size":2,"preBumperBox":[ -8,8,-16,80 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":16,"sizeY":160,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike9x1"] ={"src":"picture/block-spike9x1.png","size":2,"preBumperBox":[ -8,8,-16,112 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":16,"sizeY":256,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	
	
	
	a["invisible"] ={"src":"picture/invisible.png","size":1,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["loot-flowerOn"] = {"src":"picture/loot-flowerOn.png","size":4,"preBumperBox":[ -16,16,-16,16 ]};
	a["loot-flowerOff"] = {"src":"picture/loot-flowerOff.png","size":4,"preBumperBox":[ -16,16,-16,16 ]};
	
	//}
    
    
    for(var i in Db.sprite){
		Db.sprite[i].id = i;
    	Sprite.creation.model(Db.sprite[i]);    
    }
        
}


Init.db.sprite.template = function(){
	return {
		src:"actor/main.png",
		img:null,
		size:1,
		side:[0,1,2,3],
		hpBar:0,
		legs:0,
		preHitBox:[-10,10,-10,10],
		preBumperBox:[-10,10,-10,10],
		bumperBox:[-10,10,-10,10],
		hitBox:[-10,10,-10,10],
		anim:{walk:Init.db.sprite.template.anim()},
		defaultAnim:"walk",
		alpha:1,

	}
}

Init.db.sprite.template.anim = function(){
	return {"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,"walk":0,"next":"walk"};
}
Init.db.sprite.template.rpgvx = function(){
	return {"size":2,"side":[2,0,1,3],"hpBar":-22,"legs":16,
		"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],
		"anim": {
			"walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
			"attack":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"next":"attack"},
		}};
}


Sprite = {};

Sprite.creation = function(act,info){	
	if(!info.anim) info.anim = Db.sprite[info.name || 'mace'].defaultAnim;
	info.oldAnim = info.anim;
	info.initAnim = info.anim;
	
	act.sprite = Tk.useTemplate(Sprite.template(),info);
	Sprite.updateBumper(act);
}

Sprite.creation.model = function(sp){
	if(sp.rgpvx)	sp = Tk.useTemplate(Init.db.sprite.template.rpgvx(),sp);	//cuz im lazy...'
	
	if(!sp.side) sp.side = [0];
	if(!sp.preHitBox && sp.preBumperBox) sp.preHitBox = Tk.deepClone(sp.preBumperBox);
	if(!sp.anim) sp.anim = {"walk":{"startY":0,"frame":1,"sizeX":sp.preHitBox[1]*2,"sizeY":sp.preHitBox[3]*2,"dir":sp.side.length,"spd":0,"walk":0,"next":"walk"}};
	
	sp = Tk.useTemplate(Init.db.sprite.template(),sp);
	
	for(var j in sp.anim)	sp.anim[j] = Tk.useTemplate(Init.db.sprite.template.anim(),sp.anim[j]);

	//Prepare the bumperbox and hitbox of sprites       //hitbox: used for dmg collisions       //bumperbox: used for map collisions
	sp.bumperBox = [];
	sp.bumperBox[0] = { "x":sp.preBumperBox[1]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
	sp.bumperBox[1] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[3]*sp.size };
	sp.bumperBox[2] = { "x":sp.preBumperBox[0]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
	sp.bumperBox[3] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[2]*sp.size };

	sp.hitBox = []; 
	sp.hitBox[0] = { "x":sp.preHitBox[1]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
	sp.hitBox[1] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[3]*sp.size };
	sp.hitBox[2] = { "x":sp.preHitBox[0]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
	sp.hitBox[3] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[2]*sp.size };
    
    if(!SERVER){
		sp.src = 'img/sprite/' + sp.src
		sp.img = newImage(sp.src);
		Img.preloader.push(sp.src);
    }
	Db.sprite[sp.id] = sp;
}


Sprite.template = function(){
	return {
    	name:'mace',
		initAnim:"walk",	//info about anim sent to client when init. use when anim is constant (ex: switch off)
    	anim:"walk",		//normally null. change for 1 frame when attack etc... changing initAnim will also change anim
    	oldAnim:"walk",		//client stuff
		sizeMod : 1,
    	startX : 0,
    	timer : 0,
		alpha: 1,
		dead: 0,			//used to change alpha
		regular:1,			//appearance depends on equip
	}
}


Sprite.change = function(act,info){
    if(!act || !act.sprite) return ERROR(5,'no sprite');

	if(info.initAnim || info.anim){ 
		act.sprite.initAnim = info.initAnim || act.sprite.initAnim;
		act.sprite.anim = info.initAnim || info.anim;
		act.sprite.startX = 0;
		act.sprite.timer = 0;
	}
	
	if(info.name){
		if(info.name === 'regular')  act.sprite.regular = 1;
		else {
			act.sprite.name = info.name;
			act.sprite.regular = 0;
		}
	}
	act.sprite.sizeMod = info.sizeMod || act.sprite.sizeMod;
	
	if(act.type === 'player' && act.sprite.regular && SERVER){
		act.sprite.name = Sprite.getRegular(act);
	}
	
	if(info.sizeMod || info.name) Sprite.updateBumper(act);
	
}


Sprite.getRegular = function(act){	//check equip
	return 'mace';
}

Sprite.updateBumper = function(act){		//server only
	//Set the Sprite Bumper Box to fit the sizeMod
	var dsp = Db.sprite[act.sprite.name];
	if(!dsp.hitBox) return;	//Attack Dont
	
	act.hitBox = Tk.deepClone(dsp.hitBox);
	act.bumperBox = Tk.deepClone(dsp.bumperBox);	
	
	for(var i = 0 ; i < act.hitBox.length ; i++){
		act.hitBox[i].x *= act.sprite.sizeMod;
		act.hitBox[i].y *= act.sprite.sizeMod;
		act.bumperBox[i].x *= act.sprite.sizeMod;
		act.bumperBox[i].y *= act.sprite.sizeMod;	
	}
}



Sprite.update = function (act){	//client side only
	if(!act.sprite) return;
	var dsp = Db.sprite[act.sprite.name];
	if(!dsp){ ERROR(2,"sprite dont exist",act.sprite.name); dsp = Db.sprite['mace'];}
	if(act.sprite.animOld !== act.sprite.anim){	//otherwise, animation can be cut if timer for walk is high 
		act.sprite.animOld = act.sprite.anim;
		Sprite.change(act,{'anim':act.sprite.anim});
	}
	var animFromDb = dsp.anim[act.sprite.anim];	
	
	var mod = 1;
	if(animFromDb.walk){    //if walking, the speed of animation depends on movement speed
		var spd =  Math.max(Math.abs(act.spdX),Math.abs(act.spdY));
		mod = Math.abs(spd/act.maxSpd) || 0;
	}
	
	act.sprite.timer += animFromDb.spd * mod;	
	act.sprite.startX = Math.floor(act.sprite.timer);
	
	if(act.sprite.startX > animFromDb.frame-1){
		Sprite.change(act,{'anim':animFromDb.next});
	}
	if(act.sprite.dead){
		act.sprite.alpha -= act.sprite.dead;
		if(act.sprite.alpha < 0)	Activelist.removeAny(act.id);
	}
	
}




/*
    	"mace":{"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		*/
		/*
		"mace":{"src":"actor/mace.png","size":1.5*0.9,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -18,18,4,35 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":256,"frame":6,"sizeX":128,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		
		"mace2":{"src":"actor/human.png","size":1.5,"side":[2,6,0,4,1,5,3,7],"hpBar":-40,"legs":35,
    	"preHitBox":[ -12,12,-35,35 ],"preBumperBox":[ -12,12,0,35 ],
    	"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"walk"}
    	}},
		
    	"spear":{"src":"actor/spear.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*21,"frame":8,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"sword":{"src":"actor/sword.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*21,"frame":6,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"bow":{"src":"actor/bow.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*16,"frame":13,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"wand":{"src":"actor/wand.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*12,"frame":6,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		*/




