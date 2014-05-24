var db = requireDb();
Init.db.plan = function(cb){
	Db.plan = {};
	var a = Db.plan;

	db.find('plan',{},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results)	a[results[i].id] = results[i];
	
	
		a['randomArmor'] = {
			category:'armor',
			req:{item:[],skill:{}},
		};
		
		
		a['randomWeapon'] = {
			category:'equip',
			piece:'melee',	
			type:'sword',		
			req:{item:[],skill:{}},
		};
		
		a['randomWeapon2'] = {
			category:'equip',
			piece:'magic',	
			type:'wand',		
			req:{item:[],skill:{}},
		};
		
		for(var i in Db.plan){
			Db.plan[i].id = i;
			Db.plan[i].definitive = 1;
			Plan.creation(Db.plan[i]);
		}
		cb();
	})
}
	
Plan = {};

Plan.creation = function(preplan){
	//seed: lvl, category,[ piece, type, rarity, quality,]
	//extra: definitive, minBoost, maxBoost
	
	var plan = Tk.useTemplate(Plan.template(),preplan);
	if(plan.category === 'equip' || plan.category === 'weapon' || plan.category === 'armor') 
		plan = Plan.template.equip(plan);
	if(plan.category === 'ability') 
		plan = Plan.template.ability(plan);	
	
	Db.plan[plan.id] = plan;
	
	Item.creation({
		'id':plan.id,
		'name':plan.name,
		'icon':plan.icon,
		'option':[	
			{'name':'Examine','func':'Main.examine','param':['plan',plan.id]},
			{'name':'Use','func':'Plan.use','param':[plan.id]},
		]
	});
		
	db.upsert('plan',{'id':plan.id}, plan, db.err);
	
	if(plan.definitive) return plan.id;
	
	//Lvl Rarity quality
	plan.lvl = Math.floor(plan.lvl * (1 + 0.1*Math.randomML()));	//aka lvl += 10
	plan.rarity = plan.rarity * Math.random() * 0.5 + Math.randomML();	//if not definitive, then rarity&quality is a mod.
	plan.quality = plan.quality * Math.random() * 0.5 + Math.randomML();	
	
	plan.lvl = plan.lvl.mm(0);
	plan.rarity = plan.rarity.mm(0);	
	plan.quality = plan.quality.mm(0);	
	
	
	var num = Math.random();
	if(num < 0.1){plan.color = 'blue';plan.minAmount = 1;}
	if(num < 0.01){plan.color = 'yellow';plan.minAmount = 3;}
	
	
	//Requirements
	plan = Plan.creation.req(plan);
	
	
	
	
	
	return plan.id;
}

Plan.creation.req = function(plan){
	var lvl = plan.lvl;
	
	var array = {
		'melee':['chain','metal'],
		'range':['leaf','wood'],
		'magic':['hide','bone'],
	};
	
	var skill = {
		'chain':'metalwork',
		'metal':'metalwork',
		'leaf':'woodwork',
		'wood':'woodwork',
		'hide':'leatherwork',
		'bone':'leatherwork',
		'ruby':'metalwork',
		'sapphire':'woodwork',
		'topaz':'leatherwork',
	};
	
	//Item
	var lvlcap = Math.floor(plan.lvl/20);
	var main = array[plan.piece] ? array[plan.piece].random() : plan.type;
	//OPENBETA
	/*	
	for(var i = 0 ; i <= lvlcap; i++){	
		var amount = lvl < 20 ? lvl*5 : 100
		plan.req.item.push([main + '-' + i*20,100]);
	}
	
	if(lvl > 20){
		var rare = Math.floor(Math.random()*10)
		rare = 'rare-' + rare;
		plan.req.item.push([rare,1]);
	}
	
	if(lvl > 10){
		plan.req.item.push(['shard-' + plan.color,5]);	
	}	
	*/	
	plan.req.item.push(['leaf-0',10]);
	plan.req.item.push(['wood-0',10]);
	
	//Skill
	var sk = skill[main];
	plan.req.skill[sk] = plan.lvl;
	
	return plan;
}





Plan.template = function(){
	var id = 'plan-' + Math.randomId();
	return {
		name:'bugged-plan',
		icon:'plan.equip',
		category:'equip',	
		id:id,
		quality:0, 
		lvl:0,
		rarity:0, 
		req:{'skill':{},'item':[[id,1]]},
		name:'Bugged Plan',
		minAmount:0,
		maxAmount:10,
		color:'white',
	}
}

Plan.template.equip = function(plan){
	if(plan.category === 'weapon' || plan.category === 'armor'){
		plan.piece = plan.piece || Cst.equip[plan.category].piece.random();
		plan.category = 'equip';
	} else plan.piece = plan.piece || Cst.equip.piece.random();	//aka category already equip
	
	plan.name = 'Equip Plan';
	plan.icon = 'plan.equip';
	plan.type = plan.type || Cst.equip[plan.piece].type.random(); 
	
	return plan;
}

Plan.template.ability = function(plan){
	ERROR(3,"NO SUPPORT for Plan.template.ability");
	return plan;
}

Plan.use = function(key,id){	//when player tries to use plan
	var plan = typeof id === 'string' ? Db.plan[id] : id;
	if(!plan) return;
	
	var inv = List.main[key].invList;
	
	if(!Plan.test(key,plan.req)) return Chat.add(key,"You don't meet the requirements to use this plan.");
	//
	Itemlist.remove(inv,plan.req.item);
	
	plan.creator = List.all[key].username;
	var itemid;
	if(plan.unique){ itemid = plan.unique }	//always give same items		
	if(plan.category === 'equip') itemid = Craft.equip(plan); 
	if(plan.category === 'ability') itemid = Craft.ability(plan); 
	
	Itemlist.add(inv, itemid);
	Server.log(3,key,'Plan.use',id,itemid);
	return itemid;
}


Plan.use.ability = function(key,seed){		//quickfix...
	var id = Craft.ability(seed);
	Actor.ability.add(List.all[key],id);
	Itemlist.remove(List.main[key].invList,seed.item);
	Server.log(3,key,'Plan.use.ability',id);
}

Plan.test = function(key,req){	//test requirement
	var inv = List.main[key].invList;
	var lvl = List.all[key].skill.lvl;
	
	for(var i in req.skill) if(lvl[i] < req.skill[i]) return false;	
	for(var i in req.item) if(!Itemlist.have(inv,req.item[i][0],req.item[i][1])) return false;
	
	return true
}

Plan.upgrade = function(){
	//need to add stuff
	//x2 more req but +0.5 rarity
}








































