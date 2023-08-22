const couponmodel=require('../model/couponmodel')
const ApiError=require("../util/ApiErrors")
const asyncHandler=require("express-async-handler")
const ApiFeature=require("../util/ApiFeature")


const getALLCoupon= async(req,res)=>{
    try {
        const documentcount=await couponmodel.countDocuments()
        const apifeature=new ApiFeature(couponmodel.find(),req.query).paginate(documentcount)
        const{mongooseQuery,paginationResult}=apifeature
        const allcoupon=await mongooseQuery
        res.status(201).json({message:"done",paginationResult,data:allcoupon})
    } catch (error) {
        res.status(400).json({message:"error",error})
    }

}
const getcoupon= async (req,res,next)=>{
    try {
        const {id}=req.params
        const spefic=await couponmodel.findById({_id:id})
        if(!spefic){
          return next(new ApiError(`no brand found with this ${id}`,404))
        }else{
            res.status(201).json({message:"done",data:spefic})

        }      
    } catch (error) {
        res.status(400).json({message:"error",error})
        
    }
}
const createcoupon=async(req,res)=>{
    try {
        const newcoupon =await couponmodel.create(req.body) 
        res.status(201).json({message:"done",data:newcoupon})      
    } catch (error) {
        res.status(400).json({message:"error",error})
    }
}

const updatecoupon=async(req,res)=>{
    try {
        const {id}=req.params
        const Ocoupon=await couponmodel.findById({_id:id})
        if(!Ocoupon){
            res.status(404).json({message:"not found"})
        }else{
            const newcoupon=await couponmodel.findOneAndUpdate({_id:id},req.body,{new:true})
            res.status(201).json({message:"updated",data:newcoupon})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}

const deletecoupon=async(req,res)=>{
    try {
        const {id}=req.params
        const Ocoupon=await couponmodel.findById({_id:id})
        if(!Ocoupon){
            res.status(404).json({message:"not found"})
        }else{
            const deletedcoupon=await couponmodel.deleteOne({_id:id})
            res.status(201).json({message:"deleted"})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}

module.exports={deletecoupon,updatecoupon,createcoupon,getALLCoupon,getcoupon}