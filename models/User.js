const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
