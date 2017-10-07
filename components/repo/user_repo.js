var method = UserRepo.prototype;

function UserRepo(store){
	this._name = 'us';
	this._store = store;
	this._log = this._store.get('log');
	if(!this._log){
		var user = {'User':[]};
		this._store.set('log', user);
	} else{
		this._log = JSON.stringify(this._log).slice(0,-1);
		this._log += ',"User":[]}';
		this._log = JSON.parse(this._log);
	}
	this._log = this._store.get('log');
	this._repo = [];
	var schema = {
		"type": "object",
	    "properties": {
	        "id": {
	            "type": "number"
	        },
	        "name": {
	            "type": "string"
	        },
	        "gender": {
	            "type": "string",
	            "enum": ["male","female"]
	        },
	        "city": {
	            "type": "string"
	        },
	        "phone": {
	            "type": "string"
	        }
	        ,
	        "email": {
	            "type": "string"
	        }
	    }
	}
	var Ajv = require('ajv'),
		ajv = new Ajv();
	this._validate = ajv.compile(schema);
};

method.get = function(id){
	for (i=0; i<this._repo.length; i++){
		if(this._repo[i].id == id){
			return {
				User: this._repo[i]
			}
		}
	}
	return {
		message: "User not found",
		error: true
	}
};

method.list = function(page,limit){
	//1 page will be 10 records
	var conv = [];
	for(i=0;i<10;i++){
		if(i+((page-1)*10) > limit-1 || i > this._repo.length-1){
			break;
		}
		conv.push(this._repo[i+((page-1)*10)])
	}
	return {
		User:conv
	}
};

method.create = function(data){
	var valid = this._validate(data);
	if(!valid){
		return {
			message:"invalid format",
			error: true
		}
	}
	this._repo.push(data);
	this._log['User'] = this._repo;
	this._store.set('log',this._log);
	return {
		User:this._repo[this._repo.length-1]
	}
};

method.update = function(id, partialData){
	for(i=0;i<this._repo.length;i++){
		if(this._repo[i].id == id){
			var valid = this._validate(partialData);
			if(!valid){
				return {
					message:"invalid format",
					error: true
				}
			}
			if(partialData.name){
				this._repo[i].name = partialData.name;
			}
			if(partialData.gender){
				this._repo[i].gender = partialData.gender;
			}
			if(partialData.city){
				this._repo[i].city = partialData.city;
			}
			if(partialData.phone){
				this._repo[i].phone = partialData.phone;
			}
			if(partialData.email){
				this._repo[i].email = partialData.email;
			}
			this._store.set('log', this._repo);
			return {
				User:this._repo[i]
			}
		}
	}
	return {
		message:"User not found",
		error: true
	}
};

method.remove = function(id){
	for(i=0;i<this._repo.length;i++){
		if(this._repo[i].id == id){
			removed = this._repo[i];
			this._repo.splice(i,1);
			this._store.set('log',this._repo);
			return {
				User: removed
			}
		}
	}
	return {
		message: "User not found",
		error: true
	}
};

module.exports = UserRepo;