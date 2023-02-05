const { Users } = require("../models/users");
const { HttpError, sendMail } = require("../helpers");
const gravatar = require("gravatar");
const { Conflict } = require("http-errors");
const { v4 } = require("uuid");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const { JWT_SECRET } = process.env;

async function signup(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const verificationToken = v4();

    const savedUsers = await Users.create({
      email,
      password: hashedPassword,
      verify: false,
      verificationToken,
    });

    await sendMail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
    });

    const url = gravatar.url(email);

    const token = jwt.sign({ id: savedUsers._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await Users.findByIdAndUpdate(savedUsers._id, { token, avatarURL: url });

    res.status(201).json({
      data: {
        users: {
          token,
          user: { email, password, avatarURL: url },
        },
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      // throw new HttpError(409, "User with this email already exists");
      throw Conflict("User with this email already exists!");
    }

    return res.status(409).json({ message: "missing field favorite" });
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const url = gravatar.url(email);

  const storedUsers = await Users.findOne({
    email,
  });

  if (!storedUsers) {
    throw new HttpError(401, "email is not valid");
  }

  if (!storedUsers.verify) {
    throw new HttpError(
      401,
      "email is not verified! Please check your mail box"
    );
  }

  const isPasswordValid = await bcrypt.compare(password, storedUsers.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "password is not valid");
  }

  const token = jwt.sign({ id: storedUsers._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  await Users.findByIdAndUpdate(storedUsers._id, { token, avatarURL: url });

  return res.json({
    data: {
      token,
      user: { email, password, avatarURL: url },
    },
  });
}

module.exports = {
  signup,
  login,
};
