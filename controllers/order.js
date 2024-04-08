const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const auth = require("../auth");

module.exports.checkout = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized access. Please provide a valid JWT token.' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        if (cart.cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty. Add items to cart before checkout.' });
        }

        const order = new Order({
            userId,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice
        });

        await order.save();

        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error in checkout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.getUserOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized access. Please provide a valid JWT token.' });
        }

        const orders = await Order.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the user' });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error in retrieving orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error in retrieving all orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
