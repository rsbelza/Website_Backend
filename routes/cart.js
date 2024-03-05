const express = require("express");
const cartController = require("../controllers/cart");
const router = express.Router();
const {verify} = require("../auth");

// Get Cart Function
router.get('/get-cart', verify, cartController.getCart)

// Add to Cart Function
router.post('/add-to-cart', verify, cartController.addToCart)

// Change Product Quantity
router.patch('/update-cart-quantity', verify, cartController.updateProductQuantity)

// Remove Item from Cart
router.patch('/:productId/remove-from-cart', verify, cartController.removeItemFromCart)

// Clear Cart
router.put('/clear-cart', verify , cartController.clearCart)





module.exports = router;