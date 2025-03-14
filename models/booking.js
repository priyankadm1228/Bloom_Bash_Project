const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  events: {
    type: String,
    enum: ["marriage", "birthday", "Corporate", "babyShower", "Custom"],
    required: true,
  },
  service: {
    type: [String],
    enum: ["Catering", "Photoshoot", "Stylist", "Entertainment", "decor"],
    require: true,
  },
  date: { type: Date, require: true, set: (val) => val.setHours(0, 0, 0, 0) },
  location: { type: String, require: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Booking = mongoose.model("Booking", bookSchema);
module.exports = Booking;
