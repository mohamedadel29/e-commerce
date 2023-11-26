const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: String,
    slug: {
      type: String,
      lowercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

shopSchema.virtual("products", {
  ref: "product",
  foreignField: "Shop",
  localField: "_id",
});



module.exports = mongoose.model("Shop", shopSchema);
