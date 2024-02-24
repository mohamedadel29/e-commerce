const express = require("express");
//import KafkaConfig from "./util/config.js";
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const db = require("./config/database");
const ApiErrors = require("./util/ApiErrors");
const mountRoutes = require("./routes");
const cors = require("cors");
const compression = require("compression");
const GlobalError = require("./middleware/errorMiddleware");
const { webhookCheckout } = require("./services/orderservices");
dotenv.config({ path: "config.env" });
// db connection
db();
//express app
const app = express();
//enable ather domain to access your abblication
app.use(cors());
app.options("*", cors());
// compress all responses
app.use(compression());

//checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log("mode:" + process.env.NODE_ENV);
}

//mount routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiErrors(`cant find your route:${req.originalUrl}`, 400));
});

//global handle middleware
app.use(GlobalError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("app running on port " + PORT);
});
