const { Users } = require("../models/users");
const { HttpError } = require("../helpers");
const bcrypt = require("bcrypt");

async function register(req, res, next) {
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
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, "Users with this email already exists");
    }

    throw error;
  }
}

/**
 * 1. Find user by email
 * 2. If user not exists => throw an error 401
 * 3. If user exists => check password
 * 4. If password is the same => then return 200
 */
async function login(req, res, next) {
  const { email, password } = req.body;

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

  return res.json({
    data: {
      token: "<TOKEN>",
    },
  });
}

module.exports = {
  register,
  login,
};
