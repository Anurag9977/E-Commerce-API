const express = require("express");
const {
  getAllOrders,
  createOrder,
  getCurrentUserOrders,
  updateOrder,
  getSingleOrder,
} = require("../controllers/orderController");
const { authorizePermission } = require("../middlewares/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(authorizePermission("admin"), getAllOrders)
  .post(createOrder);
router.route("/showAllMyOrders").get(getCurrentUserOrders);
router.route("/:orderID").get(getSingleOrder).patch(updateOrder);

module.exports = router;
