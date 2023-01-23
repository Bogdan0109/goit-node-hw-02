// const contacts = require("../models/contacts");
const { HttpError } = require("../helpers/index.js");
// const Joi = require("joi");
const { Contacts } = require("../models/contact");

async function listContacts(req, res, next) {
  const { limit = 5, page = 1 } = req.query;
  const skip = (page - 1) * limit;

  const contact = await Contacts.find({}).skip(skip).limit(limit);
  res.json(contact);
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
   
    const contact = await Contacts.findById(contactId);
    return res.json(contact);
  } catch (error) {
    console.error(error);
    next(HttpError(404, "Movie not found"));
  }
}

async function addContact(req, res, next) {
  const newContact = await Contacts.create(req.body);
  res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await Contacts.findByIdAndRemove(contactId);
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    next(HttpError(404, "No movie"));
  }
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const updateContact = await Contacts.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.status(201).json(updateContact);
}

async function updateContactFavorite(req, res, next) {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const updateContact = await Contacts.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    res.status(200).json(updateContact);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "missing field favorite" });
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactFavorite,
};
