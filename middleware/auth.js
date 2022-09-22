const jwt = require("jsonwebtoken");
const config = require("config");

const jwtSecret = process.env.JWT_SECRET || config.get("jwtSecret");

module.exports = (req, res, next) => {
  try {
    const token = req.get("Authorization").replaceAll("Bearer ", "");
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ err: { name: err.name, msg: err.message } });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch {
    return res
      .status(401)
      .json({
        err: { name: "Auth required", msg: "Please login and try again" },
      });
  }
};
