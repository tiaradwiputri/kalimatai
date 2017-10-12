var method = ApiServer.prototype;

function ApiServer(convRepo, userRepo, options){
	this._repo=[];
	this._repo.push(convRepo);
	this._repo.push(userRepo);
	this._options = options;
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

	var bodyParser = require('body-parser');
	var routes = this._createRoutes(this._options['routes'],this._repo);
	var _repo = this._repo;
	var app = this._app;
	var i =0;
	this._repo.forEach(function(repo,i){
		app.get(routes[i][0],function(req,res){
			res.send(repo.get(req.params.id));
		});
		app.get(routes[i][1],function(req,res){
			res.send(repo.list(req.get('page'),req.get('limit')));
		});
		app.post(routes[i][2],function(req,res){
			res.send(repo.create(req.body));
		});
		app.put(routes[i][3],function(req,res){
			res.send(repo.update(req.params.id,req.body));
		});
		app.delete(routes[i][4],function(req,res){
			res.send(repo.remove(req.params.id));
		});
		i++;
	})

	this._app.get('/',function(req,res){
		res.send('Heya');
	});
}

method._createRoutes = function(routes,repo){
	arr = [[],[]];
	for(i=0;i<repo.length;i++){
		//GET 1
		arr[i].push(routes[i]+'/:id');
		//GET
		arr[i].push(routes[i]);
		//POST
		arr[i].push(routes[i]);
		//PUT
		arr[i].push(routes[i]+'/:id')
		//DELETE
		arr[i].push(routes[i]+'/:id')
	}
	return arr;
}

module.exports = ApiServer;