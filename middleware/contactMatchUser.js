const Contact = require("../models/Contact");

const contactMatchUser = async (req, res, next) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact)
      return res.status(404).json({ err: { msg: "contact doesn't exist" } });
    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(403).json({ err: { msg: "Not authorized" } });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};

module.exports = contactMatchUser;
