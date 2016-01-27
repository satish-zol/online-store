var express = require('express');
var router = express.Router();
var users = require('../controllers/users');

router.route('/')
	.get(function(req, res) {
		res.json({message: 'hooray! welcome to our api'});
	});

router.route('/sign_up')
		.post(function(req, res) {
			var body = req.body;
			users.create(body, function(err, obj) {
				if (err) {
					res.statusCode = err.code;
					res.send(err);
				} else {
					res.json(obj);
				}
			});
		});

router.route('/:id')
	.get(function(req, res) {
		users.get(req.params.id, function(err, obj) {
			if (err) {
				res.statusCode = err.code;
				res.send(err);
			} else {
				res.json(obj);
			}
		});
	})
	.put(function(req, res) {
		users.update(req.session, req.params.id, req.body, function(err, obj) {
			if(err) {
				res.statusCode = err.code;
				res.send(err);
			} else {
				res.json(obj);
			}
		});
	});

	router.route('/sign_in')
		.post(function(req, res) {
			var body = req.body;
			users.login(body.email, body.password, function(err, obj) {
				if (err) {
					res.statusCode = err.code;
					res.send(err);
				} else {
					res.json(obj);
				}
			});
		});

module.exports = router;