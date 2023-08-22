const { default: slugify } = require("slugify");
const productmodel = require("../model/productmodel")
const asyncHandler=require("express-async-handler")
const ApiError=require("../util/ApiErrors")
const ApiFeature=require("../util/ApiFeature")
const slugfiy=require("slugify");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const {uploadMixOfImages}=require("../middleware/uploadImageMiddleware")

const uploadProductImages=uploadMixOfImages([{name:"imagecover",maxCount:1},{name:"image",maxCount:5}])

const resizeProductImage=asyncHandler(async(req,res,next)=>{
    if(req.files.imagecover){
        const imagecoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imagecover[0].buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagecoverfilename}`);
      
        //save
        req.body.imagecover = imagecoverfilename;
      
    }
    if(req.files.image){
        req.body.image=[]
       await Promise.all(
            req.files.image.map(async(img,index)=>{
                const imagename = `product-${uuidv4()}-${Date.now()}-${index+1}.jpeg`;
               await sharp(img.buffer)
                 .resize(2000, 1333)
                 .toFormat("jpeg")
                 .jpeg({ quality: 95 })
                 .toFile(`uploads/products/${imagename}`);
             
               //save
               req.body.image.push(imagename);
        })
        );
        next();
    }
})

const getALLproduct= async(req,res)=>{
    try {
        const documentcount=await productmodel.countDocuments()
        const apifeature=new ApiFeature(productmodel.find(),req.query).paginate(documentcount)
        const{mongooseQuery,paginationResult}=apifeature
        const allproduct=await mongooseQuery
        res.status(201).json({message:"done",paginationResult,data:allproduct})
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"error",error})
    }

}
const getproduct= async (req,res,next)=>{
    try {
        const spefic= await productmodel.findById(req.params.id).populate({path:"reviews"})
        if(!spefic){
          return next(new ApiError(`no product found with this ${id}`,404))
        }else{
            res.status(201).json({message:"done",data:spefic})

        }      
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
        
    }
}
const createproduct=async(req,res)=>{
    try {
        req.body.slug=slugfiy(req.body.title)
        const newproduct =await productmodel.create(req.body) 
        res.status(201).json({message:"done",data:newproduct})      
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error:error})
    }
}

const updateproduct=async(req,res)=>{
    try {
        const {id}=req.params
        req.body.slug=slugfiy(title)
        const Oproduct=await productmodel.findById({_id:id})
        if(!Oproduct){
            res.status(404).json({message:"not found"})
        }else{
            const newproduct=await productmodel.findOneAndUpdate({_id:id},req.body,{new:true})
            res.status(201).json({message:"updated",data:newproduct})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}

const deleteproduct=async(req,res)=>{
    try {
        const {id}=req.params
        const Oproduct=await productmodel.findById({_id:id})
        if(!Oproduct){
            res.status(404).json({message:"not found"})
        }else{
            const deletedproduct=await productmodel.deleteOne({_id:id})
            res.status(201).json({message:"deleted"})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}

module.exports={getALLproduct,getproduct,createproduct,updateproduct,deleteproduct,uploadProductImages,resizeProductImage}