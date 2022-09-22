const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const usersController = require("../controllers/users.controller");

//all user routes require authentication
router.use(auth);

// @route     GET api/user
// @desc      Get logged in user
// @access    Private
router.get("/", usersController.getLoggedInUser);

// @route     POST api/user
// @desc      Update logged in user
// @access    Private
router.put("/", usersController.updateLoggedInUser);

module.exports = router;
