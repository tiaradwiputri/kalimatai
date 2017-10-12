method = Injector.prototype

function Injector(config){
	for (key in config['components']){		
		var component = config['components'][key];
		eval('this._'+key+'= this._resolve(component);')
		this._main = config['main'];
		if(key!='store' && key!='server'){
			eval('this._'+key+'.setName("'+key+'");');
		}
	}
}

method._resolve = function(component){
	//this one might be able to be assigned directly 
	args = [];
	i=0;
	while(i<component['dependencies'].length){
		args.push('this._'+component['dependencies'][i]);
		i++;
	}
	if(component['options']){
		options = component['options'];
		var comp = require('./'+component['file']);
		eval('var object = new comp('+args.toString()+',options);');
	} else {
		var comp = require('./'+component['file']);
		eval('var object = new comp('+args.toString()+');');
	}
	
	return object
}

method.start = function(){
	args = [];
	i=0;
	while(i<this._main['args'].length){
		args.push(eval(this._main['args'][i]));
		i++
	}
	eval('this._'+this._main['component']+'.'+this._main['method']+'('+args.toString()+');');
}

module.exports = Injector;