const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");
const factory = require("./handelerFacteory");
const Product = require("../model/productmodel");
const Kafka = require("../config/kafka");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imagecover", maxCount: 1 },
  { name: "image", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imagecover) {
    const imagecoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imagecover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imagecoverfilename}`);
    //save
    console.log(imagecoverfilename);
    req.body.imagecover = imagecoverfilename;
  }
  if (req.files.image) {
    req.body.image = [];
    await Promise.all(
      req.files.image.map(async (img, index) => {
        const imagename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagename}`);
        console.log(imagename);
        //save
        req.body.image.push(imagename);
      })
    );
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
  const { id } = req.params;
  const product = await Product.findById(id);
  const {  quantity, sold, price } = product;
  const real = { id, quantity, sold, price };
  console.log(real);
  Kafka.sendOrderData(real);
  res.status(200).json({
    id: id,
    quantity,
    sold,
    price,
  });
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
