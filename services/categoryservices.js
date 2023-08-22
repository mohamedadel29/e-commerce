const { default: slugify } = require("slugify");
const categorymodel = require("../model/categorymodel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../util/ApiErrors");
const slugfiy = require("slugify");
const ApiFeature = require("../util/ApiFeature");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");

const uploadCategoryImage = uploadSingleImage("image");
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
if(req.file){
  await sharp(req.file.buffer)
  .resize(600, 600)
  .toFormat("jpeg")
  .jpeg({ quality: 95 })
  .toFile(`uploads/categories/${filename}`);

//save
req.body.image = filename;
}

  next();
});

const getALLcategory = async (req, res) => {
  try {
    const documentcount = await categorymodel.countDocuments();
    const apifeature = new ApiFeature(categorymodel.find(), req.query).paginate(
      documentcount
    );
    const { mongooseQuery, paginationResult } = apifeature;
    const allCategory = await mongooseQuery;
    res
      .status(201)
      .json({ message: "done", paginationResult, data: allCategory });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};
const getcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const spefic = await categorymodel.findById({ _id: id });
    if (!spefic) {
      return next(new ApiError(`no gategory found with this ${id}`, 404));
    } else {
      res.status(201).json({ message: "done", data: spefic });
    }
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};
const createcategory = async (req, res) => {
  try {
    const newCategory = await categorymodel.create(req.body);
    res.status(201).json({ message: "done", data: newCategory });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};

const updatecategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const slug = slugfiy(name);
    const Ocategory = await categorymodel.findById({ _id: id });
    if (!Ocategory) {
      res.status(404).json({ message: "not found" });
    } else {
      const newcategory = await categorymodel.findOneAndUpdate(
        { _id: id },
        { name, category, slug: slug },
        { slug },
        { new: true }
      );
      res.status(201).json({ message: "updated", data: newcategory });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error", error });
  }
};

const deletecategory = async (req, res) => {
  try {
    const { id } = req.params;
    const Ocategory = await categorymodel.findById({ _id: id });
    if (!Ocategory) {
      res.status(404).json({ message: "not found" });
    } else {
      const deletedcategory = await categorymodel.deleteOne({ _id: id });
      res.status(201).json({ message: "deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error", error });
  }
};
module.exports = {
  createcategory,
  getALLcategory,
  getcategory,
  updatecategory,
  deletecategory,
  resizeImage,
  uploadCategoryImage,
};
