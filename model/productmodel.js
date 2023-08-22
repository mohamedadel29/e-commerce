const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a name for the Product"],
      unique: true, //to ensure that there are no duplicate products in our database
      maxlength: [2000, "Name should be less than 50 characters"],
      minlength: [3, "Name must have at least three character"],
      trim: true, //remove any leading or trailing white spaces from input string before validation
    },
    slug: {
      type: String,
      lowercase: true, //convert all letters to lower case while saving into db and also when retrieving data
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [20, "Description can not exceed less then 20 charct"],
    },
    quantity: {
      type: Number,
      required: [true, "is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is Required."],
      trim: true,
      max: [20000, "too long"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    color: [String],
    imagecover: {
      type: String,
      //required: [true, "image is requierd"],
    },
    image: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categoey",
      required: true,
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategories",
        required: false,
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min:[1,"rating must be above or equal 1"],
      max:[5,"rating must br less or equal 5"]    
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
   }
);
//make us populate childs in relation with parent
productSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'product',
  localField: '_id',
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name -_id',
  });
  next();
});

const setImageURL = (doc) => {
  if (doc.imagecover) {
    const imageUrl = `http://localhost:${process.env.PORT}/products/${doc.imagecover}`;
    doc.imagecover = imageUrl;
  }
  if (doc.image) {
    const imagesList = [];
    doc.image.forEach((image) => {
      const imageUrl = `http://localhost:${process.env.PORT}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.image = imagesList;
  }
};
// findOne, findAll and update
productSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
productSchema.post('save', (doc) => {
  setImageURL(doc);
});


module.exports=mongoose.model("product",productSchema)