const multer = require("multer");
const ApiError = require("../util/ApiErrors");
const multerOptions=()=>{
    const multerStorge = multer.memoryStorage();

    const multerFilter = function (req, file, cb) {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(new ApiError("only image allowed", 400), false);
      }
    };
    const upload = multer({ storage: multerStorge, fileFilter: multerFilter });

    return  upload;

}
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);