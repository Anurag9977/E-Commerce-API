const badRequestError = require("./badRequest");
const unAuthenticatedError = require("./unAuthenticated");
const notFoundError = require("./notFound");
const unAuthorizedError = require("./unAuthorized");

module.exports = {
  badRequestError,
  unAuthenticatedError,
  notFoundError,
  unAuthorizedError,
};
