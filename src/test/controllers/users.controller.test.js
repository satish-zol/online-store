'user strict';
process.env.NODE_ENV = 'test';

var utils = require('../utils'),
		should = require('should'),
		User = require('../../models/user'),
		users = require('../../controllers/users');   

// global objects required of testing
var userParams = {
			username: 'test',
			email: "test@yopmail.com",
			password: '12345678'
		};


describe('User controller test: ', function() {
	describe('Create User:', function() {
		it('should create a user with valid params', function(done) {
			return users.create(userParams, function(err, user) {
				should.not.exist(err);
				should.exist(user);
				user.data.email.should.equal(userParams.email);
				done();
			});
		});
		
		it('should not create a user with invalid params: ', function(done) {
			return users.create({username: null, email: null, password: null}, function(err, user) {
				should.not.exist(user);
				should.exist(err);
				done();
			});
		});
	});

	describe('Existing user test:', function() {
		var newUser;
		beforeEach(function(done) {
			users.create(userParams, function(err, u) {
				if(err)
					done(err);
				else
					newUser = u;
					done();
			});
		});

		describe('Already exist user test', function() {
			it('should raise an error for existing email', function(done) {
				users.create(userParams, function(err, user) {
					should.exist(err);
					should.not.exist(user);
					err.error.code.should.equal(409);
					done();
				});
			});

			it('should login with email and password', function(done) {
				users.login(userParams.email, userParams.password, function(err, user) {
					should.not.exist(err);
					should.exist(user);
					done();
				});
			});

			it('should not login with invalid email|password', function(done) {
				users.login('testing@abc.com', '122', function(err, user) {
					should.not.exist(user);
					should.exist(err);
					done();
				});
			});

			it('should not login with empty fields', function(done) {
				users.login(null, null, function(err, user) {
					should.exist(err);
					should.not.exist(user);
					done();
				});
			});

			it('should validate token', function(done) {
				users.validateToken(newUser.data.token, function(err, user) {
					should.exist(user);
					should.not.exist(err);
					done();
				});
			});

			it('should not validate wrong token', function(done) {
				users.validateToken('1234abcde', function(err, user) {
					should.exist(err);
					should.not.exist(user);
					done();
				});
			});

			it('should get the user by id', function(done) {
				users.get(newUser.data._id, function(err, user) {
					should.exist(user);
					should.not.exist(err);
					done();
				});
			});

			it('should not get user by wrong id', function(done) {
				users.get('1234abcde', function(err, user) {
					should.exist(err);
					should.not.exist(user);
					done();
				});
			});
		});
	})



	afterEach(function(done) {
		User.remove().exec();
		done();
	});
});


