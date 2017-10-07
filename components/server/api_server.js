var method = ApiServer.prototype;

function ApiServer(convRepo, userRepo){
	this._convRepo = convRepo;
	this._userRepo = userRepo;
	var express = require('express');
	this._app = express();
	this._router = express.Router();
	var bodyParser = require('body-parser');
	this._app.use(bodyParser.json());

}

method.start = function(port){
	this._app.listen(port, function(){
		console.log('listening inside ApiServer on port ' +port);
	});

	var _userRepo = this._userRepo;
	var _convRepo = this._convRepo;
	var bodyParser = require('body-parser'); 

	//routes
	this._app.get('/users/:id',function(req,res){
		res.send(_userRepo.get(req.params.id));
	});

	this._app.post('/users',function(req,res){
		res.send(_userRepo.create(req.body))
	});

	this._app.get('/users',function(req,res){
		res.send(_userRepo.list(1,100));
	});

	this._app.put('/users/:id',function(req,res){
		res.send(_userRepo.update(req.params.id,req.body));
	});

	this._app.delete('/users/:id',function(req,res){
		res.send(_userRepo.remove(req.params.id));
	});

	this._app.get('/conversations/:id',function(req,res){
		res.send(_convRepo.get(req.params.id));
	});

	this._app.post('/conversations',function(req,res){
		res.send(_convRepo.create(req.body))
	});

	this._app.get('/conversations',function(req,res){
		res.send(_convRepo.list(1,100));
	});

	this._app.put('/conversations/:id',function(req,res){
		res.send(_convRepo.update(req.params.id,req.body));
	});

	this._app.delete('/conversations/:id',function(req,res){
		res.send(_convRepo.remove(req.params.id));
	});
}

module.exports = ApiServer;