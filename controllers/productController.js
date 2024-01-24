const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const { notFoundError, badRequestError } = require("../errors");
const path = require("path");

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort("-createdAt");
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { productID } = req.params;
  const product = await Product.findOne({
    _id: productID,
  }).populate("reviews");
  if (!product)
    throw new notFoundError(`No product found with id : ${productID}`);
  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  req.body.user = req.userDetails.userID;
  const product = await Product.create({
    ...req.body,
  });
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const { productID } = req.params;
  const product = await Product.findOneAndUpdate(
    {
      _id: productID,
    },
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product)
    throw new notFoundError(`No product found with id : ${productID}`);
  res.status(StatusCodes.OK).json({ product });
};

const uploadImage = async (req, res) => {
  if (!req.files) throw new badRequestError("No file uploaded");
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image"))
    throw new badRequestError("Please only upload an image file");
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize)
    throw new badRequestError("Image file should be < 1MB");
  const imagePath = path.join(
    __dirname,
    "../public/uploads/",
    `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({
    message: `Image : ${productImage.name} Uploaded Successfully`,
  });
};

const deleteProduct = async (req, res) => {
  const { productID } = req.params;
  const product = await Product.findOne({
    _id: productID,
  });
  if (!product)
    throw new notFoundError(`No product found with id : ${productID}`);
  await product.deleteOne();
  res.status(StatusCodes.OK).json({
    message: "Product deleted successfully",
  });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  uploadImage,
  deleteProduct,
};
