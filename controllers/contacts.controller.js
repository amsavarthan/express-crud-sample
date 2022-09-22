const Contact = require("../models/Contact");
const { validationResult } = require("express-validator");

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contacts = await Contact.findById(req.params.id);
    if (contacts) {
      return res.json(contacts);
    }
    return res.json({ err: { msg: "No contact found" } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};

exports.addContact = async (req, res) => {
  //check errors from validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ err: result.array() });
  }

  //save to database and send response to client
  const { name, email, phone, type } = req.body;
  try {
    const findContact = await Contact.findOne({ phone, user: req.user.id });
    if (findContact) {
      return res.status(400).json({
        err: { msg: `Contact ${phone} already exists with name ${name}` },
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user.id,
    });
    const contact = await newContact.save();
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};

exports.updateContact = async (req, res) => {
  try {
    //parse the request and build new contact
    const { name, email, phone, type } = req.body;
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    //update in database and send response to client
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: { msg: "server error" } });
  }
};
