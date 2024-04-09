const Product = require("../models/Product");
const auth = require("../auth");


module.exports.addProduct = (req, res) => {
  const newProduct = new Product({
    name : req.body.name,
    description : req.body.description,
    category : req.body.category,
    price : req.body.price,
    original_price: req.body.orig_price
  });

    newProduct.save()
    .then(savedProduct => {
      res.status(201).json(savedProduct);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
}

module.exports.getAllProducts = (req, res) => {
   return Product.find({})
  .then(Products => {
    if(Products.length > 0) {
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

module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, description, price } = req.body;
    let image;
    if (req.file && req.file.buffer) {
      image = req.file.buffer;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, { name, description, price, image }, { new: true });

    return res.status(200).send({
      message: 'Product updated successfully',
      updatedProduct: updatedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update Product' });
  }
};

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

module.exports.searchProductByName = async (req, res) => {
    try {
        const { name } = req.body;

        const pipeline = [
            {
                $match: {
                    name: { $regex: name, $options: 'i' }
                }
            }
        ];

        const products = await Product.aggregate(pipeline);

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.searchProductByPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    const pipeline = [
      {
        $match: {
          price: { $gte: minPrice, $lte: maxPrice }
        }
      }
    ];

    const products = await Product.aggregate(pipeline);

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error searching for products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
