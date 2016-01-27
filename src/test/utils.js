'use strict';
process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
    async = require('async');

beforeEach(function (done) {
    function clearDB() {
        var items = []
        for(var i in mongoose.connection.collections) {
            items.push(mongoose.connection.collections[i]);
        }
        async.each(items, function(item, next) {
            item.remove(next);
        }, done)
    }
    if(mongoose.connection.readyState === 0 ){
        mongoose.connect('mongodb://localhost/online-store-test', function(err){
            if(err) {
                throw err
            };
            return clearDB();
        });
    } else {
        return clearDB();
    }
});

afterEach(function(done){
    mongoose.disconnect();
    return done();
});
