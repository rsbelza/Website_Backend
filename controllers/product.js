const Product = require("../models/Product");
const auth = require("../auth");

// Add product
module.exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            image: req.body.image // Save the base64-encoded image data
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Products
module.exports.getAllProducts = (req, res) => {
   return Product.find({})
  .then(Products => {
    // Updated to use proper conditional checks (result.length > 0) to handle cases where there are no courses.
    if(Products.length > 0) {
      // Provided a more structured response format using an object with a key allCourses containing the courses.
      return res.status(200).send({ Products })
    } else {
      return res.status(200).send({ message: ' No Products found. '})
    }
  })
  .catch(err => {
    console.error("Error in finding all courses: ", err)
    return res.status(500).send({ error: 'Error finding courses.' })
  });
};

// Get All Active Products
module.exports.getAllActiveProducts = (req, res) => {
   return Product.find({})
  .then(Products => {
    if(Products.length > 0) {
      return res.status(200).send({ Products })
    } else {
      return res.status(200).send({ message: ' No Products found. '})
    }
  })
  .catch(err => {
    console.error("Error in finding all Products: ", err)
    return res.status(500).send({ error: 'Error finding Products.' })
  });
};

// Get single product /:productId
module.exports.getSingleProduct = (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product => {
      if (!product) {
        return res.status(404).send({ error: 'Product not found' });
      }
        return res.status(200).send({ product });
    })
    .catch(err => {
      console.error("Error in fetching product", err)
      return res.status(500).send({ error: 'Failed to fetch product' })
    });  
};

// Update Product info /:productId
module.exports.updateProduct = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const productId = req.params.productId;

    // Retrieve the updated profile information from the request body
    const { name, description, price } = req.body;

    // Update the user's profile in the database
    const updatedProduct = await Product.findByIdAndUpdate(productId,{ name, description, price },{ new: true }
    );
    return res.status(200).send({ 
      message: 'Product updated successfully', 
      updatedProduct: updatedProduct 
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update Product' });
  }
}

// Archive Product
module.exports.archiveProduct = (req, res) => {
    let updateActiveField = {
        isActive: false
    }
    return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(archiveProduct => {
        if (!archiveProduct) {
          return res.status(404).send({ error: 'Product not found' });
        }
        return res.status(200).send({ 
          message: 'Product archived successfully', 
          archiveProduct: archiveProduct 
        });
    })
    .catch(err => {
      console.error("Error in archiving a product: ", err)
      return res.status(500).send({ error: 'Failed to archive product' })
    });
};

// Activate Product
module.exports.activateProduct = (req, res) => {
    let updateActiveField = {
        isActive: true
    }
    return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(archiveProduct => {
        if (!archiveProduct) {
          return res.status(404).send({ error: 'Product not found' });
        }
        return res.status(200).send({ 
          message: 'Product activated successfully', 
          archiveProduct: archiveProduct 
        });
    })
    .catch(err => {
      console.error("Error in activating a product: ", err)
      return res.status(500).send({ error: 'Failed to activate product' })
    });

};

// Search Product By Name
module.exports.searchProductByName = async (req, res) => {
    try {
        const { name } = req.body;

        const pipeline = [
            {
                $match: {
                    name: { $regex: name, $options: 'i' } // Case-insensitive search for product name
                }
            }
        ];

        // Execute the aggregation pipeline
        const products = await Product.aggregate(pipeline);

        // Return the filtered products as a response
        res.status(200).json({ products });
    } catch (error) {
        // Handle errors
        console.error('Error searching for products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Search Product By Price
module.exports.searchProductByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    const pipeline = [
      {
        $match: {
          price: { $gte: minPrice, $lte: maxPrice } // Filter products within the given price range
        }
      }
    ];

    // Execute the aggregation pipeline
    const products = await Product .aggregate(pipeline);

    // Return the filtered products as a response
    res.status(200).json({ products });
  } catch (error) {
    // Handle errors
    console.error('Error searching for products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};