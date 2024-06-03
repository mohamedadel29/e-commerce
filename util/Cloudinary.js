const Cloudinary=require("cloudinary").v2
const dotenv = require("dotenv");
const { fileURLToPath } =require("url")
const path=require("path")
          
//const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, '../config.env')});

Cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECERT ,
  secure:true
});

module.exports=Cloudinary