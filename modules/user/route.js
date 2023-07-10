const express = require("express")
const router = express.Router()
const isAuthenticated = require("../../middleware/authenticate");
const { getUser, updateUser, follow, unFollow } = require("./controller");

router.get("/:id", isAuthenticated, getUser)
router.put("/update", isAuthenticated, updateUser)
router.put("/follow/:id", isAuthenticated, follow)
router.put("/unfollow/:id", isAuthenticated, unFollow)

module.exports = router;