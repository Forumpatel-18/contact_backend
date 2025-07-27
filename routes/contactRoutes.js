const express = require("express");
const {
  getContact,
  getContacts,
  updateContact,
  deleteContact,
  createContact,
} = require("../controllers/contactController");
const router = express.Router();

//get contacts route
router.route("/").get(getContacts).post(createContact);

//get individual contact route
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
