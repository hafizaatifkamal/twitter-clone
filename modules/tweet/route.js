const express = require("express")
const router = express.Router()

const isAuthenticated = require("../../middleware/authenticate")
const { getAllTweets, postTweet, deleteTweet, likeDislikeTweet, getUserSpecificTweets, updateTweet } = require("./controller")

router.post("/", isAuthenticated, postTweet)
router.put("/:id", isAuthenticated, updateTweet)
router.delete("/:id", isAuthenticated, deleteTweet)
router.put("/:id/activities", likeDislikeTweet)
router.get("/all/:id", getUserSpecificTweets)
router.get("/timeline", isAuthenticated, getAllTweets)

module.exports = router
