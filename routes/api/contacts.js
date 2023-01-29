const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index.js");

const { validateBody, upload } = require("../../middlewares/index");
const { addContactsSchema } = require("../../schemas/contacts");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactFavorite,
  uploadImage,
} = require("../../controllers/contacts.controller");

const contactsRouter = express.Router();

contactsRouter.get("/", tryCatchWrapper(listContacts));

contactsRouter.get("/:contactId", tryCatchWrapper(getContactById));

contactsRouter.post(
  "/",
  validateBody(addContactsSchema),
  tryCatchWrapper(addContact)
);

contactsRouter.delete("/:contactId", removeContact);

contactsRouter.put(
  "/:contactId",
  validateBody(addContactsSchema),
  tryCatchWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  tryCatchWrapper(updateContactFavorite)
);

contactsRouter.patch(
  "/:id/photos",
  upload.single("photos"),
  tryCatchWrapper(uploadImage)
);

module.exports = { contactsRouter };
