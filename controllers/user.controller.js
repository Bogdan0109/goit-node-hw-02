// const { Contacts } = require("../models/contact");
const { Users } = require("../models/users");

async function createContacts(req, res, next) {
  const { user } = req;
  const { id: contactId } = req.body;

  user.contacts.push({ _id: contactId });
  await Users.findByIdAndUpdate(user._id, user);

  return res.status(201).json({
    data: {
      contacts: user.contacts,
    },
  });
}

async function getContacts(req, res, next) {
  const { user } = req;
  const userWithContacts = await Users.findById(user._id).populate("contacts", {
    name: 1,
    email: 1,
    phone: 1,
    favorite: 1,
    _id: 1,
  });
  console.log("userWithContacts", userWithContacts);

  return res.status(200).json({
    data: {
      contacts: userWithContacts.contacts,
    },
  });
}

async function me(req, res, next) {
  const { user } = req;
  const { email, _id: id, token } = user;

  return res.status(200).json({
    data: {
      token,
      user: {
        email,
        id,
      },
    },
  });
}

module.exports = {
  createContacts,
  getContacts,
  me,
};
