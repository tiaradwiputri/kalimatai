"use strict";

const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:5000');
const config = require('../config.json');

const GenericRepo = require('../components/repo/generic_repo.js');

const Memstore = require('../components/store/memory_store.js');

const ApiServer = require('../components/server/api_server.js');

let Injector = require('../Injector.js');
const injector = new Injector(config);

describe('Unit Testing', function(){
	describe('Injector', function(){
		it('Constructor should parse main specification as stated in config', function(done){
			expect(injector).to.have.property('_main');
			expect(injector._main).to.have.property('component');
			expect(injector._main.component).to.equal('server');
			expect(injector._main).to.have.property('method');
			expect(injector._main.method).to.equal('start');
			expect(injector._main).to.have.property('args');
			expect(injector._main.args).to.be.an('array').that.includes(5000);
			done();
		});

		it('Construct all components stated in config', function(done){
			expect(injector).to.have.property('_userRepo');
			expect(injector._userRepo).to.be.an.instanceof(GenericRepo);
			expect(injector).to.have.property('_convRepo');
			expect(injector._convRepo).to.be.an.instanceof(GenericRepo);
			expect(injector).to.have.property('_store');
			expect(injector._store).to.be.an.instanceof(Memstore);
			expect(injector).to.have.property('_server');
			expect(injector._server).to.be.an.instanceof(ApiServer);
			done();
		});

		it('Resolve method construct object based on dependencies defined in config', function(done){
			let store = injector._resolve(config['components']['store']);
			expect(store).to.be.an.instanceof(Memstore);
			let convRepo = injector._resolve(config['components']['convRepo']);
			expect(convRepo).to.be.an.instanceof(GenericRepo);
			let userRepo = injector._resolve(config['components']['userRepo']);
			expect(userRepo).to.be.an.instanceof(GenericRepo);
			let server = injector._resolve(config['components']['server']);
			expect(server).to.be.an.instanceof(ApiServer);
			done();
		});
	});
	describe('GenericRepo', function(){
		it('Constructor created generic repository with access to store and defined schema', function(done){
			let repository = new GenericRepo(new Memstore(), config['components']['convRepo']['options']);
			expect(repository).to.have.property('_store');
			expect(repository).to.have.property('_schema');
			expect(repository._schema).to.equal(config['components']['convRepo']['options']['schema']);
			repository = new GenericRepo(new Memstore(), config['components']['userRepo']['options']);
			expect(repository).to.have.property('_store');
			expect(repository).to.have.property('_schema');
			expect(repository._schema).to.equal(config['components']['userRepo']['options']['schema']);
			done();
		});

		it('get method will return data with specified id', function(done){
			let store = new Memstore();
			let repository = new GenericRepo(store, config['components']['convRepo']['options']);
			repository.setName('convRepo');
			let data = {
				convRepo : [{
					"id": 1,
					"userId": 1,
					"direction": "outgoing",
					"message": "Apa kabar?",
					"timestamp": 123456789
				},{
					"id": 2,
					"userId": 3,
					"direction": "incoming",
					"message": "Kabar baik",
					"timestamp": 123456889
				}]
			}
			store.set('log',data);
			expect(repository.get(1).convRepo).to.have.property('userId');
			expect(repository.get(1).convRepo.userId).to.equal(1);
			expect(repository.get(1).convRepo).to.have.property('direction');
			expect(repository.get(1).convRepo.direction).to.equal("outgoing");
			expect(repository.get(1).convRepo).to.have.property('message');
			expect(repository.get(1).convRepo.message).to.equal("Apa kabar?");
			expect(repository.get(1).convRepo).to.have.property('timestamp');
			expect(repository.get(1).convRepo.timestamp).to.equal(123456789);

			expect(repository.get(2).convRepo).to.have.property('userId');
			expect(repository.get(2).convRepo.userId).to.equal(3);
			expect(repository.get(2).convRepo).to.have.property('direction');
			expect(repository.get(2).convRepo.direction).to.equal("incoming");
			expect(repository.get(2).convRepo).to.have.property('message');
			expect(repository.get(2).convRepo.message).to.equal("Kabar baik");
			expect(repository.get(2).convRepo).to.have.property('timestamp');
			expect(repository.get(2).convRepo.timestamp).to.equal(123456889);
			done();
		});

		it('list method will return an array showing up to 10 records per page', function(done){
			let store = new Memstore();
			let repository = new GenericRepo(store, config['components']['convRepo']['options']);
			repository.setName('convRepo');
			let data = {
				convRepo : [{
					"id": 1
				},{
					"id": 2
				},{
					"id": 3
				},{
					"id": 4
				},{
					"id": 5
				},{
					"id": 6
				},{
					"id": 7
				},{
					"id": 8
				},{
					"id": 9
				},{
					"id": 10
				},{
					"id": 11
				}]
			}
			store.set('log',data);
			expect(repository.list(1,100)).to.have.property('convRepo')
			expect(repository.list(1,100).convRepo).to.be.an.instanceof(Array);
			expect(repository.list(1,100).convRepo[0]).to.have.property('id');
			expect(repository.list(1,100).convRepo[0].id).to.equal(1);
			expect(repository.list(1,100).convRepo[9]).to.have.property('id');
			expect(repository.list(1,100).convRepo[9].id).to.equal(10);

			expect(repository.list(2,100).convRepo).to.be.an.instanceof(Array);
			expect(repository.list(2,100).convRepo[0]).to.have.property('id');
			expect(repository.list(2,100).convRepo[0].id).to.equal(11);
			expect(repository.list(2,100).convRepo[1]).to.be.undefined;
			done();
		});

		it('create method will return the successfully stored data', function(done){
			let store = new Memstore();
			let repository = new GenericRepo(store, config['components']['convRepo']['options']);
			repository.setName('convRepo');
			let data = {
				convRepo: []}
			store.set('log',data);
			data = 	{
				"userId": 1,
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			}
			data = repository.create(data);
			expect(data).to.have.property('convRepo');
			expect(data.convRepo).to.have.property('id');
			expect(data.convRepo.id).to.equal(1);
			expect(data.convRepo).to.have.property('userId');
			expect(data.convRepo.userId).to.equal(1);
			expect(data.convRepo).to.have.property('direction');
			expect(data.convRepo.direction).to.equal('outgoing');
			expect(data.convRepo).to.have.property('message');
			expect(data.convRepo.message).to.equal('Apa kabar?');
			expect(data.convRepo).to.have.property('timestamp');
			expect(data.convRepo.timestamp).to.equal(123456789);
			done();
		});

		it('create method will return error message for invalid data format', function(done){
			let store = new Memstore();
			let repository = new GenericRepo(store, config['components']['convRepo']['options']);
			repository.setName('convRepo');
			let data = {
				convRepo: []}
			store.set('log',data);
			data = 	{
				"userId": 1,
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": "123456789"
			}
			data = repository.create(data);
			expect(data).to.have.property('message');
			expect(data.message).to.equal("invalid format");
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});

		it('update method return the updated data', function(done){
			let store = new Memstore();
			let repository = new GenericRepo(store, config['components']['convRepo']['options']);
			repository.setName('convRepo');
			let data = {
				convRepo : [{
					"id": 1,
					"userId": 1,
					"direction": "outgoing",
					"message": "Apa kabar?",
					"timestamp": 123456789
				}]
			}
			store.set('log',data);
			
			let partialData = {
				"userId": 3,
				"direction": "incoming",
				"message": "Kabar baik"
			}

			data = repository.update(1, partialData);

			expect(data).to.have.property('convRepo');
			expect(data.convRepo).to.have.property('id');
			expect(data.convRepo.id).to.equal(1);
			expect(data.convRepo).to.have.property('userId');
			expect(data.convRepo.userId).to.equal(3);
			expect(data.convRepo).to.have.property('direction');
			expect(data.convRepo.direction).to.equal('incoming');
			expect(data.convRepo).to.have.property('message');
			expect(data.convRepo.message).to.equal('Kabar baik');
			expect(data.convRepo).to.have.property('timestamp');
			expect(data.convRepo.timestamp).to.equal(123456789);
			done();
		});

		it('update method will return error message for invalid data format', function(done){
			let store = new Memstore();
			let repository = new GenericRepo(store, config['components']['convRepo']['options']);
			repository.setName('convRepo');
			let data = {
				convRepo : [{
					"id": 1,
					"userId": 1,
					"direction": "outgoing",
					"message": "Apa kabar?",
					"timestamp": 123456789
				}]
			}
			store.set('log',data);
			
			let partialData = {
				"userId": "3",
				"direction": "incoming",
				"message": "Kabar baik"
			}

			data = repository.update(1, partialData);

			expect(data).to.have.property('message');
			expect(data.message).to.equal("invalid format");
			expect(data).to.have.property('error');
			expect(data.error).to.equal(true);
			done();
		});

		it('remove method will return deleted record', function(done){
			let store = new Memstore();
			let repository = new GenericRepo(store, config['components']['convRepo']['options']);
			repository.setName('convRepo');
			let data = {
				convRepo: []}
			store.set('log',data);
			data = 	{
				"id": 1,
				"userId": 1,
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			}
			repository.create(data);
			removed = repository.remove(1);
			expect(removed).to.have.property('convRepo');
			expect(removed.convRepo).to.have.property('id');
			expect(removed.convRepo.id).to.equal(1);
			expect(removed.convRepo).to.have.property('userId');
			expect(removed.convRepo.userId).to.equal(1);
			expect(removed.convRepo).to.have.property('direction');
			expect(removed.convRepo.direction).to.equal("outgoing");
			expect(removed.convRepo).to.have.property('message');
			expect(removed.convRepo.message).to.equal("Apa kabar?");
			expect(removed.convRepo).to.have.property('timestamp');
			expect(removed.convRepo.timestamp).to.equal(123456789);
			done();
		});

		it('validation method used validate correct format of sent data', function(done){
			let repository = new GenericRepo(new Memstore(), config['components']['convRepo']['options']);
			let data = {
				"userId": 1,
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			}
			expect(repository._validation(data)).to.equal(true);
			data = {
				"userId": "1",
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789
			}
			expect(repository._validation(data)).to.equal(false);
			data = {
				"userId": 1,
				"direction": "outgoing",
				"message": 9999,
				"timestamp": 123456789
			}
			expect(repository._validation(data)).to.equal(false);
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
			.set('limit',100)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("userRepo");
				expect(res.body.userRepo[0]).to.equal(null);
				done();
			});
		});

		it('GET /users should return a 200 response with 10 record per page', function(done){
			api.get('/users')
			.expect(200)
			.set('limit',100)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body.userRepo).to.have.lengthOf(10);
				done();
			});
		});

		it('GET /users should return a 200 response limited with 5 data', function(done){
			api.get('/users')
			.expect(200)
			.set('limit',5)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body.userRepo).to.have.lengthOf(10);
				done();
			});
		});

		it('POST /users should post a user', function(done){
			api.post('/users')
		 	.send({
				"name": "Tiara",
				"gender": "female",
				"city": "Jakarta",
				"phone": "085722688068",
				"email" : "tiara.dwiputri94@gmail.com"})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("userRepo");
				expect(res.body.userRepo).to.have.property("name");
				expect(res.body.userRepo.name).to.equal("Tiara");
				expect(res.body.userRepo).to.have.property("gender");
				expect(res.body.userRepo.gender).to.equal("female");
				expect(res.body.userRepo).to.have.property("city");
				expect(res.body.userRepo.city).to.equal("Jakarta");
				expect(res.body.userRepo).to.have.property("phone");
				expect(res.body.userRepo.phone).to.equal("085722688068");
				expect(res.body.userRepo).to.have.property("email");
				expect(res.body.userRepo.email).to.equal("tiara.dwiputri94@gmail.com");
				done();
			});
		});

		it('POST /users/ can automatically generate id', function(done){
			api.get('/users/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("userRepo");
				expect(res.body.userRepo).to.have.property("id");
				expect(res.body.userRepo.id).to.equal(1);
				done();
			})
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
				expect(res.body).to.have.property("userRepo");
				expect(res.body.userRepo).to.have.property("id");
				expect(res.body.userRepo.id).to.equal(1);
				expect(res.body.userRepo).to.have.property("name");
				expect(res.body.userRepo.name).to.equal("Tiara");
				expect(res.body.userRepo).to.have.property("gender");
				expect(res.body.userRepo.gender).to.equal("female");
				expect(res.body.userRepo).to.have.property("city");
				expect(res.body.userRepo.city).to.equal("Jakarta");
				expect(res.body.userRepo).to.have.property("phone");
				expect(res.body.userRepo.phone).to.equal("0218714621");
				expect(res.body.userRepo).to.have.property("email");
				expect(res.body.userRepo.email).to.equal("18212018@stei.itb.ac.id");
				done();
			})
		});

		it('GET /users/:id retrieve user data', function(done){
			api.get('/users/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("userRepo");
				expect(res.body.userRepo).to.have.property("id");
				expect(res.body.userRepo.id).to.equal(1);
				expect(res.body.userRepo).to.have.property("name");
				expect(res.body.userRepo.name).to.equal("Tiara");
				expect(res.body.userRepo).to.have.property("gender");
				expect(res.body.userRepo.gender).to.equal("female");
				expect(res.body.userRepo).to.have.property("city");
				expect(res.body.userRepo.city).to.equal("Jakarta");
				expect(res.body.userRepo).to.have.property("phone");
				expect(res.body.userRepo.phone).to.equal("0218714621");
				expect(res.body.userRepo).to.have.property("email");
				expect(res.body.userRepo.email).to.equal("18212018@stei.itb.ac.id");
				done();
			})
		});

		it('GET /users/:id should not retrieve nonexistent user data', function(done){
			api.get('/users/2')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("message");
				expect(res.body.message).to.equal("record not found");
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
				expect(res.body).to.have.property("userRepo");
				expect(res.body.userRepo).to.have.property("id");
				expect(res.body.userRepo.id).to.equal(1);
				expect(res.body.userRepo).to.have.property("name");
				expect(res.body.userRepo.name).to.equal("Tiara");
				expect(res.body.userRepo).to.have.property("gender");
				expect(res.body.userRepo.gender).to.equal("female");
				expect(res.body.userRepo).to.have.property("city");
				expect(res.body.userRepo.city).to.equal("Jakarta");
				expect(res.body.userRepo).to.have.property("phone");
				expect(res.body.userRepo.phone).to.equal("0218714621");
				expect(res.body.userRepo).to.have.property("email");
				expect(res.body.userRepo.email).to.equal("18212018@stei.itb.ac.id");
				done();
			})
		});
	});
	describe('Conversations API', function(){
		//CONVERSATIONS
		it('GET /conversations should return a 200 response with empty record', function(done){
			api.get('/conversations')
			.expect(200)
			.set('limit',100)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("convRepo");
				expect(res.body.convRepo[0]).to.equal(null);
				done();
			});
		});

		it('GET /conversations should return a 200 response with 10 record per page', function(done){
			api.get('/conversations')
			.expect(200)
			.set('limit',100)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body.convRepo).to.have.lengthOf(10);
				done();
			});
		});

		it('GET /conversations should return a 200 response limited with 5 data', function(done){
			api.get('/conversations')
			.expect(200)
			.set('limit',5)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body.convRepo).to.have.lengthOf(10);
				done();
			});
		});

		it('POST /conversations should post a conversations', function(done){
			api.post('/conversations')
		 	.send({
				"userId": 1,
				"direction": "outgoing",
				"message": "Apa kabar?",
				"timestamp": 123456789})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("convRepo");
				expect(res.body.convRepo).to.have.property("id");
				expect(res.body.convRepo.id).to.equal(1);
				expect(res.body.convRepo).to.have.property("userId");
				expect(res.body.convRepo.userId).to.equal(1);
				expect(res.body.convRepo).to.have.property("direction");
				expect(res.body.convRepo.direction).to.equal("outgoing");
				expect(res.body.convRepo).to.have.property("message");
				expect(res.body.convRepo.message).to.equal("Apa kabar?");
				expect(res.body.convRepo).to.have.property("timestamp");
				expect(res.body.convRepo.timestamp).to.equal(123456789);
				done();
			});
		});



		it('POST /conversations can automatically generate id', function(done){
			api.get('/conversations/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("convRepo");
				expect(res.body.convRepo).to.have.property("id");
				expect(res.body.convRepo.id).to.equal(1);
				done();
			})
		});

		it('PUT /conversations/:id should update conversation data', function(done){
			api.put('/conversations/1')
			.send({
				"direction": "incoming",
				"message" : "Piye kabare?"	
			})
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("convRepo");
				expect(res.body.convRepo).to.have.property("id");
				expect(res.body.convRepo.id).to.equal(1);
				expect(res.body.convRepo).to.have.property("userId");
				expect(res.body.convRepo.userId).to.equal(1);
				expect(res.body.convRepo).to.have.property("direction");
				expect(res.body.convRepo.direction).to.equal("incoming");
				expect(res.body.convRepo).to.have.property("message");
				expect(res.body.convRepo.message).to.equal("Piye kabare?");
				expect(res.body.convRepo).to.have.property("timestamp");
				expect(res.body.convRepo.timestamp).to.equal(123456789);
				done();
			});
		});

		it('GET /conversations/:id retrieve conversation data', function(done){
			api.get('/conversations/1')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("convRepo");
				expect(res.body.convRepo).to.have.property("id");
				expect(res.body.convRepo.id).to.equal(1);
				expect(res.body.convRepo).to.have.property("userId");
				expect(res.body.convRepo.userId).to.equal(1);
				expect(res.body.convRepo).to.have.property("direction");
				expect(res.body.convRepo.direction).to.equal("incoming");
				expect(res.body.convRepo).to.have.property("message");
				expect(res.body.convRepo.message).to.equal("Piye kabare?");
				expect(res.body.convRepo).to.have.property("timestamp");
				expect(res.body.convRepo.timestamp).to.equal(123456789);
				done();
			})
		});

		it('GET /conversations/:id should not retrieve nonexistent conversation data', function(done){
			api.get('/conversations/2')
			.expect(200)
			.set('Accept', 'application/json')
			.end(function(err, res){
				expect(res.body).to.have.property("message");
				expect(res.body.message).to.equal("record not found");
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
				expect(res.body).to.have.property("convRepo");
				expect(res.body.convRepo).to.have.property("id");
				expect(res.body.convRepo.id).to.equal(1);
				expect(res.body.convRepo).to.have.property("userId");
				expect(res.body.convRepo.userId).to.equal(1);
				expect(res.body.convRepo).to.have.property("direction");
				expect(res.body.convRepo.direction).to.equal("incoming");
				expect(res.body.convRepo).to.have.property("message");
				expect(res.body.convRepo.message).to.equal("Piye kabare?");
				expect(res.body.convRepo).to.have.property("timestamp");
				expect(res.body.convRepo.timestamp).to.equal(123456789);
				done();
			});
		});
	});
});
