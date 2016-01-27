function define(name, value) {
	Object.defineProperty(exports, name, {
		value: value,
		enumerable: true
	});
}


// secret for token generation
define('TOKEN_SECRET', 'Online@$t0re');