const { unAuthorizedError } = require("../errors");

const checkPermissions = (requestUser, paramUserID) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userID === paramUserID.toString()) return;
  throw new unAuthorizedError("Unauthorized to perform this operation");
};

module.exports = checkPermissions;
