const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const {
  createContacts,
  getContacts,
  me,
} = require("../../controllers/user.controller");
const { auth } = require("../../middlewares");
const userRouter = express.Router();

userRouter.post(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(createContacts)
);

userRouter.get(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContacts)
);

userRouter.get("/me", tryCatchWrapper(auth), tryCatchWrapper(me));

module.exports = {
  userRouter,
};
