const express = require("express");
const productController = require("../controllers/product");
const router = express.Router();
const {verify, verifyAdmin} = require("../auth");

// Add Product
router.post('/', verify, verifyAdmin, productController.addProduct)

// Retrieve All Products
router.get('/all', verify, verifyAdmin, productController.getAllProducts)

// Retrieve All Active Products
router.get('/', verify, verifyAdmin, productController.getAllActiveProducts)

// Retrieve Single Product
router.get('/:productId', verify, productController.getSingleProduct)

// Update Product Info
router.patch('/:productId/update', verify, productController.updateProduct)

// Archive Product
router.patch('/:productId/archive', verify, productController.archiveProduct)

// Activate Product
router.patch('/:productId/activate', verify, productController.activateProduct)

module.exports = router;