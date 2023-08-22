const { default: slugify } = require("slugify");
const subcategorymodel = require("../model/subcategorymodel")
const ApiError=require("../util/ApiErrors")
const slugfiy=require("slugify");
const ApiFeature=require("../util/ApiFeature")

const setCategoryIdToBody = (req, res, next) => {
    // Nested route (Create)
    if (!req.body.category) req.body.category = req.params.Id;
    next();
  };

const createsubcategory=async(req,res)=>{
    try {
        const {name,category}=req.body;
        const newSubCategory =await subcategorymodel.create({name,slug:slugify(name),category}) 
        res.status(201).json({message:"done",data:newSubCategory})      
    } catch (error) {
        res.status(400).json({message:"error",error})
    }
}
///nest route
const createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.Id) filterObject = { category: req.params.Id };
    req.filterObj = filterObject;
    next();
  };

const getAllsubcategory= async(req,res)=>{
    try {
        const documentcount=await subcategorymodel.countDocuments()
        const apifeature=new ApiFeature(subcategorymodel.find(),req.query).paginate(documentcount)
        const{mongooseQuery,paginationResult}=apifeature
        const allSubCategory=await mongooseQuery
        res.status(201).json({message:"done",paginationResult,data:allSubCategory})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }

}
const getsubcategory= async (req,res,next)=>{
    try {
        const {id}=req.params
        const spefic=await subcategorymodel.findById({_id:id}).populate({path:"category",select:"name -_id"})
        if(!spefic){
          return next(new ApiError(`no gategory found with this ${id}`,404))
        }else{
            res.status(201).json({message:"done",data:spefic})

        }      
    } catch (error) {
        res.status(400).json({message:"error",error})
        
    }
}

const updatesubcategory=async(req,res)=>{
    try {
        const {id}=req.params
        const {name}=req.body
        const slug =slugfiy(name)
        const Ocategory=await subcategorymodel.findById({_id:id})
        if(!Ocategory){
            res.status(404).json({message:"not found"})
        }else{
            const newsubcategory=await subcategorymodel.findOneAndUpdate({_id:id},{name,slug:slug},{slug},{new:true})
            res.status(201).json({message:"updated",data:newsubcategory})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}

const deletesubcategory=async(req,res)=>{
    try {
        const {id}=req.params
        const OSubcategory=await subcategorymodel.findById({_id:id})
        if(!Ocategory){
            res.status(404).json({message:"not found"})
        }else{
            const deletedsubcategory=await subcategorymodel.deleteOne({_id:id})
            res.status(201).json({message:"deleted"})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}
module.exports={createsubcategory,getsubcategory,getAllsubcategory,deletesubcategory,updatesubcategory,setCategoryIdToBody,createFilterObj}