var User = require('../models/user'),
		generateSalt = require('../utils/generate-salt-password'),
		crypto = require('crypto'),
		moment = require('moment'),
		jwt = require('jwt-simple'),
		constants = require('../utils/constants'),
		log4js = require('log4js');
var logger = log4js.getLogger();

exports.create = function(obj, callback) {
	
	var userObj = new User(obj);
	var query = User.where({
		email: userObj.email
	});
	query.findOne(function(err, user) {
		if(err || user) {
			return callback({error: {code: 409, message: 'User already exist', data: null}});
		} else {
			generateSalt.saltAndHash(userObj.password, function(hash) {
				userObj.password = hash;
				var now = moment();
				userObj.updated_at = now;
				var tokenDuration = 7;
				var expires = moment().add(tokenDuration, 'days').valueOf();
				var token = jwt.encode({
					userId: userObj.id,
					exp: expires
				}, constants.TOKEN_SECRET);
				userObj.token = token;
				userObj.save(function(err, newUser) {
					if(err) {
						return callback({error: {code: 400, message: 'Unable to save data!', data: null}});
					} else {
						callback(null, {code: 200, data: newUser});
					}
				});
			});
		}
	});
}

exports.get = function get(id, callback) {
	if (!id) {
		return callback({error: {message: 'Missing user id', data: null}});
	} 
	User.findOne({
		_id: id
	}, function(err, user) {
		if(err) {
			return callback({error: {code: 400, message: 'User not found!', data: null}});
		}
		callback(err, {code: 200, data: user});
	});	
}

exports.login = function login(email, password, callback) {
	if(!email && !password)
		return callback({error: {message: 'Email, password missing', data: null}});
	User.findOne({
		email: email
	}, function(err, user) {
		if(err || !user) {
			return callback({error: {message: 'User not found with email: '+ email, data: null}});
		} else {
			validatePassword(password, user.password, function(err, result) {
				if(result) { 
					refreshToken(user, callback);
				} else {
					return callback({error: {message: 'Invalid password', data: null}});
				}
			});
		}
	});
}

//validate token
exports.validateToken = function validateToken(token, callback) {
	if(token) {
		try {
			var decoded = jwt.decode(token, constants.TOKEN_SECRET);
			User.findOne({
				_id: decoded.userId
			}, function(err, user) {
				if(err) {
					return callback(err);
				} else if (!user) {
					return callback({error: {message: 'User not found with access token', data: null}});
				} else {
					if(decoded.exp <= Date.now()) {
						return callback({error: {message: 'Access token expired!', data: null}});
					} else {
						return callback(null, user);
					}
				}
			});
		} catch(e) {
			return callback(e);
		}
	} else {
		return callback({error: {message: 'No token provided', data: null}});
	}
}


//refresh token
var refreshToken = function refreshToken(user, callback) {
	var tokenDuration = 7;
	var expires = moment().add(tokenDuration, 'days').valueOf();
	var token = jwt.encode({
		userId: user._id,
		exp: expires
	}, constants.TOKEN_SECRET);
	user.token = token;
	user.save(function(err, userObj) {
		if(err)
			return callback(err);
		else
			callback(null, userObj);
	});
}

//validate password
var validatePassword = function validatePassword(plainPass, hashedPass, callback) {
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + generateSalt.md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}