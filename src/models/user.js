var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function BaseUserSchema() {
	var self = new Schema();
	Schema.apply(self, arguments);
	self.add({
		username: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		token: {
			type: String
		},
		dateOfBirth: {
			year: {
				type: Number
			},
			month: {
				type: Number
			},
			day: {
				type: Number
			},
			required: false
		},
		address: {
			type: String,
			required: false
		},
		city: {
			type: String,
			required: false
		},
		country: {
			type: String,
			required: false
		},
		pincode: {
			type: Number,
			required: false
		},
		createAt: {
			type: Date,
			default: Date.now
		},
		updatedAt: {
			type: Date,
			default: Date.now
		}		
	});
	return self;
}

var userSchema = new BaseUserSchema();
var User = mongoose.model('User', userSchema);

module.exports = User;