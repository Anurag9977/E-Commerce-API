const { StatusCodes } = require("http-status-codes");
const { badRequestError, unAuthenticatedError } = require("../errors");
const User = require("../models/user");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new badRequestError("Please provide name, email and password");
  }
  const emailAlreadyInUse = await User.findOne({ email });
  if (emailAlreadyInUse) {
    throw new badRequestError("Email already in use");
  }
  //Select role for the new user
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  //Create user
  const user = await User.create({ name, email, password, role });
  //JWT Payload
  const payload = createTokenUser({ user });
  //Token as cookie response
  attachCookiesToResponse({ res, payload });
  res.status(StatusCodes.CREATED).json({ user: payload });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new badRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new unAuthenticatedError("Email does not exist. Please register");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new unAuthenticatedError("Incorrect password entered!");
  }
  const payload = createTokenUser({ user });
  attachCookiesToResponse({ res, payload });
  res.status(StatusCodes.OK).json({ user: payload });
};

const logout = async (req, res) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).send("Logged out successfully!");
};

module.exports = {
  register,
  login,
  logout,
};
