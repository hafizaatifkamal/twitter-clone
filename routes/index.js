const express = require("express");
const router = express.Router();

const userRoutes = require("../modules/user/route");
const tweetRoutes = require("../modules/tweet/route");
const { signUp, signIn, signOut } = require("../modules/user/auth");
const isAuthenticated = require("../middleware/authenticate");

router.use("/users", userRoutes);
router.use("/tweets", tweetRoutes);

// Auth routes
router.post("/signup", signUp)
router.post("/signin", signIn)
router.get("/signout", isAuthenticated, signOut)

module.exports = router;