var method = GenericRepo.prototype;

function GenericRepo(store,options){
	this._store = store;
	this._schema = options['schema'];
}

method.get = function(id){
	return this._store.findById(id,this.getName());
}

method.list = function(page,limit){
	return this._store.find(page,limit,this.getName());
}

method.create = function(data){
	var valid = this._validation(data);
	if(!valid){
		return {
			message:"invalid format",
			error: true
		}
	}
	return this._store.create(data,this.getName());

}

method.update = function(id,partialData){
	var valid = this._validation(partialData);
	if(!valid){
		return {
			message:"invalid format",
			error: true
		}
	}
	return this._store.update(id, partialData,this.getName());
}

method.remove = function(id){
	return this._store.delete(id,this.getName());
}

method._validation = function(data){
	for(key in data){
		if(this._schema[key]=='string'&& typeof data[key] != 'string'){
			return false
		} else if(this._schema[key]=='int'&& typeof data[key] != 'number')
			return false
	}
	return true
}

method.setName = function(name){
	this._name = name;
	this._store.setName(name);
}

method.getName = function(){
	return this._name;
}

module.exports = GenericRepo;