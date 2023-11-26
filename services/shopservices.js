const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware');
const factory = require('./handelerFacteory');
const Shop = require('../model/shopmodel');

exports.uploadProductImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

// @desc    Get list of Shops
// @route   GET /api/v1/Shops
// @access  Public
exports.getShops = factory.getAll(Shop, 'Shop');

// @desc    Get specific Shop by id
// @route   GET /api/v1/Shop/:id
// @access  Public
exports.getShop= factory.getOne(Shop, 'products');

// @desc    Create Shop
// @route   POST  /api/v1/Shop
// @access  Private
exports.createShop = factory.createOne(Shop);
// @desc    Update specific Shop
// @route   PUT /api/v1/Shop/:id
// @access  Private
exports.updateShop = factory.updateOne(Shop);

// @desc    Delete specific Shop
// @route   DELETE /api/v1/Shop/:id
// @access  Private
exports.deleteShop = factory.deleteOne(Shop);