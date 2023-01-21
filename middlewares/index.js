const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const { Users } = require("./../models/users");

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

  if (type !== "Bearer") {
    throw HttpError(401, "token type is not valid");
  }

  if (!token) {
    throw HttpError(401, "no token provided");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
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

module.exports = {
  validateBody,
  auth,
};
