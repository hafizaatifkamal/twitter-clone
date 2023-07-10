const constant = require("../../utilities/constant")
const customResponse = require("../../utilities/helper")
const tweetModel = require("./model")

const postTweet = async (req, res) => {
  let code, message
  try {
    const tweet = new tweetModel(req.body)
    tweet.save();
    code = constant.HTTP_201_CODE
    message = constant.TWEET_POSTED_SUCCESS
    const resData = customResponse({ code, message, data: tweet })
    return res.status(code).send(resData)
  } catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message, err: error }))
  }
}

const updateTweet = async (req, res) => {
  let code, message
  try {
    const tweet = await tweetModel.findById(req.params.id)
    if (tweet.userId === (req.decodedUser._id).toString()) {
      await tweet.updateOne({ $set: req.body }, { new: true })
      code = constant.HTTP_200_CODE
      message = constant.TWEET_UPDATED_SUCCESS
      return res.status(code).send(customResponse({ code, message, data: tweet }))
    } else {
      code = constant.HTTP_401_CODE
      message = constant.FORBIDDEN_ACTIONS_MSG
      return res.status(code).send(customResponse({ code, message }))
    }
  } catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message, err: error }))
  }
}

const deleteTweet = async (req, res) => {
  let code, message
  try {
    const tweet = await tweetModel.findById(req.params.id)
    if (tweet.userId === (req.decodedUser._id).toString()) {
      await tweet.deleteOne()
      code = constant.HTTP_200_CODE
      message = constant.TWEET_DELETE_SUCCESS
      return res.status(code).send(customResponse({ code, message }))
    } else {
      code = constant.HTTP_401_CODE
      message = constant.FORBIDDEN_ACTIONS_MSG
      return res.status(code).send(customResponse({ code, message }))
    }
  } catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message, err: error }))
  }
}

const likeDislikeTweet = async (req, res) => {
  let code, message
  try {
    const tweet = await tweetModel.findById(req.params.id)
    if (!tweet.likes.includes(req.body.id)) {
      await tweet.updateOne({ $push: { likes: req.body.id } })
      code = constant.HTTP_200_CODE
      message = constant.TWEET_LIKED_MSG
      return res.status(code).send(customResponse({ code, message }))
    }
    else {
      await tweet.updateOne({ $pull: { likes: req.body.id } })
      code = constant.HTTP_200_CODE
      message = constant.TWEET_DILIKED_MSG
      return res.status(code).send(customResponse({ code, message }))
    }
  } catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message, err: error }))
  }
}

const getAllTweets = async (req, res) => {
  let code, message
  try {
    const userTweets = await tweetModel.find({ userId: req.decodedUser._id })
    const followersTweets = await req.decodedUser.following
      .map((followerId) => {
        return tweetModel.find({ userId: followerId })
      })
    code = constant.HTTP_200_CODE
    message = "All Tweets"
    const resData = customResponse({
      code,
      message,
      data: userTweets.concat(...followersTweets)
    })
    return res.status(code).send(resData)
  } catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message }))
  }
}

const getUserSpecificTweets = async (req, res) => {
  let code, message
  try {
    const userTweets = await tweetModel.find({ userId: req.params.id })
      .sort({ createAt: -1 })
    code = constant.HTTP_200_CODE
    message = "Specific tweets fetched"
    return res.status(code).send(customResponse({ code, message }))
  } catch (error) {
    code = constant.HTTP_400_CODE
    message = error.message
    return res.status(code).send(customResponse({ code, message }))
  }
}

module.exports = {
  postTweet,
  updateTweet,
  deleteTweet,
  likeDislikeTweet,
  getUserSpecificTweets,
  getAllTweets
}