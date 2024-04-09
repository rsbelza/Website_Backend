const express = require("express");
const productController = require("../controllers/product");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: "../Images" });
const {verify, verifyAdmin} = require("../auth");



// Add Product
router.post('/', verify, verifyAdmin, productController.addProduct)

// Retrieve All Products
router.get('/all', verify, verifyAdmin, productController.getAllProducts)

// Retrieve All Active Products
router.get('/', productController.getAllActiveProducts)

// Retrieve Single Product
router.get('/:productId', productController.getSingleProduct)

// Update Product Info
router.patch('/:productId/update', verify, upload.single('image'), productController.updateProduct)

// Archive Product
router.patch('/:productId/archive', verify, productController.archiveProduct)

// Activate Product
router.patch('/:productId/activate', verify, productController.activateProduct)

// Search Product by Name
router.post('/searchByName', productController.searchProductByName)

// Search Product by Price
router.post('/searchByPrice', productController.searchProductByPrice)

module.exports = router;