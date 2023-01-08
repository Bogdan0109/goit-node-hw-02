const contacts = require("../models/contacts");
const { HttpError } = require("../helpers/index.js");
// const Joi = require("joi");

async function listContacts(req, res, next) {
  const { limit } = req.query;
  const contact = await contacts.listContacts({ limit });
  res.json(contact);
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);

  if (!contact) {
    return next(HttpError(404, "Movie not found"));
  }
  return res.json(contact);
}

async function addContact(req, res, next) {
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    next(HttpError(404, "No movie"));
  }
  await contacts.removeContact(contactId);
  res.status(200).json(contact);
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const updateContact = await contacts.updateContact(contactId, req.body);
  res.status(201).json(updateContact);
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
