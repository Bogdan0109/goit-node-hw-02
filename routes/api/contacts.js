const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index.js");

const { validateBody } = require("../../middlewares/index");
const { addMovieSchema } = require("../../schemas/contacts");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../controllers/contacts.controller");

const router = express.Router();

router.get("/", tryCatchWrapper(listContacts));

router.get("/:contactId", tryCatchWrapper(getContactById));

router.post("/", tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContact));

router.put("/:contactId", tryCatchWrapper(updateContact));

module.exports = router;
