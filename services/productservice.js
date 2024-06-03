const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");
const factory = require("./handelerFacteory");
const Product = require("../model/productmodel");
const Kafka = require("../config/kafka");
const cloudinary=require("../util/Cloudinary")

exports.uploadProductImages = uploadMixOfImages([
  { name: "imagecover", maxCount: 1 },
  { name: "image", maxCount: 5 },
]);

// Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        transformation: [
          { width: 2000, height: 1333, crop: "limit" },
          { format: 'jpeg', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(buffer);
  });
};

// Image processing and uploading to Cloudinary
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imagecover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    
    // Upload image cover to Cloudinary
    try {
      const imageCoverUrl = await uploadToCloudinary(req.files.imagecover[0].buffer, 'products', imageCoverFilename);
      req.body.imagecover = imageCoverUrl;
    } catch (error) {
      return next(error);
    }
  }

  if (req.files.image) {
    req.body.image = [];
    try {
      await Promise.all(
        req.files.image.map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
          
          // Upload image to Cloudinary
          const imageUrl = await uploadToCloudinary(img.buffer, 'products', imageName);
          req.body.image.push(imageUrl);
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  next();
});

// Nested route
// GET /api/v1/shops/:shopId/products
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.shopId) filterObject = { shop: req.params.shopId };
  req.filterObj = filterObject;
  next();
};
exports.setshopIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.shop) req.body.shop = req.params.shopId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "reviews");
////Bigdata
exports.getproducttoBigData = asyncHandler(async (req, res) => {
  const products = await Product.find(); // Retrieve all products
  const productsData = [];

  // Iterate over each product
  for (const product of products) {
    const {_id, name, quantity, sold, price } = product;

    // Check if the name is not null
    if (name !== null && name !== undefined) {
      const productData = { _id,name, quantity, sold, price };
      // Send product data to Kafka
      Kafka.sendOrderData(productData);

      // Add product data to productsData array
      productsData.push(productData);
    }
  }

  res.status(200).json(productsData);
});

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product);
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);

exports.getproductbycategory = asyncHandler(async (req, res) => {
  const categoryid = req.params.categoryid;
  const products = await Product.find({ category: categoryid });

  // Check if products is an object
  if (typeof products === "object" && products !== null) {
    // Get the number of properties in the object
    const numberOfProducts = Object.keys(products).length;
    if (numberOfProducts === 0) {
      res.status(404).json({ message: "No products found" });
    } else {
      // Handle the case where products is an object with properties
      res.status(200).json(products);
    }
  }
});
