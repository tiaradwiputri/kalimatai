const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:5000');

/*
describe('Init', function(){
	describe('Create objects', function(){
		it('app should create store object'), function(){
			assert.equal(app());
		};
		it('app should create userRepository object'), function(){
			assert.equal(app());
		};
		it('app should create convRepository object'), function(){
			assert.equal(app());
		};
		it('app should create server object'), function(){
			assert.equal(app());
		};
	});

	describe('App is running', function(){
		it('app should listening on port 5000'), function(){
			assert.equal(app());
		};
	});
	
});
*/

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