const { StatusCodes } = require("http-status-codes");
const Review = require("../models/review");
const Product = require("../models/product");
const { badRequestError, notFoundError } = require("../errors");
const checkPermissions = require("../utils/checkPermissions");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).sort("-createdAt").populate({
    path: "product",
    select: "name price company",
  });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { reviewID } = req.params;
  const review = await Review.findOne({
    _id: reviewID,
  });
  if (!review) throw new notFoundError(`No review found with id : ${reviewID}`);
  res.status(StatusCodes.OK).json({ review });
};

const createReview = async (req, res) => {
  const { product: productID } = req.body;
  req.body.user = req.userDetails.userID;
  //Check for valid product
  const isValidProduct = await Product.findOne({ _id: productID });
  if (!isValidProduct)
    throw new notFoundError(`Product with id : ${productID} not found`);
  //Check if already a review is submitted
  const isAlreadySubmitted = await Review.findOne({
    product: productID,
    user: req.userDetails.userID,
  });
  if (isAlreadySubmitted)
    throw new badRequestError("Review has already been submitted");
  //Create new review
  const review = await Review.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ review });
};

const updateReview = async (req, res) => {
  const {
    body: { rating, title, comment },
    params: { reviewID },
  } = req;
  const review = await Review.findOne({ _id: reviewID });
  if (!review)
    throw new notFoundError(`Review with id : ${reviewID} not found`);
  checkPermissions(req.userDetails, review.user);
  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;
  review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { reviewID } = req.params;
  const review = await Review.findOne({
    _id: reviewID,
  });
  if (!review)
    throw new notFoundError(`Review with id : ${reviewID} not found`);
  checkPermissions(req.userDetails, review.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ message: "Review removed successfully" });
};

const getSingleProductReview = async (req, res) => {
  const { productID } = req.params;
  const reviews = await Review.find({ product: productID }).sort("-createdAt");
  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
