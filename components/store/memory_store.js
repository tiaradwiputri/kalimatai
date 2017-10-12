var method = Memstore.prototype;

function Memstore(){
	var Memstore = require('memstore').Store
	this._store = new Memstore();
	this._store.set('log','');
}

method.set = function(log,record){
	this._store.set(log,record);
}

method.get = function(log){
	return this._store.get(log);
}

method.setName = function(name){
	var log = this._store.get('log');
	if(!log){
		eval('var log = {'+name+':[]}');
		this._store.set('log', log);
	} else{
		log = JSON.stringify(log).slice(0,-1);
		log += ',"'+name+'":[]}';
		log = JSON.parse(log);
	}
	this._store.set('log',log);
}

method.findById = function(id,name){
	var log = this._store.get('log');
	var repo = log[name];
	for(i=0;i<repo.length;i++){
		if(repo[i]['id'] == id){
			var log = {};
			log[name] = repo[i];
			return log;
		}
	}
	return {
		message: "record not found",
		error: "true"
	}
}

method.find = function(page,limit,name){
	var log = this._store.get('log');
	var repo = log[name];
	console.log('inside find method');
	console.log(repo.length)
	var rec = [];
	for(i=0;i<10;i++){
		if(i+((page-1)*10) > limit-1 || i>(repo.length-(10*(page-1))-1)){
			break;
		}
		rec.push(repo[i+((page-1)*10)])
		console.log(i);
	}
	log = {};
	log[name] = rec;
	return log;
}

method.create = function(data,name){
	var log = this._store.get('log');
	var repo = log[name];
	data['id'] = repo.length+1;
	repo.push(data);
	log[name] = repo;
	this._store.set('log',log);
	log = {};
	log[name] = repo[repo.length-1];
	return log;
}

method.update = function(id, partialData,name){
	var log = this._store.get('log');
	var repo = log[name];
	for(i=0;i<repo.length;i++){
		if(repo[i].id == id){
			for(key in partialData){
				repo[i][key] = partialData[key];
			}
			log = {};
			log[name] = repo[i];
			return log;
		}
	}
	return {
		message: "record not found",
		error: true
	}
}

method.delete = function(id,name){
	var log = this._store.get('log');
	var repo = log[name];
	for(i=0;i<repo.length;i++){
		if(repo[i].id == id){
			removed = repo[i];
			repo.splice(i,1);
			log[name] = repo;
			this._store.set('log',log);
			log = {};
			log[name] = removed;
			return log;
		}
	}
	return {
		message: "record not found",
		error: true
	}
}

module.exports = Memstore;