// const contacts = require("../models/contacts");
const { HttpError } = require("../helpers/index.js");
// const Joi = require("joi");
const { Contacts } = require("../models/contact");

async function listContacts(req, res, next) {
  const { limit } = req.query;
  const contact = await Contacts.find({}).limit(limit);
  res.json(contact);
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);

  if (!contact) {
    return next(HttpError(404, "Movie not found"));
  }
  return res.json(contact);
}

async function addContact(req, res, next) {
  const newContact = await Contacts.create(req.body);
  res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contacts.findById(contactId);
  if (!contact) {
    next(HttpError(404, "No movie"));
  }
  await Contacts.findByIdAndRemove(contactId);
  res.status(200).json(contact);
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const updateContact = await Contacts.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.status(201).json(updateContact);
}

async function updateContactFavorite(req, res, next) {
  const { contactId } = req.params;

  const { favorite } = req.body;

  if (!(favorite === false || favorite === true)) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const updateContact = await Contacts.updateStatusContact(
    contactId,
    { favorite },
    { new: true }
  );
  res.status(200).json(updateContact);
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactFavorite,
};
