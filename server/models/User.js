"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  googleId: String,
  displayName: String,
  avatar: String,
  credits: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
