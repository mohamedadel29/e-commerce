const mongoose =require('mongoose')
const Product=require('./productmodel')
const reviewSchema=new mongoose.Schema({
    title:{
      type: String,
    },
    rating:{
        type:Number,
        min:[1,"Min rating is 1"],
        max:[5,"Max rating is 5"],
        required:[true,"review rquired"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"review must belong to user"]
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:[true,'Review must have a Product']
    },
},{timestamps:true})

reviewSchema.pre(/^find/,function(next){
    this.populate({path:'user',select:'name'})
    next()
})

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
    productId
  ) {
    const result = await this.aggregate([
      // Stage 1 : get all reviews in specific product
      {
        $match: { product: productId },
      },
      // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
      {
        $group: {
          _id: 'product',
          avgRatings: { $avg: '$rating' },
          ratingsQuantity: { $sum: 1 },
        },
      },
    ]);
  
    // console.log(result);
    if (result.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        ratingsAverage: result[0].avgRatings,
        ratingsQuantity: result[0].ratingsQuantity,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      });
    }
  };
    reviewSchema.post('save', async function () {
        await this.constructor.calcAverageRatingsAndQuantity(this.product);
      });
      reviewSchema.post('deleteOne', async function () {
        await this.constructor.calcAverageRatingsAndQuantity(this.product);
      });
module.exports=mongoose.model("review",reviewSchema)