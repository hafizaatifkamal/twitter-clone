const jwt = require("jsonwebtoken");
const userModel = require("../modules/user/model");
const constant = require("../utilities/constant");
const customResponse = require("../utilities/helper");

const isAuthenticated = async (req, res, next) => {
  let code, message;
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.decodedUser = await userModel.findOne({ _id: decoded.id, token: token });
      if (req.decodedUser !== null) {
        next();
      } else {
        code = constant.HTTP_400_CODE
        message = constant.TOKEN_INVALID_MSG
        const resData = customResponse({ code, message, err: "Either token is invalid or user not found" })
        res.status(code).json(resData)
      }
    }
    else {
      code = constant.HTTP_401_CODE;
      message = constant.AUTHENTICATION_ERR_MSG;
      const resData = customResponse({ code, message: "Unauthorized!", err: message })
      res.status(code).json(resData);
    }
  } catch (error) {
    code = constant.HTTP_401_CODE;
    message = constant.AUTHENTICATION_ERR_MSG;
    const resData = customResponse({ code, message: "Unauthorized!", err: message })
    res.status(code).json(resData);
  }
};

module.exports = isAuthenticated;