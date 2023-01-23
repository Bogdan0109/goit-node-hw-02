const express = require("express");

const { signup, login } = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../helpers/index.js");

const authRouter = express.Router();

authRouter.post("/signup", tryCatchWrapper(signup));
authRouter.post("/login", tryCatchWrapper(login));

module.exports = {
  authRouter,
};
