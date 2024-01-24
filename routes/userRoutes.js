const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");
const {
  authorizePermission,
  checkPermissions,
} = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();

router.route("/").get(authorizePermission("admin"), getAllUsers);
router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);
router.route("/:userID").get(getSingleUser);

module.exports = router;
