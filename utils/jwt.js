const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

//Send token as a cookie response
const attachCookiesToResponse = ({ res, payload }) => {
  const token = createJWT({ payload });
  res.cookie("accessToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1800000),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

const JWTVerify = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createJWT,
  attachCookiesToResponse,
  JWTVerify,
};
