var app = require('../app'),
		log4js = require('log4js');
var logger = log4js.getLogger();
var server = require('http').createServer(app);

app.set('port', process.env.PORT || 3000);
app.start = app.listen = function () {
	logger.info("starting rest api service on port.. " + app.get('port'));
	return server.listen.apply(server, arguments);
}

app.start(app.get('port'));