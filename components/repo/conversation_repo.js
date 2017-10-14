var method = ConversationRepo.prototype;

function ConversationRepo(store){
	this._name = 'conversations';
	this._store = store;
	this._log = this._store.get('log');
	if(!this._log){
		var conv = {'Conversation':[]};
		this._store.set('log', conv);
	} else{
		this._log = JSON.stringify(this._log).slice(0,-1);
		this._log += ',"Conversation":[]}';
		this._log = JSON.parse(this._log);
		this._store.set('log', this._log);
	}
	this._log = this._store.get('log');
	this._repo = [];
	var schema = {
		"type": "object",
	    "properties": {
	        "id": {
	            "type": "number"
	        },
	        "userId": {
	            "type": "string"
	        },
	        "direction": {
	            "type": "string",
	            "enum": ["incoming","outgoing"]
	        },
	        "message": {
	            "type": "string"
	        },
	        "timestamp": {
	            "type": "number"
	        }
	    }
	}
	var Ajv = require('ajv'),
		ajv = new Ajv();
	this._validate = ajv.compile(schema);
};

method.get = function(id){;
	for (i=0; i<this._repo.length; i++){
		if(this._repo[i].id == id){
			return {
				Conversation: this._repo[i]
			}
		}
	}
	return {
		message: "conversation not found",
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
		Conversation:conv
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
	this._log['Conversation'] = this._repo;
	//HERE SET THE LOG TO ADD THE REPO DATA ONLY TO USER ARRAY
	this._store.set('log',this._log);
	return {
		Conversation:this._repo[this._repo.length-1]
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
			if(partialData.userId){
				this._repo[i].userId = partialData.userId;
			}
			if(partialData.direction){
				this._repo[i].direction = partialData.direction;
			}
			if(partialData.message){
				this._repo[i].message = partialData.message;
			}
			if(partialData.timestamp){
				this._repo[i].timestamp = partialData.timestamp;
			}
			this._log['Conversation'] = this._repo
			this._store.set('log', this._log);
			return {
				Conversation:this._repo[i]
			}
		}
	}
	return {
		message:"conversation not found",
		error: true
	}
};

method.remove = function(id){
	for(i=0;i<this._repo.length;i++){
		if(this._repo[i].id == id){
			removed = this._repo[i];
			this._repo.splice(i,1);
			this._log['Conversation'] = this._repo;
			this._store.set('log',this._log);
			return {
				Conversation: removed
			}
		}
	}
	return {
		message: "conversation not found",
		error: true
	}
};

module.exports = ConversationRepo;