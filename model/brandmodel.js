const mongoose = require('mongoose');
// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand required'],
      unique: [true, 'Brand must be unique'],
      minlength: [3, 'Too short Brand name'],
      maxlength: [32, 'Too long Brand name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);


const setImageURL = (doc) => {
  if (doc.image) {
    let imageUrl = `http://localhost:${process.env.PORT}/`;
    process.env.NODE_ENV == 'production' &&
			(imageUrl = process.env.STATIC_CONTENT_SERVER_HOST);
    doc.image = imageUrl + 'brands/' + doc.image;
  }
};

// findOne, findAll and update
brandSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
brandSchema.post('save', (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model('Brand', brandSchema);