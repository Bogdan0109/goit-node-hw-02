const mongoose = require("mongoose");

const schema = mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
  contacts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "contacts",
    },
  ],
});

const Users = mongoose.model("users", schema);

module.exports = {
  Users,
};
