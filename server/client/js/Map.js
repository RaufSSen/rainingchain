//Map
Init.db.map = function(){
    Db.map = {};
	
	//[amount of sub-map in X, amount of sub-maps in Y]	(Check last image)
    Init.db.map.list = {
		'tutorial':[1,5],
		'pvpF4A':[1,2],
		'goblinLand':[4,8],
		'goblinUnderground':[1,2],
		'btt001':[1,2],
		'simpleMap':[1,2],
		'tinyTown':[1,2],
	}
	
}
//DONT TOUCH BELOW
//map are loaded when needed. check Loop.actor
Map = {}; 
Map.creation = function(name){
	var m = {};
	m.name = name;
	m.img = {'a':[],'b':[],m:null};	//a: above, b:below
	
	var info = Init.db.map.list[name];
	//layer
	for(var layer in {a:1,b:1}){
		for(var i = 0 ; i <= info[0]; i++){
			m.img[layer][i] = [];
			for(var j = 0 ; j <= info[1]; j++){
				var str = "img/map/" + name + "/" + name + layer.capitalize() + '_(' + i + ',' + j + ')' + '.png';
				var im = newImage(str);
				Img.preloader.push(str);
				m.img[layer][i].push(im);
			}
		}
	}
	//minimap
	var str = "img/map/" + name + "/" + name + 'M.png';
	var im = newImage(str);
	Img.preloader.push(str);
	m.img.m = im;		// 8 times smaller than regular map generated by tiled
	
	Db.map[name] = m;
}

//var image = newImage("img/map/goblinLand/goblinLandB.png");
















