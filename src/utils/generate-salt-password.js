var crypto = require('crypto');

var saltAndHash = function(pass, callback) {
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var generateSalt = function() {
	var set = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p] ;
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

module.exports.md5 = md5;
module.exports.saltAndHash = saltAndHash;