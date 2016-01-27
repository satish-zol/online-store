var users = require('./users');

module.exports.getToken = function getToken(token, callback) {
	users.validateToken(token, function(err, user) {
		if(err) {
			return callback(err);
		} else {
			callback(null, {token: user.token, userId: user._id});
		}
	});
}