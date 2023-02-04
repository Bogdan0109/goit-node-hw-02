const { Users } = require("../models/users");
const { HttpError } = require("../helpers");
const gravatar = require("gravatar");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

async function signup(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUsers = await Users.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      data: {
        users: {
          email,
          id: savedUsers._id,
        },
      },
    });
  } catch (error) {
    return res.status(409).json({ message: "missing field favorite" });
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const url = gravatar.url(email);

  const { JWT_SECRET } = process.env;

  const storedUsers = await Users.findOne({
    email,
  });

  if (!storedUsers) {
    throw new HttpError(401, "email is not valid");
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
