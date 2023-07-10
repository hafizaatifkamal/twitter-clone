const userModel = require("./model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constant = require("../../utilities/constant");
const customResponse = require("../../utilities/helper");

const signUp = async (req, res) => {
  let code, message
  try {
    // if user already exists
    const { email } = req.body
    const user = await userModel.findOne({ email });
    if (user) {
      code = constant.HTTP_409_CODE;
      message = constant.USER_ALREADY_EXISTS_MSG;
      const resData = customResponse({ code, message, err: message });
      return res.status(code).send(resData);
    }
    const newUser = new userModel({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 8)
    });
    newUser.save();
    const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN })
    newUser.token = token
    code = constant.HTTP_201_CODE;
    message = constant.USER_REGISTER_SUCCESS_MSG;
    const resData = customResponse({ code, message, data: newUser });
    return res.status(code).send(resData);
  } catch (error) {
    console.log(error);
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({ code, message, err: message });
    return res.status(code).send(resData);
  }
};

const signIn = async (req, res) => {
  let code, message;
  try {
    // Validate if user exist in the database
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      code = constant.HTTP_400_CODE;
      message = constant.USER_NOT_FOUND_MSG;
      const resData = customResponse({
        code,
        message,
        err: message,
      });
      return res.status(code).send(resData);
    }
    // Validate password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      code = constant.HTTP_403_CODE;
      message = constant.PASSWORD_NOT_MATCH_MSG;
      const resData = customResponse({
        code,
        message,
        err: message,
      });
      return res.status(code).send(resData);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN })
    user.token = token
    user.save()
    code = constant.HTTP_200_CODE;
    message = constant.LOGIN_SUCCESS;
    const resData = customResponse({ code, message, data: user });
    return res.status(code).send(resData);
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = constant.SOMETHING_WRONG_MSG;
    const resData = customResponse({ code, message, err: message });
    return res.status(code).send(resData);
  }
}

const signOut = async (req, res) => {
  let code, message;
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const user = await userModel.findOne({ token: token });
    if (user) {
      await userModel.findOneAndUpdate({ _id: req.decodedUser._id },
        { $set: { token: "" } },
        { new: true })
        .then(() => {
          code = constant.HTTP_200_CODE;
          message = constant.USER_LOGOUT_MSG;
          const resData = customResponse({ code, message });
          return res.status(code).send(resData);
        })
    }
    else {
      code = constant.HTTP_400_CODE;
      message = constant.USER_NOT_FOUND_MSG;
      const resData = customResponse({ code, message, err: constant.BAD_REQ_MSG });
      return res.status(code).send(resData);
    }
  } catch (error) {
    code = constant.HTTP_400_CODE;
    message = error.message;
    const resData = customResponse({ code, message, err: error.message });
    return res.status(code).send(resData);
  }
}

module.exports = { signUp, signIn, signOut };