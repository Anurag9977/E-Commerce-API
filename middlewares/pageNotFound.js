const { StatusCodes } = require("http-status-codes");

const pageNotFound = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .send("<h1>Requested page does not exist.</h1>");
};

module.exports = pageNotFound;
