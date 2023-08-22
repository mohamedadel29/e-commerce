const categoeyroute = require("./categoryroutes");
const subcategoryroute = require("./subcategoryroutes");
const brandroute = require("./brandroutes");
const productroute=require("./productroute")
const userroute=require("./userroutes")
const authroute=require('./authroutes.js')
const reviewroute=require('./reviewrouthes')
const wishlistroute=require('./wishlistroute')
const addressroute=require('./addressroutes')
const couponroute=require('./couponroute')
const cartroute=require('./cartroute')
const orderroute=require('./orderroutes')
const exportroute=require('./exportroute')

 
const mountRoutes=(app)=>{
//amount routes
app.use("/api/v1/categories", categoeyroute);
app.use("/api/v1/subcategories", subcategoryroute);
app.use("/api/v1/brands", brandroute);
app.use("/api/v1/products", productroute);
app.use("/api/v1/users", userroute);
app.use("/api/v1/auths", authroute);
app.use("/api/v1/reviews", reviewroute);
app.use("/api/v1/wishlist", wishlistroute);
app.use("/api/v1/address", addressroute);
app.use("/api/v1/coupons", couponroute);
app.use("/api/v1/cart", cartroute);
app.use("/api/v1/orders", orderroute);
app.use("/api/v1/exports", exportroute);

}

module.exports= mountRoutes;