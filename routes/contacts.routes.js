const express = require("express");
const { check } = require("express-validator");

const auth = require("../middleware/auth");
const contactMatchUser = require("../middleware/contactMatchUser");
const contactsController = require("../controllers/contacts.controller");

const router = express.Router();

//all contacts routes require authentication
router.use(auth);

// @route     GET api/contacts
// @desc      Read all users contacts
// @access    Private
router.get("/", contactsController.getAllContacts);

// @route     POST api/contacts
// @desc      Create new contact
// @access    Private
router.post(
  "/",
  [check("name", "Name is required").not().isEmpty()],
  contactsController.addContact
);

// @route     GET api/contacts/:id
// @desc      Get contact details
// @access    Private
router.get("/:id", contactMatchUser, contactsController.getContact);

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put("/:id", contactMatchUser, contactsController.updateContact);

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete("/:id", contactMatchUser, contactsController.deleteContact);

module.exports = router;
