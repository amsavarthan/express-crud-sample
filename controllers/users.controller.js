const User = require("../models/User");

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.updateLoggedInUser = async (req, res) => {
  try {
    const { name } = req.body;
    const newData = {};
    if (name) newData.name = name;

    await User.findByIdAndUpdate(req.user.id, {
      $set: newData,
    });

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
