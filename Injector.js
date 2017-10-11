method = Injector.prototype

function Injector(config){
	var component = config['components']['store'];
	this._store = this._resolve(component);
	component = config['components']['convRepo'];
	this._convRepo = this._resolve(component);
	component = config['components']['userRepo'];
	this._userRepo = this._resolve(component);
	component = config['components']['server'];
	this._server = this._resolve(component);
	this._main = config['main'];
}

method._resolve = function(component){
	args = [];
	i=0;
	while(i<component['dependencies'].length){
		args.push('this._'+component['dependencies'][i]);
		i++;
	}
	//resolve would be creating the component object from the string config file
	var comp = require('./'+component['file']);
	eval('var object = new comp('+args.toString()+');');
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