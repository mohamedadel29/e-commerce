const { default: mongoose } = require("mongoose")

const categoryschema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"category require"],
        unique:[true,"category must be unique"],
        minlength:[3,"too short category name"],
        maxlenght:[32,"too long category name"]
    },
    //A and B=>shoping.com/a-and-b
    slug:{
        type:String,
        lowercase:true
    },
    image:{
        type:String

    }
},{timestamps:true})


const setImageURL = (doc) => {
    if (doc.image) {
      const imageUrl = `http://localhost:${process.env.PORT}/categories/${doc.image}`;
      doc.image = imageUrl;
    }
  };

  // findOne, findAll and update
  categoryschema.post('init', (doc) => {
    setImageURL(doc);
  });
  
  // create
  categoryschema.post('save', (doc) => {
    setImageURL(doc);
  });

//create model
const categorymodel=mongoose.model("categoey",categoryschema,)

module.exports=categorymodel