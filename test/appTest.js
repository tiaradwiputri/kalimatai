"use strict";

const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:5000');

const convRepo = require('../components/repo/conversation_repo.js')
const userRepo = require('../components/repo/user_repo.js')

//const GenericRepo = require('../components/repo/generic_repo.js');

const Memstore = require('memstore').Store;

const ApiServer = require('../components/server/api_server.js');


describe('Unit Testing', function(){
	describe('convRepo', function(){
		var store = new Memstore();
		it('Constructor set a memory space for repository in memory', function(done){
			let conv = new convRepo(store);
			expect(store.get('log')).to.have.property('Conversation');
			expect(store.get('log').Conversation).to.be.an.instanceof(Array);
			expect(store.get('log')).to.not.have.property('User');
			let user = new userRepo(store);
			expect(store.get('log')).to.have.property('Conversation');
			expect(store.get('log').Conversation).to.be.an.instanceof(Array);
			done();
		});
		it('create method will return Conversation object for successfully created record', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};
			
			data = conv.create(data);
			expect(data).to.have.property('Conversation');
			expect(data.Conversation).to.have.property('id');
			expect(data.Conversation.id).to.equal(1);
			expect(data.Conversation).to.have.property('userId');
			expect(data.Conversation.userId).to.equal("1");
			expect(data.Conversation).to.have.property('direction');
			expect(data.Conversation.direction).to.equal("outgoing");
			expect(data.Conversation).to.have.property('message');
			expect(data.Conversation.message).to.equal("Apa kabar?");
			expect(data.Conversation).to.have.property('timestamp');
			expect(data.Conversation.timestamp).to.equal(123456789);
			done();
		});
		it('create method will return error message for invalid data format', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": "10:10:10"
			};
			
			data = conv.create(data);
			expect(data).to.have.property("message");
			expect(data.message).to.equal("invalid format");
			expect(data).to.have.property("error");
			expect(data.error).to.equal(true);
			done();
		});
		it('get method will return Conversation object of the given id', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};
			
			conv.create(data)
			data = conv.get(1);
			expect(data).to.have.property('Conversation');
			expect(data.Conversation).to.have.property('id');
			expect(data.Conversation.id).to.equal(1);
			expect(data.Conversation).to.have.property('userId');
			expect(data.Conversation.userId).to.equal("1");
			expect(data.Conversation).to.have.property('direction');
			expect(data.Conversation.direction).to.equal("outgoing");
			expect(data.Conversation).to.have.property('message');
			expect(data.Conversation.message).to.equal("Apa kabar?");
			expect(data.Conversation).to.have.property('timestamp');
			expect(data.Conversation.timestamp).to.equal(123456789);
			done();
		});
		it('get method will return error message if conversation is nonexistent', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};
			
			conv.create(data)
			data = conv.get(2);
			expect(data).to.have.property('message');
			expect(data.message).to.equal("conversation not found");
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
		it('list method will return an array of Conversation object given page and limit', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};
			
			conv.create(data);
			conv.create(data);
			data = conv.list(1,100);

			expect(data).to.have.property('Conversation');
			expect(data.Conversation).be.an.instanceof(Array);
			expect(data.Conversation[0]).to.have.property('id');
			expect(data.Conversation[0].id).to.equal(1);
			expect(data.Conversation[0]).to.have.property('userId');
			expect(data.Conversation[0].userId).to.equal("1");
			expect(data.Conversation[0]).to.have.property('direction');
			expect(data.Conversation[0].direction).to.equal("outgoing");
			expect(data.Conversation[0]).to.have.property('message');
			expect(data.Conversation[0].message).to.equal("Apa kabar?");
			expect(data.Conversation[0]).to.have.property('timestamp');
			expect(data.Conversation[0].timestamp).to.equal(123456789);
			expect(data.Conversation[0]).to.be.equal(data.Conversation[1]);
			expect(data.Conversation[2]).to.be.undefined;
			done();
		});
		it('update method will return Conversation object for successfully updated record', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};

			let partialData = {
				"userId": "3",
				"direction": "incoming",
				"message": "Kabar baik"
			}
			
			conv.create(data);
			data = conv.update(1,partialData);

			expect(data).to.have.property('Conversation');
			expect(data.Conversation).to.have.property('id');
			expect(data.Conversation.id).to.equal(1);
			expect(data.Conversation).to.have.property('userId');
			expect(data.Conversation.userId).to.equal("3");
			expect(data.Conversation).to.have.property('direction');
			expect(data.Conversation.direction).to.equal("incoming");
			expect(data.Conversation).to.have.property('message');
			expect(data.Conversation.message).to.equal("Kabar baik");
			expect(data.Conversation).to.have.property('timestamp');
			expect(data.Conversation.timestamp).to.equal(123456789);
			done();
		});
		it('update method will return error message for invalid data format', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};

			let partialData = {
				"userId": "3",
				"direction": "masuk",
				"message": "Kabar baik"
			}
			
			conv.create(data);
			data = conv.update(1,partialData);

			expect(data).to.have.property('message');
			expect(data.message).to.equal('invalid format');
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
		it('update method will return error message if conversation is nonexistent', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};

			let partialData = {
				"userId": "3",
				"direction": "incoming",
				"message": "Kabar baik"
			};
			
			conv.create(data);
			data = conv.update(2,partialData);

			expect(data).to.have.property('message');
			expect(data.message).to.equal('conversation not found');
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
		it('remove method will return Conversation object for successfully removed record', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};
			
			conv.create(data);
			data = conv.remove(1);

			expect(data).to.have.property('Conversation');
			expect(data.Conversation).to.have.property('id');
			expect(data.Conversation.id).to.equal(1);
			expect(data.Conversation).to.have.property('userId');
			expect(data.Conversation.userId).to.equal("1");
			expect(data.Conversation).to.have.property('direction');
			expect(data.Conversation.direction).to.equal("outgoing");
			expect(data.Conversation).to.have.property('message');
			expect(data.Conversation.message).to.equal("Apa kabar?");
			expect(data.Conversation).to.have.property('timestamp');
			expect(data.Conversation.timestamp).to.equal(123456789);
			done();
		});
		it('remove method will return error message if conversation is nonexistent', function(done){
			let conv = new convRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			};
			
			conv.create(data);
			data = conv.remove(2);

			expect(data).to.have.property('message');
			expect(data.message).to.equal('conversation not found');
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
	});

	describe('userRepo', function(){
		var store = new Memstore();
		it('Constructor set a memory space for repository in memory', function(done){
			let user = new userRepo(store);
			expect(store.get('log')).to.have.property('User');
			expect(store.get('log').User).to.be.an.instanceof(Array);
			expect(store.get('log')).to.not.have.property('Conversation');
			let conv = new convRepo(store);
			expect(store.get('log')).to.have.property('Conversation');
			expect(store.get('log').User).to.be.an.instanceof(Array);
			done();
		});
		it('create method will return User object for successfully created record', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};
			
			data = user.create(data);
			expect(data).to.have.property('User');
			expect(data.User).to.have.property('id');
			expect(data.User.id).to.equal(1);
			expect(data.User).to.have.property('name');
			expect(data.User.name).to.equal("Tiara");
			expect(data.User).to.have.property('gender');
			expect(data.User.gender).to.equal("female");
			expect(data.User).to.have.property('city');
			expect(data.User.city).to.equal("Jakarta");
			expect(data.User).to.have.property('phone');
			expect(data.User.phone).to.equal("085722688068");
			expect(data.User).to.have.property('email');
			expect(data.User.email).to.equal("tiara.dwiputri94@gmail.com");
			done();
		});
		it('create method will return error message for invalid data format', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "perempuan",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};
			
			data = user.create(data);
			expect(data).to.have.property("message");
			expect(data.message).to.equal("invalid format");
			expect(data).to.have.property("error");
			expect(data.error).to.equal(true);
			done();
		});
		it('get method will return User object of the given id', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};
			
			data = user.create(data);
			expect(data).to.have.property('User');
			expect(data.User).to.have.property('id');
			expect(data.User.id).to.equal(1);
			expect(data.User).to.have.property('name');
			expect(data.User.name).to.equal("Tiara");
			expect(data.User).to.have.property('gender');
			expect(data.User.gender).to.equal("female");
			expect(data.User).to.have.property('city');
			expect(data.User.city).to.equal("Jakarta");
			expect(data.User).to.have.property('phone');
			expect(data.User.phone).to.equal("085722688068");
			expect(data.User).to.have.property('email');
			expect(data.User.email).to.equal("tiara.dwiputri94@gmail.com");
			done();
		});
		it('get method will return error message if User is nonexistent', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};
			
			user.create(data)
			data = user.get(2);
			expect(data).to.have.property('message');
			expect(data.message).to.equal("User not found");
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
		it('list method will return an array of User object given page and limit', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};
			
			user.create(data);
			user.create(data);
			data = user.list(1,100);

			expect(data).to.have.property('User');
			expect(data.User[0]).to.have.property('id');
			expect(data.User[0].id).to.equal(1);
			expect(data.User[0]).to.have.property('name');
			expect(data.User[0].name).to.equal("Tiara");
			expect(data.User[0]).to.have.property('gender');
			expect(data.User[0].gender).to.equal("female");
			expect(data.User[0]).to.have.property('city');
			expect(data.User[0].city).to.equal("Jakarta");
			expect(data.User[0]).to.have.property('phone');
			expect(data.User[0].phone).to.equal("085722688068");
			expect(data.User[0]).to.have.property('email');
			expect(data.User[0].email).to.equal("tiara.dwiputri94@gmail.com");
			expect(data.User[0]).to.be.equal(data.User[1]);
			expect(data.User[2]).to.be.undefined;
			done();
		});
		it('update method will return User object for successfully updated record', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};

			let partialData = {
				"name": "Bolin",
				"gender": "male"
			}
			
			user.create(data);
			data = user.update(1,partialData);

			expect(data).to.have.property('User');
			expect(data.User).to.have.property('id');
			expect(data.User.id).to.equal(1);
			expect(data.User).to.have.property('name');
			expect(data.User.name).to.equal("Bolin");
			expect(data.User).to.have.property('gender');
			expect(data.User.gender).to.equal("male");
			expect(data.User).to.have.property('city');
			expect(data.User.city).to.equal("Jakarta");
			expect(data.User).to.have.property('phone');
			expect(data.User.phone).to.equal("085722688068");
			expect(data.User).to.have.property('email');
			expect(data.User.email).to.equal("tiara.dwiputri94@gmail.com");
			done();
		});
		it('update method will return error message for invalid data format', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};

			let partialData = {
				"name": "Bolin",
				"gender": "laki-laki"
			}
			
			user.create(data);
			data = user.update(1,partialData);

			expect(data).to.have.property('message');
			expect(data.message).to.equal('invalid format');
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
		it('update method will return error message if User is nonexistent', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};

			let partialData = {
				"name": "Bolin",
				"gender": "male"
			}
			
			user.create(data);
			data = user.update(2,partialData);

			expect(data).to.have.property('message');
			expect(data.message).to.equal('User not found');
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
		it('remove method will return User object for successfully removed record', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};
			
			user.create(data);
			data = user.remove(1);

			expect(data).to.have.property('User');
			expect(data.User).to.have.property('id');
			expect(data.User.id).to.equal(1);
			expect(data.User).to.have.property('name');
			expect(data.User.name).to.equal("Tiara");
			expect(data.User).to.have.property('gender');
			expect(data.User.gender).to.equal("female");
			expect(data.User).to.have.property('city');
			expect(data.User.city).to.equal("Jakarta");
			expect(data.User).to.have.property('phone');
			expect(data.User.phone).to.equal("085722688068");
			expect(data.User).to.have.property('email');
			expect(data.User.email).to.equal("tiara.dwiputri94@gmail.com");
			done();
		});
		it('remove method will return error message if User is nonexistent', function(done){
			let user = new userRepo(store);
			let log = store.get('log');
			let data = {
				"id": 1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email": "tiara.dwiputri94@gmail.com"
			};
			
			user.create(data);
			data = user.remove(2);

			expect(data).to.have.property('message');
			expect(data.message).to.equal('User not found');
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});
	});
	
});

describe('API', function(){
	describe('Users API', function(){
		//USERS
		it('GET /users should return a 200 response with empty record', function(done){
			api.get('/users')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("User");
				expect(res.body.User).to.have.lengthOf(0);
				done();
			});
		});

		it('POST /users should post a user', function(done){
			api.post('/users')
		 	.send({
		 		"id":1,
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email" : "tiara.dwiputri94@gmail.com"})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("User");
				expect(res.body.User).to.have.property("id");
				expect(res.body.User.id).to.equal(1);
				expect(res.body.User).to.have.property("name");
				expect(res.body.User.name).to.equal("Tiara");
				expect(res.body.User).to.have.property("gender");
				expect(res.body.User.gender).to.equal("female");
				expect(res.body.User).to.have.property("city");
				expect(res.body.User.city).to.equal("Jakarta");
				expect(res.body.User).to.have.property("phone");
				expect(res.body.User.phone).to.equal("085722688068");
				expect(res.body.User).to.have.property("email");
				expect(res.body.User.email).to.equal("tiara.dwiputri94@gmail.com");
				done();
			});
		});

		it('POST /users should not post a gender data other than female and male', function(done){
			api.post('/users')
		 	.send({
		 		"id":1,
				"name": "Tiara",
				"gender": "perempuan",
				"city": "Jakarta",
				"phone": "085722688068",
				"email" : "tiara.dwiputri94@gmail.com"})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("message");
				expect(res.body.message).to.equal("invalid format");
				expect(res.body).to.have.property("error");
				expect(res.body.error).to.equal(true);
				done();
			});
		});

		it('PUT /users/:id should update user data', function(done){
			api.put('/users/1')
			.send({
				"phone": "0218714621",
				"email" : "18212018@stei.itb.ac.id"	
			})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("User");
				expect(res.body.User).to.have.property("id");
				expect(res.body.User.id).to.equal(1);
				expect(res.body.User).to.have.property("name");
				expect(res.body.User.name).to.equal("Tiara");
				expect(res.body.User).to.have.property("gender");
				expect(res.body.User.gender).to.equal("female");
				expect(res.body.User).to.have.property("city");
				expect(res.body.User.city).to.equal("Jakarta");
				expect(res.body.User).to.have.property("phone");
				expect(res.body.User.phone).to.equal("0218714621");
				expect(res.body.User).to.have.property("email");
				expect(res.body.User.email).to.equal("18212018@stei.itb.ac.id");
				done();
			})
		});

		it('GET /users/:id retrieve user data', function(done){
			api.get('/users/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("User");
				expect(res.body.User).to.have.property("id");
				expect(res.body.User.id).to.equal(1);
				expect(res.body.User).to.have.property("name");
				expect(res.body.User.name).to.equal("Tiara");
				expect(res.body.User).to.have.property("gender");
				expect(res.body.User.gender).to.equal("female");
				expect(res.body.User).to.have.property("city");
				expect(res.body.User.city).to.equal("Jakarta");
				expect(res.body.User).to.have.property("phone");
				expect(res.body.User.phone).to.equal("0218714621");
				expect(res.body.User).to.have.property("email");
				expect(res.body.User.email).to.equal("18212018@stei.itb.ac.id");
				done();
			})
		});

		it('GET /users/:id should not retrieve nonexistent user data', function(done){
			api.get('/users/2')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("message");
				expect(res.body.message).to.equal("User not found");
				expect(res.body).to.have.property("error");
				expect(res.body.error).to.equal(true);
				done();
			})
		});

		it('DELETE /users/:id remove user data and return the deleted object', function(done){
			api.delete('/users/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("User");
				expect(res.body.User).to.have.property("id");
				expect(res.body.User.id).to.equal(1);
				expect(res.body.User).to.have.property("name");
				expect(res.body.User.name).to.equal("Tiara");
				expect(res.body.User).to.have.property("gender");
				expect(res.body.User.gender).to.equal("female");
				expect(res.body.User).to.have.property("city");
				expect(res.body.User.city).to.equal("Jakarta");
				expect(res.body.User).to.have.property("phone");
				expect(res.body.User.phone).to.equal("0218714621");
				expect(res.body.User).to.have.property("email");
				expect(res.body.User.email).to.equal("18212018@stei.itb.ac.id");
				done();
			})
		});
	});
	describe('Conversations API', function(){
		//CONVERSATIONS
		it('GET /conversations should return a 200 response with empty record', function(done){
			api.get('/conversations')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("Conversation");
				expect(res.body.Conversation).to.have.lengthOf(0);
				done();
			});
		});

		it('POST /conversations should post a user', function(done){
			api.post('/conversations')
		 	.send({
		 		"id":1,
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("Conversation");
				expect(res.body.Conversation).to.have.property("id");
				expect(res.body.Conversation.id).to.equal(1);
				expect(res.body.Conversation).to.have.property("userId");
				expect(res.body.Conversation.userId).to.equal("1");
				expect(res.body.Conversation).to.have.property("direction");
				expect(res.body.Conversation.direction).to.equal("outgoing");
				expect(res.body.Conversation).to.have.property("message");
				expect(res.body.Conversation.message).to.equal("Apa kabar?");
				expect(res.body.Conversation).to.have.property("timestamp");
				expect(res.body.Conversation.timestamp).to.equal(123456789);
				done();
			});
		});

		it('POST /conversations should not post a direction data other than outgoing and incoming', function(done){
			api.post('/conversations')
		 	.send({
		 		"id":1,
				"userId": "1",
				"direction": "keluar",
				"message": "Apa kabar?",
				"timestamp": 123456789})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("message");
				expect(res.body.message).to.equal("invalid format");
				expect(res.body).to.have.property("error");
				expect(res.body.error).to.equal(true);
				done();
			});
		});

		it('PUT /conversations/:id should update user data', function(done){
			api.put('/conversations/1')
			.send({
				"direction": "incoming",
				"message" : "Piye kabare?"	
			})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("Conversation");
				expect(res.body.Conversation).to.have.property("id");
				expect(res.body.Conversation.id).to.equal(1);
				expect(res.body.Conversation).to.have.property("userId");
				expect(res.body.Conversation.userId).to.equal("1");
				expect(res.body.Conversation).to.have.property("direction");
				expect(res.body.Conversation.direction).to.equal("incoming");
				expect(res.body.Conversation).to.have.property("message");
				expect(res.body.Conversation.message).to.equal("Piye kabare?");
				expect(res.body.Conversation).to.have.property("timestamp");
				expect(res.body.Conversation.timestamp).to.equal(123456789);
				done();
			});
		});

		it('GET /conversations/:id retrieve conversation data', function(done){
			api.get('/conversations/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("Conversation");
				expect(res.body.Conversation).to.have.property("id");
				expect(res.body.Conversation.id).to.equal(1);
				expect(res.body.Conversation).to.have.property("userId");
				expect(res.body.Conversation.userId).to.equal("1");
				expect(res.body.Conversation).to.have.property("direction");
				expect(res.body.Conversation.direction).to.equal("incoming");
				expect(res.body.Conversation).to.have.property("message");
				expect(res.body.Conversation.message).to.equal("Piye kabare?");
				expect(res.body.Conversation).to.have.property("timestamp");
				expect(res.body.Conversation.timestamp).to.equal(123456789);
				done();
			})
		});

		it('GET /conversations/:id should not retrieve nonexistent conversation data', function(done){
			api.get('/conversations/2')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("message");
				expect(res.body.message).to.equal("conversation not found");
				expect(res.body).to.have.property("error");
				expect(res.body.error).to.equal(true);
				done();
			})
		});

		it('DELETE /conversations/:id remove conversation data and return the deleted object', function(done){
			api.delete('/conversations/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("Conversation");
				expect(res.body.Conversation).to.have.property("id");
				expect(res.body.Conversation.id).to.equal(1);
				expect(res.body.Conversation).to.have.property("userId");
				expect(res.body.Conversation.userId).to.equal("1");
				expect(res.body.Conversation).to.have.property("direction");
				expect(res.body.Conversation.direction).to.equal("incoming");
				expect(res.body.Conversation).to.have.property("message");
				expect(res.body.Conversation.message).to.equal("Piye kabare?");
				expect(res.body.Conversation).to.have.property("timestamp");
				expect(res.body.Conversation.timestamp).to.equal(123456789);
				done();
			});
		});
	});
});