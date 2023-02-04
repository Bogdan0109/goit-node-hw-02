const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const {
  createContacts,
  getContacts,
  me,
  logout,
  uploadImage,
  verifyEmail,
} = require("../../controllers/user.controller");
const { auth, upload, isLogin } = require("../../middlewares");
const userRouter = express.Router();

userRouter.post(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(isLogin),
  tryCatchWrapper(createContacts)
);

userRouter.get(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(isLogin),
  tryCatchWrapper(getContacts)
);

userRouter.get(
  "/me",
  tryCatchWrapper(auth),
  tryCatchWrapper(isLogin),
  tryCatchWrapper(me)
);

userRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

userRouter.patch(
  "/:id/avatars",
  tryCatchWrapper(auth),
  tryCatchWrapper(isLogin),
  upload.single("avatars"),
  tryCatchWrapper(uploadImage)
);

userRouter.get("/verify/:token", tryCatchWrapper(verifyEmail));

module.exports = {
  userRouter,
};
