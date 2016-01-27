var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function BaseProductSchema() {
	var self = new Schema();
	Schema.apply(self, arguments);

	self.add({
		name: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: false
		},
		price: {
			type: Number,
			required: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		createdAt: {
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

var productSchema = new BaseProductSchema();
var Product = mongoose.model('Product', productSchema);

module.exports = Product;