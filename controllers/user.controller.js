// const { Contacts } = require("../models/contact");
const { Users } = require("../models/users");
const path = require("path");
const fs = require("fs/promises");

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
  const { email, _id: id, token, avatarURL } = user;

  return res.status(200).json({
    data: {
      token,
      user: {
        email,
        id,
        avatarURL,
      },
    },
  });
}

async function logout(req, res, next) {
  try {
    const { user } = req;
    const { _id: id } = user;

    await Users.findByIdAndUpdate(id, { token: "" });
    return res.status(204).json({
      message: "Logout was successfull",
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
}

async function uploadImage(req, res, next) {
  console.log("req.file", req.file);
  const { filename } = req.file;

  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);

  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    fs.unlink(tmpPath);
    throw error;
  }

  const contactId = req.params.id;
  const contact = await Users.findByIdAndUpdate(
    contactId,
    {
      avatarURL: `/public/avatars/${filename}`,
    },
    { new: true }
  );

  return res.status(200).json({ avatarURL: contact.avatarURL });
}

module.exports = {
  createContacts,
  getContacts,
  me,
  logout,
  uploadImage,
};
