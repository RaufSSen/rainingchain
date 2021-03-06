var db = requireDb();
//Item

/*
a['testing']  = {   //testing is the item id
		'name':'Gold',			//name of item
        'icon':'system.gold',	//icon used
        'stack':1,				//only use 1 inventory slot
		'trade':1, 				//can be traded				
		'drop':1,				//can be dropped
		'remove':0,				//remove item when used
		'bank':1,				//can be put in a bank
		'type':'item',			//item be default, can be equip, plan, ability
		
		
		'option':[				//option when right clicking
			{
			'name':'Teleport',  		//visible text for client
		    'func':'Actor.teleport',    //function to call when clicked
		    'param':[1230,1230,'ryve']	//parameters used with function (put in array)
			},    
		            
			{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
			
		]};
*/

//Similar format than Equip
Db.item = {};
Init.db.item = function (){
	var a = Db.item;

	//{Crafting					
	a['shard-white'] = {'name':'White Shard','icon':'shard.white','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.' }
	a['shard-blue'] = {'name':'Blue Shard','icon':'shard.blue','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.'}
	a['shard-yellow'] = {'name':'Yellow Shard','icon':'shard.yellow','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.'}
	a['shard-gold'] = {'name':'Gold Shard','icon':'shard.gold','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.'}
	


	//
	a['bugged-drop'] = {'name':'I AM ERR0R','icon':'system.square'};
	
	a['lobster'] = {'name':'Lobster','icon':'system.square'};
	a['wood'] = {'name':'wood','icon':'system.square'};	
	a['logs'] = {'name':'logs','icon':'system.square'};	
	//}
	
	//{Testing
	a['test'] = {'name':'Test','icon':'system.square','stack':1,
			'option':[	
			    
			]};		
	

	
	//}
	
	
	//{Orb
	a['boost_orb'] = {'name':'Orb of Power','icon':'orb.boost','stack':1,'examine':'A orb that adds a boost to an equipment.',
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',1000]}]},
			]};	
	a['upgrade_orb'] = {'name':'Orb of Upgrade','icon':'orb.upgrade','stack':1,'examine':'A orb that improves the stats of an equipment.',
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',1000]}]},
			]};	
	a['removal_orb'] = {'name':'Orb of Removal','icon':'orb.removal','stack':1,'examine':'A orb that removes a boost to an equipment.',
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',1000]}]},
			]};	
	//}
	
	for(var i in a){	
		a[i].id = i;
		Item.creation(a[i]);
	}	
}



Item = {};

Item.creation = function(item){	
	item = Tk.useTemplate(Item.template(),item);
	if(item.examine)	item.option.push({'name':'Examine','func':'Chat.add','param':[item.examine]})
	if(item.drop)	item.option.push({'name':'Drop','func':'Main.dropInv','param':[item.id]})
	if(item.destroy)	item.option.push({'name':'Destroy','func':'Main.destroyInv','param':[item.id]})
	Db.item[item.id] = item;
}

Item.template = function(){
	return {
		'name':'buggedItem',
		'icon':'system.square',
		'trade':1, 
		'sell':0,  
		'drop':1,
		'destroy':0,
		'remove':0,
		'bank':1,
		'stack':0,
		'value':1,
		'examine':'',
		'option': [],
		'type':'item',
	}
}

Item.removeFromDb = function(id){
	db.remove('equip',{id:id});
	db.remove('ability',{id:id});
}


