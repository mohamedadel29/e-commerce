const usermodel = require("../model/usermodel");

exports.addproductTowishlist = async (req, res, next) => {
  const user = await usermodel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res
    .status(200)
    .json({
      status: "success",
      message: "product added successfully to your wishlist",
      data: user.wishlist,
    });
};


exports.removeProductFromWishlist = async (req, res, next) => {
    const user = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.body.productId },
      },
      { new: true }
    );
  
    res
      .status(200)
      .json({
        status: "success",
        message: "product removed successfully from your wishlist",
        data: user.wishlist,
      });
  };

  exports.getLoggedUserWishlist = async (req, res, next) => {
    const user = await usermodel.findById(req.user._id).populate('wishlist');
  
    res.status(200).json({
      status: 'success',
      results: user.wishlist.length,
      data: user.wishlist,
    });
  };