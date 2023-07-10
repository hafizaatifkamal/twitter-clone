const userModel = require("./model")
const customResponse = require("../../utilities/helper")
const constant = require("../../utilities/constant")

const getUser = async (req, res) => {
  let code, message
  try {
    const user = await userModel.findById(req.params.id)
    code = constant.HTTP_200_CODE
    message = "User fetched"
    const resData = customResponse({ code, message, data: user })
    return res.status(code).send(resData)
  }
  catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message }))
  }
}

const updateUser = async (req, res) => {
  let code, message
  try {
    const user = await userModel.findByIdAndUpdate(
      req.decodedUser._id,
      { $set: req.body },
      { new: true }
    )
    code = constant.HTTP_200_CODE
    message = constant.USER_UPDATED_SUCCESS_MSG
    const resData = customResponse({ code, message, data: user })
    return res.status(code).send(resData)
  } catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message }))
  }
}

const follow = async (req, res) => {
  let code, message
  try {
    // the user you want to follow 
    const user = await userModel.findById(req.params.id)
    // current user
    const currentUser = await userModel.findById(req.body.id)

    // check if you already followed the user
    if (!user.followers.includes(req.body.id)) {
      await user.updateOne({
        $push: { followers: req.body.id }
      })
      await currentUser.updateOne({
        $push: { following: req.params.id }
      })
    } else {
      code = constant.HTTP_409_CODE
      message = constant.USER_ALREADY_FOLLOWED_MSG
      return res.status(code).send(customResponse({ code, message }))
    }
    code = constant.HTTP_200_CODE
    message = constant.USER_FOLLOWED_SUCCESS_MSG
    const resData = customResponse({ code, message, data: user })
    return res.status(code).send(resData)
  } catch (error) {
    code = constant.HTTP_422_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message }))
  }
}

const unFollow = async (req, res) => {
  // the user you want to unfollow 
  const user = await userModel.findById(req.params.id)
  // current user
  const currentUser = await userModel.findById(req.body.id)

  // check if you already unfollowed the user
  if (currentUser.following.includes(req.params.id)) {
    await user.updateOne({
      $pull: { followers: req.body.id }
    })
    await currentUser.updateOne({
      $pull: { following: req.params.id }
    })
  }
  else {
    code = constant.HTTP_409_CODE
    message = constant.USER_NOT_FOLLOWED_MSG
    return res.status(code).send(customResponse({ code, message }))
  }
  code = constant.HTTP_200_CODE
  message = constant.USER_UNFOLLOWED_SUCCESS_MSG
  const resData = customResponse({ code, message, data: user })
  return res.status(code).send(resData)
}

module.exports = {
  getUser,
  updateUser,
  follow,
  unFollow
}