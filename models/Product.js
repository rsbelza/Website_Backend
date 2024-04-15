const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is Required'] },
    description: { type: String, required: [true, 'Description is Required'] },
    price: { type: Number, required: [true, 'Price is Required'] },
    category: { type: String, required: [true, 'Category is Required'] },
    image: { type: String, required: [true, 'Image is Required'] }, // Base64 encoded image
    isActive: { type: Boolean, default: true },
    createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);