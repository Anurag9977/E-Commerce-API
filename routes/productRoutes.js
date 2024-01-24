const express = require("express");
const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const {
  authMiddleware,
  authorizePermission,
} = require("../middlewares/authMiddleware");

const { getSingleProductReview } = require("../controllers/reviewController");

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(authMiddleware, authorizePermission("admin"), createProduct);

router
  .route("/uploadImage")
  .post(authMiddleware, authorizePermission("admin"), uploadImage);

router
  .route("/:productID")
  .get(getSingleProduct)
  .patch(authMiddleware, authorizePermission("admin"), updateProduct)
  .delete(authMiddleware, authorizePermission("admin"), deleteProduct);

router.route("/:productID/reviews").get(getSingleProductReview);

module.exports = router;
