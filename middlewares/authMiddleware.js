const { isJWT } = require("validator");
const { unAuthenticatedError, unAuthorizedError } = require("../errors");
const { JWTVerify } = require("../utils");

const authMiddleware = async (req, res, next) => {
  const token = req.signedCookies.accessToken;
  if (!token || !isJWT(token)) {
    throw new unAuthenticatedError("Unauthorized");
  }
  try {
    const payload = JWTVerify({ token });
    req.userDetails = payload;
    next();
  } catch (error) {
    throw new unAuthenticatedError("Unauthenticated user");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userDetails.role)) {
      throw new unAuthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

// const checkPermissions = (...roles) => {
//   return (req, res, next) => {
//     const {
//       params: { userID: paramsUserID },
//       userDetails: { userID, role },
//     } = req;
//     if (!roles.includes(role) && paramsUserID !== userID) {
//       throw new unAuthenticatedError("Unauthorized to access this route");
//     }
//     next();
//   };
// };

module.exports = { authMiddleware, authorizePermission };
