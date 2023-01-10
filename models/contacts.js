const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid"); // v4 won't work in CommonJS

const contactsPath = path.resolve(__dirname, "./contacts.json");

async function readContacts() {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  return contacts;
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

const listContacts = async ({ limit = 0 }) => {
  console.log("contactsPath", contactsPath);
  const contacts = await readContacts();
  return contacts.slice(-limit);
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await writeContacts(updatedContacts);
};

const addContact = async (body) => {
  const id = nanoid();
  const contact = { id, ...body };

  const contacts = await readContacts();
  contacts.push(contact);

  await writeContacts(contacts);

  return contact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();

  const index = contacts.findIndex(
    (contact) => String(contact.id) === contactId
  );

  if (index === -1) {
    return console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:", contactId);
  }

  const contact = { id: contactId, ...body };

  console.log("🚀 ~ file: contacts.js:63 ~ updateContact ~ contact", contact);
  contacts.splice(index, 1, contact);

  await writeContacts(contacts);

  return contact || null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
