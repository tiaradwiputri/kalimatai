"use strict";

/*
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 

app.use(bodyParser.json()); 

app.get('/',function(req,res){
	res.send("to access APIs please go to /users or /conversations")
});

app.listen(3000, function(){
	console.log('Listening on port 3000...')
})

*/

var Memstore = require('memstore').Store

var ConversationRepo = require('./components/repo/conversation_repo.js');

var UserRepo = require('./components/repo/user_repo.js');

var ApiServer = require('./components/server/api_server.js');


//initialize
let store = new Memstore();
let userRepo = new UserRepo(store);
let convRepo = new ConversationRepo(store);
let server = new ApiServer(convRepo, userRepo);
server.start(5000);