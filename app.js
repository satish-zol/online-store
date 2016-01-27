var log4js = require('log4js');
var logger = log4js.getLogger();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var auth = require('./src/utils/auth.js');
var users = require('./src/routes/users');
var products = require('./src/routes/products');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('/api/v1/*', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/products', products);

mongoose.set('debug', 'debug');
var connect = function() {
	var options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	};
	if(process.env == 'production') {
		mongodb:heroku_x44kszk0:heroku_x44kszk0@ds051645.mongolab.com:51645/heroku_x44kszk0
	}else {
		mongoose.connect("mongodb://localhost/online-store", options);
	}
}

connect();

mongoose.connection.on('connected', function() {
	console.log('connected to database');
});

mongoose.connection.on('error', function(err) {
	console.log('Error on connecting mongodb: ' + err);
});

mongoose.connection.on('disconnected', function(err) {
	console.log('Error: mongodb disconnected, attempting reconnect... ');
	connect();
});

module.exports = app;


