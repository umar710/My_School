const mongoose = require("mongoose");

const mongooseSchma = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserDataSchema = mongoose.model("User", mongooseSchma);
module.exports = UserDataSchema;
