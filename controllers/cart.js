const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../auth");

// Get Cart
module.exports.getCart = (req, res) => {
    const userId = req.user.id;

    Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ error: 'Cart does not exist' });
            }
            return res.status(200).send({ cart });
        })
        .catch(err => {
            console.error("Error in fetching cart", err);
            return res.status(500).send({ error: 'Failed to fetch cart' });
        });
};

// Add to Cart
module.exports.addToCart = async (req, res) => {
    const userId = req.user.id; // Assuming the user's ID is stored in req.user.id
    const { productId } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, cartItems: [], totalPrice: 0 }); // Initialize totalPrice
        }

        // Fetch product details based on productId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Extract product price from product details
        const productPrice = product.price;

        // You can set a default quantity or fetch it from somewhere else if needed
        const defaultQuantity = 1; // Default quantity

        // Calculate subtotal based on product price and default quantity
        const subtotal = productPrice * defaultQuantity;

        // Add or update item in the cart
        const existingItemIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (existingItemIndex !== -1) {
            // If item already exists in cart, update its quantity and subtotal
            cart.cartItems[existingItemIndex].quantity += defaultQuantity;
            cart.cartItems[existingItemIndex].subtotal += subtotal;
        } else {
            // If item doesn't exist in cart, add it
            cart.cartItems.push({ productId, quantity: defaultQuantity, subtotal });
        }

        // Update total price
        cart.totalPrice += subtotal;

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Product Quantity
module.exports.updateProductQuantity = async (req, res) => {
    const userId = req.user.id; // Assuming the user's ID is stored in req.user.id
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        // Fetch product details based on productId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Extract product price from product details
        const productPrice = product.price;

        // Calculate subtotal based on product price and provided quantity
        const subtotal = productPrice * quantity;

        // Find the item in the cart
        const existingItemIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (existingItemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in the cart' });
        }

        // Update quantity and subtotal of the item
        cart.cartItems[existingItemIndex].quantity = quantity;
        cart.cartItems[existingItemIndex].subtotal = subtotal;

        // Recalculate total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Cart item quantity updated successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove Item from Cart
module.exports.removeItemFromCart = async (req, res) => {
    const userId = req.user.id; // Assuming the user's ID is stored in req.user.id
    const productIdToDelete = req.params.productId;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        // Find the index of the product to delete in the cartItems array
        const indexToDelete = cart.cartItems.findIndex(item => item.productId === productIdToDelete);

        if (indexToDelete === -1) {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }

        // Remove the product from the cartItems array
        const deletedProduct = cart.cartItems.splice(indexToDelete, 1)[0];

        // Update total price
        cart.totalPrice -= deletedProduct.subtotal;

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Product deleted from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear Cart
module.exports.clearCart = async (req, res) => {
    const userId = req.user.id; // Assuming the user's ID is stored in req.user.id

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        // Clear all items from the cart
        cart.cartItems = [];
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};