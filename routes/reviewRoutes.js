const express = require("express");
const {
  getAllReviews,
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const {
  authMiddleware,
  authorizePermission,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(getAllReviews).post(authMiddleware, createReview);
router
  .route("/:reviewID")
  .get(getSingleReview)
  .patch(authMiddleware, updateReview)
  .delete(authMiddleware, deleteReview);

module.exports = router;
