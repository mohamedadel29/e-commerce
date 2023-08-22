const reviewmodel = require("../model/reviewmodel")
const asyncHandler=require("express-async-handler")
const ApiError=require("../util/ApiErrors")
const ApiFeature=require("../util/ApiFeature")

exports.setproductIdToBody = (req, res, next) => {
    // Nested route (Create)
    if (!req.body.product) req.body.product = req.params.Id;
    if (!req.body.user) req.body.user = req.user._id;

    next();
  };

exports. createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.Id) filterObject = { product: req.params.Id };
    req.filterObj = filterObject;
    next();
  };

exports. getALLreview= async(req,res)=>{
    try {
        const documentcount=await reviewmodel.countDocuments()
        const apifeature=new ApiFeature(reviewmodel.find(),req.query).paginate(documentcount)
        const{mongooseQuery,paginationResult}=apifeature
        const allreview=await mongooseQuery
        res.status(201).json({message:"done",paginationResult,data:allreview})
    } catch (error) {
        res.status(400).json({message:"error",error})
    }

}
exports. getreview= async (req,res,next)=>{
    try {
        const spefic=await reviewmodel.findById(req.params.id)
        if(!spefic){
          return next(new ApiError(`no brand found with this ${id}`,404))
        }else{
            res.status(201).json({message:"done",data:spefic})

        }      
    } catch (error) {
        res.status(400).json({message:"error",error})
        
    }
}
exports.createreview=async(req,res)=>{
    try {
        const newreview =await reviewmodel.create(req.body) 
        res.status(201).json({data:newreview})      
    } catch (error) {
        res.status(400).json({message:"error",error})
    }
}

exports.updatereview=async(req,res)=>{
    try {
        const Oreview=await reviewmodel.findById(req.params.id)
        if(!Oreview){
            res.status(404).json({message:"not found"})
        }else{
            const newreview=await reviewmodel.findByIdAndUpdate(req.params.id,req.body,{new:true})
            newreview.save()
            res.status(201).json({message:"updated",data:newreview})

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"error",error})
    }
}

exports.deletereview=async(req,res)=>{
    const { id } = req.params;
    const document = await reviewmodel.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    document.deleteOne();
    res.status(204).send();
}