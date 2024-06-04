const { default: slugify } = require("slugify");
const brandmodel = require("../model/brandmodel")
const asyncHandler=require("express-async-handler")
const ApiError=require("../util/ApiErrors")
const slugfiy=require("slugify");
const ApiFeature=require("../util/ApiFeature")
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const cloudinary=require("../util/Cloudinary")

// Upload single image
const uploadCategoryImage = uploadSingleImage("image");

// Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        transformation: [
          { width: 600, height: 600, crop: "limit" },
          { format: 'jpeg', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(buffer);
  });
};

// Image processing and uploading to Cloudinary
const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file uploaded.'));
  }

  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  try {
    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'brands', filename);
    // Save the image URL in the request body
    req.body.image = imageUrl;
    next();
  } catch (error) {
    next(error);
  }
});

const getALLbrand= async(req,res)=>{
    try {
        const documentcount=await brandmodel.countDocuments()
        const apifeature=new ApiFeature(brandmodel.find(),req.query).paginate(documentcount)
        const{mongooseQuery,paginationResult}=apifeature
        const allbrand=await mongooseQuery
        res.status(201).json({message:"done",paginationResult,data:allbrand})
    } catch (error) {
        res.status(400).json({message:"error",error})
    }

}
const getbrand= async (req,res,next)=>{
    try {
        const {id}=req.params
        const spefic=await brandmodel.findById({_id:id})
        if(!spefic){
          return next(new ApiError(`no brand found with this ${id}`,404))
        }else{
            res.status(201).json({message:"done",data:spefic})

        }      
    } catch (error) {
        res.status(400).json({message:"error",error})
        
    }
}
const createbrand=async(req,res)=>{
    try {
        const {name,image}=req.body;
        const newbrand =await brandmodel.create({name,image,slug:slugify(name)}) 
        res.status(201).json({message:"done",data:newbrand})      
    } catch (error) {
        res.status(400).json({message:"error",error})
    }
}

const updatebrand=async(req,res)=>{
    try {
        const {id}=req.params
        const {name,brand}=req.body
        const slug =slugfiy(name)
        const Obrand=await brandmodel.findById({_id:id})
        if(!Obrand){
            res.status(404).json({message:"not found"})
        }else{
            const newbrand=await brandmodel.findOneAndUpdate({_id:id},{name,brand,slug:slug},{slug},{new:true})
            res.status(201).json({message:"updated",data:newbrand})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}

const deletebrand=async(req,res)=>{
    try {
        const {id}=req.params
        const Obrand=await brandmodel.findById({_id:id})
        if(!Obrand){
            res.status(404).json({message:"not found"})
        }else{
            const deletedbrand=await brandmodel.deleteOne({_id:id})
            res.status(201).json({message:"deleted"})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}
module.exports={createbrand,getALLbrand,getbrand,updatebrand,deletebrand,uploadCategoryImage,resizeImage}