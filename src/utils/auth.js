var users = require('../../src/controllers/users');
var session = require('../../src/controllers/session');
var jwt = require('jwt-simple');
var constants = require('../utils/constants');

//check the token in request and authenticate user, maintain session
module.exports = function (req, res, next) {
	//check and return for below routes without access token
	//req.originalUrl.indexOf("/api/users/reset-password/") > -1 )
	if((req.originalUrl.indexOf("/api/v1/users/sign_up") > -1 && req.method === 'POST') || 
        (req.originalUrl.indexOf("/api/v1/users/sign_in")  > -1 && req.method === 'POST')) return next();
	
	var token = (req.body && req.body.access_token)  || (req.query && req.query.access_token) || req.headers['x-access-token'];
	if(token) {
		try {
			var decode = jwt.decode(token, constants.TOKEN_SECRET);
			if(decode.exp <= Date.now()) {
				res.status(401);
				return next(res.json({error: {code: 401, message:'Access token expired', data: null}}));
			}
			//validate token
			session.getToken(token, function(err, session) {
				if (err || !session) {
					res.status(401);
					res.json({error: {code: 401, message:'Invalid access token', data: null}});
					return next(err);
				}
				req.session = session;
				return next();
			});
		} catch (err) {
			res.status(401);
			return next(res.json({error: {code: 401, message: 'Unable to decode access token', data: null}}));
		}
	} else {
		res.status(401);
		return next(res.json({error: {code: 401, message: 'Access token must be passed', data: null}}));
	}
} 