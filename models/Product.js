const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    description: {
        type: String,
        required: [true, 'Description is Required']
    },
    price: {
        type: Number,
        required: [true, 'Price is Required']
    }    
    isAdmin: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Product', productSchema);