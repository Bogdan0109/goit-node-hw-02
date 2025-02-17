// const { Contacts } = require("../models/contact");
const { Users } = require("../models/users");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { BadRequest } = require("http-errors");
const { sendMail } = require("../helpers");

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
  const { _id: id } = req.user;

  try {
    await Users.findByIdAndUpdate(id, { token: "" });
    return res.status(204).json({ message: "Logout was successfull" });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
}

async function uploadImage(req, res, next) {
  const { filename } = req.file;

  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);
  // console.log(
  //   "🚀 ~ file: user.controller.js:72 ~ uploadImage ~ publicPath",
  //   publicPath
  // );

  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    fs.unlink(tmpPath);
    throw error;
  }

  Jimp.read(publicPath, (error, image) => {
    if (error) {
      return next(error);
    }
    image.resize(250, 250).write(publicPath);
  });

  const userId = req.params.id;

  const user = await Users.findByIdAndUpdate(
    userId,
    {
      avatarURL: `/public/avatars/${filename}`,
    },
    { new: true }
  );

  return res.status(200).json({ avatarURL: user.avatarURL });
}

async function verifyEmail(req, res, next) {
  const { verificationToken: token } = req.params;

  const user = await Users.findOne({
    verificationToken: token,
  });

  if (!user) {
    throw BadRequest("Verify token is not valid!");
  }

  await Users.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.json({
    message: "Success",
  });
}

const resendEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "missing required field email" });
    }

    if (user.verify) {
      res.status(400).json({
        message: "Verification has already been passed",
      });
    }

    await sendMail({
      to: email,
      subject: "Please, verify your email",
      html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Email verification</a>`,
    });

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContacts,
  getContacts,
  me,
  logout,
  uploadImage,
  verifyEmail,
  resendEmail,
};
