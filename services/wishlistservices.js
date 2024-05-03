const usermodel = require("../model/usermodel");
const productmodel = require("../model/productmodel");
exports.addproductTowishlist = async (req, res, next) => {
  try {
    // Check if the productId is provided in the request body
    if (!req.body.productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Retrieve the product by ID
    let product = await productmodel.findById(req.body.productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the wishlist
    if (product.wishlistflag === true) {
      return res
        .status(401)
        .json({ message: "This Product is already in your WishList" });
    }

    // Add the product to the user's wishlist and update the product's flag
    let user = await usermodel.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.body.productId } },
      { new: true }
    );

    // Update the wishlist flag in the product
    product.wishlistflag = true;
    await product.save();

    // Return success response
    res.status(200).json({
      status: "success",
      message: "Product added successfully to your wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.removeProductFromWishlist = async (req, res, next) => {
  const product = await productmodel.findById(req.params.productId);
  let user;
  if (product.wishlistflag == true) {
     user = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );
    // Remove the wishlist flag from the product
    product.wishlistflag = false;
    await product.save();
  } else {
    return res.status(404).json({ message: "No such product found" });
  }
  res.status(200).json({
    status: "success",
    message: "product removed successfully from your wishlist",
    data: user.wishlist,
  });
};

exports.getLoggedUserWishlist = async (req, res, next) => {
  const user = await usermodel.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
};
