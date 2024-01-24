const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const {
  notFoundError,
  badRequestError,
  unAuthorizedError,
} = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const checkPermissions = require("../utils/checkPermissions");

const getAllUsers = async (req, res) => {
  const users = await User.find({
    role: "user",
  }).select("-password");
  //if (!users.length) throw new notFoundError("No users found!");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { userID } = req.params;
  const user = await User.findOne({ _id: userID }).select("-password");
  checkPermissions(req.userDetails, user._id);
  if (!user) throw new notFoundError(`Not found any user with id : ${userID}`);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.userDetails });
};

const updateUser = async (req, res) => {
  const { userID } = req.userDetails;
  const { name, email } = req.body;
  if (!name || !email)
    throw new badRequestError("Please provide name and email updates");
  const user = await User.findOneAndUpdate(
    {
      _id: userID,
    },
    {
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const payload = createTokenUser({ user });
  attachCookiesToResponse({ res, payload });
  res.status(StatusCodes.OK).json({
    message: "Successfully updated user details!",
  });
};

const updateUserPassword = async (req, res) => {
  const { userID } = req.userDetails;
  const { oldPassword, newPassword } = req.body;
  //Check password not empty
  if (!oldPassword || !newPassword)
    throw new badRequestError("Please provide the old and new password");
  //Find the user
  const user = await User.findOne({ _id: userID });
  //Check the password
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new unAuthorizedError("Incorrect password provided");
  //Check if old and new password are same
  if (oldPassword === newPassword)
    throw new badRequestError("New password cannot be same as old password");
  //Update the password
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Successfully update password!" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
