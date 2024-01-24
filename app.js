//Dotenv
require("dotenv").config();

//Express Async Errors
require("express-async-errors");

//Express
const express = require("express");
const app = express();

//Additional packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
//Security packages
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const { rateLimit } = require("express-rate-limit");

//Files
//Database connection
const connectToDB = require("./db/connect");
//Page not found
const pageNotFound = require("./middlewares/pageNotFound");
//Error Handler
const errorHandler = require("./middlewares/errorHandler");
//Auth Middleware
const { authMiddleware } = require("./middlewares/authMiddleware");

//Routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

//Express Middlewares

//Security Middlewares - Rate Limit, Helmet, Cors, Xss-Clean, Mongo-Sanitize
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
  })
);
app.use(helmet());
app.use(cors());
app.use(xssClean());
app.use(mongoSanitize());

//Morgan
//app.use(morgan("tiny"));
//JSON
app.use(express.json());
//Cookie-parser
app.use(cookieParser(process.env.JWT_SECRET));
//File Upload
app.use(fileUpload());
//Statics
app.use(express.static("./public"));

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authMiddleware, userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", authMiddleware, orderRouter);

// app.get("/", (req, res) => {
//   res.send("Hello from e-commerce api");
// });
app.use(pageNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    //Connect to database
    await connectToDB(process.env.MONGO_URL);
    console.log("Database connection successful...");
    //Server listening...
    app.listen(PORT, console.log(`Server listening at PORT : ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
