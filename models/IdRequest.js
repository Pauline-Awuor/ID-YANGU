// models/IdRequest.js
const mongoose = require("mongoose");

const idRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    idNumber: { type: Number, required: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IdRequest", idRequestSchema);
