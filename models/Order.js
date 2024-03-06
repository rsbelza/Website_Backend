const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({

	userId: {type:String,required:true},
	productsOrdered:[{
		productId: {type:String,required: true},
		quantity: {type:Number,required: true},
		subtotal: {type:Number,required: true}
	}],
	totalPrice: {type: Number,required: true},
	orderedOn:{type: Date, default:Date.now},
	status:{type: String,default:'Pending'}
})

module.exports = mongoose.model('Order', orderSchema);