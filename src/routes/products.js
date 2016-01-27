var express = require('express');
var router = express.Router();
var products = require('../controllers/products');

router.route('/')
	.get(function(req, res) {
		var query = {
			page: req.query.page,
			limit: req.query.limit
		}
		products.list(req.session, query, function(err, products) {
			if(err) {
				res.statusCode = err.error.code;
				res.json(err);
			} else {
				res.json(products);
			}
		});
	}).post(function(req, res) {
		products.create(req.session, req.body, function(err, product) {
			if(err) {
				res.statusCode = err.error.code;
				res.json(err);
			} else {
				res.json(product);
			}
		});
	});

router.route('/search')
	.get(function(req, res) {
		var qs = req.query;
		products.search(req.session, qs, function(err, products) {
			if(err) {
				res.statusCode = err.error.code;
				res.json(err);
			} else {
				res.json(products);
			}
		});
	});

router.route('/:id')
	.put(function(req, res) {
		products.update(req.session, req.params.id, req.body, function(err, product) {
			if(err) {
				res.statusCode = err.error.code;
				res.json(err);
			} else {
				res.json(product);
			}
		});
	}).get(function(req, res) {
		products.get(req.session, req.params.id, function(err, product) {
			if(err) {
				res.statusCode = err.error.code;
				res.json(err);
			} else {
				res.json(product);
			}
		});
	}).delete(function(req, res) {
		products.delete(req.session, req.params.id, function(err, product) {
			if(err) {
				res.statusCode = err.error.code;
				res.json(err);
			} else {
				res.json(product);
			}
		});
	});

module.exports = router;