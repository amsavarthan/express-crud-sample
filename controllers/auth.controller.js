const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const User = require("../models/User");

exports.register = async (req, res) => {
  //check errors of request input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ err: result.array() });
  }

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ err: { msg: "User already exists" } });

    //encrypt the user's password before save to database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    //send JWT back to user
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFE,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};

exports.login = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ err: result.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    //user does not exist
    if (!user)
      return res.status(400).json({ err: { msg: "user doesn't exist" } });

    //user and password do not match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ err: { msg: "email and password do not match" } });
    }

    //send JWT back to user
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFE,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};
