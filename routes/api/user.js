const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const {
  createContacts,
  getContacts,
  me,
  logout,
  uploadImage,
} = require("../../controllers/user.controller");
const { auth, upload } = require("../../middlewares");
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

userRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

userRouter.patch(
  "/:id/avatars",
  tryCatchWrapper(auth),
  upload.single("avatars"),
  tryCatchWrapper(uploadImage)
);

module.exports = {
  userRouter,
};
