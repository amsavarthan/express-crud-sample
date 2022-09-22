const express = require("express");
const { check } = require("express-validator");

const auth = require("../middleware/auth");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// @route     POST api/auth/login
// @desc      Login user & return a token
// @access    Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

// @route     POST api/auth/register
// @desc      Register user & return a token
// @access    Public

router.post(
  "/register",
  [
    check("name", "Please add a username").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  authController.register
);

module.exports = router;
