const express = require("express");
const productController = require("../controllers/product");
const router = express.Router();
const multer = require('multer');
const {verify, verifyAdmin} = require("../auth");
const imageUpload = multer({ dest: 'uploads/' })


// Add Product
router.post('/', verify, verifyAdmin,  imageUpload.single('uploadImage'), productController.addProduct)

// Retrieve All Products
router.get('/all', verify, verifyAdmin, productController.getAllProducts)

// Retrieve All Active Products
router.get('/', productController.getAllActiveProducts)

// Retrieve Single Product
router.get('/:productId', productController.getSingleProduct)

// Update Product Info
router.post('/:productId/update', verify, imageUpload.single('uploadImage'), productController.updateProduct );

// Archive Product
router.patch('/:productId/archive', verify, productController.archiveProduct)

// Activate Product
router.patch('/:productId/activate', verify, productController.activateProduct)

// Search Product by Name
router.post('/searchByName', productController.searchProductByName)

// Search Product by Price
router.post('/searchByPrice', productController.searchProductByPrice)

module.exports = router;