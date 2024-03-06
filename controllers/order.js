const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const auth = require("../auth");

// Checkout/ Create order
module.exports.checkout = async (req, res) => {
    try {
        // Step 1: Validate user identity via JWT
        const userId = req.user.id; // Assuming the user's ID is stored in req.user.id
        
        // Step 2: API validates user identity via JWT, returns a message and error details if validation fails
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized access. Please provide a valid JWT token.' });
        }

        // Step 3: Find the cart of the user using the user's id from the passed token
        const cart = await Cart.findOne({ userId });

        // Step 4: If no cart document with the current user's id can be found, send a message to the client
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        // Step 5: Check if the cart's cartItems array contains an item
        if (cart.cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Add items to cart before checkout.' });
        }

        // Step 6: Create a new Order document
        const order = new Order({
            userId,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice
        });

        // Step 7: Save the cart document
        await order.save();

        // Clear the cart after successful checkout
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        // Step 6a: Send a message to the client along with the order details
        res.status(200).json({ message: 'Order placed successfully', order });
    } catch (error) {
        // Step 7b: Catch an error while finding/saving and send a message to the client along with the error details
        console.error('Error in checkout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Retrieve/Get user order
module.exports.getUserOrder = async (req, res) => {
    try {
        // Step 1: Validate user identity via JWT
        const userId = req.user.id; // Assuming the user's ID is stored in req.user.id
        
        // Step 2: API validates user identity via JWT, returns a message and error details if validation fails
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized access. Please provide a valid JWT token.' });
        }

        // Step 3: Find the orders of the user using the user's id from the passed token
        const orders = await Order.find({ userId });

        // Step 4: If no order documents with the current user's id can be found, send a message to the client
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the user' });
        }

        // Step 5: Send the found orders to the client
        res.status(200).json({ orders });
    } catch (error) {
        // Step 6: Catch the error and send a message and the error details to the client
        console.error('Error in retrieving orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get all Orders
module.exports.getAllOrders = async (req, res) => {
    try {
        // Retrieve all orders
        const orders = await Order.find();

        // Send the found orders to the client
        res.status(200).json({ orders });
    } catch (error) {
        // Catch the error and send a message and the error details in the client
        console.error('Error in retrieving all orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};