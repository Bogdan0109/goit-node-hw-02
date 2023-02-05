const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const { Users } = require("./../models/users");
const multer = require("multer");
const path = require("path");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }

    return next();
  };
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  const [type, token] = authHeader.split(" ");

  const { JWT_SECRET } = process.env;

  if (type !== "Bearer") {
    throw HttpError(401, "token type is not valid");
  }

  if (!token) {
    throw HttpError(401, "no token provided");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await Users.findById(id);
    user.token = token;

    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw HttpError(401, "jwt token is not valid");
    }
    throw error;
  }

  next();
}

async function userIsAuthorizedAndVerify(req, res, next) {
  const { _id: id, token } = req.user;
  const user = await Users.findById(id);

  if (user.token !== token) {
    throw HttpError(401, "Not authorized");
  }

  if (!user.verify) {
    throw HttpError(401, "email is not verified! Please check your mail box");
  }

  req.user = user;

  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() + file.originalname);
  },
});

const upload = multer({
  storage,
  // limits: {
  //   fileSize: 1,
  // },
});

module.exports = {
  validateBody,
  auth,
  upload,
  userIsAuthorizedAndVerify,
};
