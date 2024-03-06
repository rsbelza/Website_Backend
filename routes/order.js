const express = require("express");
const orderController = require("../controllers/order");
const router = express.Router();
const {verify, verifyAdmin} = require("../auth");

// Create Order/Checkout
router.post('/checkout', verify, orderController.checkout)

// Get/Retrieve User order
router.get('/my-orders', verify, orderController.getUserOrder)

// Get/Retrieve all orders
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders)

module.exports = router;