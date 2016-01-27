var Product = require('../models/product'),
		log4js = require('log4js'),
		logger = log4js.getLogger(),
		moment = require('moment');


exports.list = function list(session, query, callback) {
	var page = parseInt(query.page || 1);
	var limit = parseInt(query.limit || 20);
	var userId = session.userId;
	if(page > 0) page = page - 1;

	var query = Product.find({})
	query.where('user', userId).limit(limit).skip(limit*page);

	query.exec(function(err, products) {
		if(err || !products) {
			return callback({error: {code: 409, message: 'No Products found!', data: null}});
		} else {
			var response = {
				page: page + 1,
				size: products.length,
				products: products
			}
			callback(null, {code: 200, data: response});
		}
	});
}

exports.create = function create(session, obj, callback) {
	if(!obj) {
		return callback({error: {code: 400, message: 'Missing required fields', data: null}});
	} else {
		var product = new Product(obj);
		product.user = session.userId;
		product.save(function(err, prod) {
			if(err) 
				return callback({error: {code: 400, message: 'Invalid params', data: null}});
			else
				callback(null, {code: 200, data: {product: prod}});
		});
	}
}

exports.get = function get(session, id, callback) {
	if(!id) {
		return callback({error: {code: 400, message: 'Missing id', data: null}});
	} else {
		Product.findOne({
			_id: id,
			user: session.userId	
		}, function(err, product) {
			if(err || !product) {
				return callback({error: {code: 400, message: 'Product not found!', data: null}});
			} else {
				return callback(null, {code: 200, data: {product: product}});
			}
		});
	}
}

exports.update = function update(session, id, obj, callback) {
	if(!id)
		return callback({error: {code: 400, message: 'Missing id', data: null}});
	if(!obj)
		return callback({error: {code: 400, message: 'Missing required fields', data: null}});
	Product.findOne({
		_id: id,
		user: session.userId
	}, function(err, oldProduct) {
		if(err || !oldProduct) {
			return callback({error: {code: 404, message: 'Product not found!'}});
		} else {
			oldProduct.name = obj.name,
			oldProduct.description = obj.description,
			oldProduct.price = obj.price
			oldProduct.updatedAt = moment();
			oldProduct.save(function(err, newProduct) {
				if(err) {
					return callback({error: {code: 400, message: 'Unable to save', data: null}});
				} else {
					callback(null, {code: 201, message: 'Product updated successfully!', data: {product: newProduct}});
				}
			});
		}
	});
}

exports.delete = function deleteFn(session, id, callback) {
	if(!id) {
		return callback({error: {code: 400, message: 'Missing id', data: null}});
	} else {
		Product.findOne({
			_id: id,
			user: session.userId
		}, function(err, product) {
			if(err || !product) {
				callback({error: {code: 404, message: 'Product not found with id: '+ id}});
			} else {
				product.remove(function(err) {
					callback(err, {code: 200, message:'Product deleted!', data: null});
				});
			}
		});
	}
}

exports.search = function search(session, qs, callback) {
	var query = Product.find();
	if (qs.name) {
		query.where('name', new RegExp(qs.name, 'i'))
			.exec(function(err, products) {
				if(err) {
					return callback({error: {code: 400, message: 'Product not found!'}});
				} else {
					return callback(null, {code: 200, data: {products: products}});
				}
		});
	} else {
		return callback({error: {code: 400, message: 'Product not found without name!'}});
	}
};
