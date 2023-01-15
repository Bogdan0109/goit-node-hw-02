const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index.js");

const { validateBody } = require("../../middlewares/index");
const { addContactsSchema } = require("../../schemas/contacts");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactFavorite,
} = require("../../controllers/contacts.controller");

const router = express.Router();

router.get("/", tryCatchWrapper(listContacts));

router.get("/:contactId", tryCatchWrapper(getContactById));

router.post("/", validateBody(addContactsSchema), tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContact));

router.put(
  "/:contactId",
  validateBody(addContactsSchema),
  tryCatchWrapper(updateContact)
);

router.patch(
  "/:contactId/favorite",
  // validateBody(addContactsSchema),
  tryCatchWrapper(updateContactFavorite)
);

module.exports = router;
