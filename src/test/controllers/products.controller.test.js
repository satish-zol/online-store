'user strict';
process.env.NODE_ENV = 'test';

var utils = require('../utils'),
		should = require('should'),
		User = require('../../models/user'),
		Product = require('../../models/user'),
		users = require('../../controllers/users'),
		products = require('../../controllers/products');   

// global objects required of testing
var userParams = {
			username: 'test',
			email: "test@yopmail.com",
			password: '12345678'
		},
		productParams = {
			name: 'Product1',
			description: "This is test data",
			price: 1000.00
		},
		session = {}, prod;


describe('Product Test:', function() {
	beforeEach(function(done) {
		users.create(userParams, function(err, u) {
			if(err)
				done(err);
			else
				newUser = u;
				session.token = u.data.token;
				session.userId = u.data._id;
				done();
		});
	});

	describe('Product create test', function() {
		it('should create a product with valid data', function(done) {
			return products.create(session, productParams, function(err, product) {
				should.not.exist(err);
				should.exist(product);
				done();
			});
		});

		it('should not create a product with null data', function(done) {
			return products.create(session, {name: null, description: null, price: null}, function(err, product) {
				should.not.exist(product);
				should.exist(err);
				done();
			});
		});
	});

	describe('Product with id', function() {
		beforeEach(function(done) {
			products.create(session, productParams, function(err, product) {
				if(err)
					done(err);
				else
					prod = product;
					done();
			});
		});

		describe('Get product with id', function() {
			it('should get the product on valid id', function(done) {
				return products.get(session, prod.data.product._id, function(err, product) {
					should.exist(product);
					should.not.exist(err);
					done();
				});
			});

			it('should not get the product on invalid id', function(done) {
				return products.get(session, '1234abcde', function(err, product) {
					should.exist(err);
					should.not.exist(product);
					done();
				});
			});

			it('should update the product', function(done) {
				var updatedProductParams = {
					name: "Product1 updated",
					description: "This is test data updated",
					price: 1000.00
				};
				return products.update(session, prod.data.product._id, updatedProductParams, function(err, newProd) {
					should.exist(newProd);
					should.not.exist(err);
					newProd.data.product.name.should.equal('Product1 updated');
					done();
				});
			});

			it('should not update the product with invalid data', function(done) {
				return products.update(session, prod.data.product._id, {name: null, description: null, price: null}, function(err, newProduct) {
					should.exist(err);
					should.not.exist(newProduct);
					done();
				});
			});

			it('should delete the product', function(done) {
				return products.delete(session, prod.data.product._id, function(err, product) {
					should.not.exist(err);
					return products.get(session, prod.data.product._id, function(err, product) {
						should.exist(err);
						should.not.exist(product);
						done();
					});
				});
			});

			it('should list all products', function(done) {
				var query = {
					page: 1,
					limit: 20
				}
				return products.list(session, query, function(err, prods) {
					should.not.exist(err);
					should.exist(prods);
					prods.data.products.length.should.equal(1);
					done();
				});
			});
		});
	});
});
