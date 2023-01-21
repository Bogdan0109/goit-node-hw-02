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
  console.log("🚀 ~ file: user.controller.js:19 ~ getContacts ~ user", user);
  const userWithContacts = await Users.findById(user._id).populate("contacts", {
    title: 1,
    year: 1,
    _id: 1,
  });

  return res.status(200).json({
    data: {
      contacts: userWithContacts.contacts,
    },
  });
}

async function me(req, res, next) {
  const { user } = req;
  console.log("🚀 ~ file: user.controller.js:34 ~ me ~ user", user);
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
