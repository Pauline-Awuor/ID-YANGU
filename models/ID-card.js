const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const idSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    idNumber: { type: Number, required: true, unique: true },
    date: { type: Date, required: true },
    phone: { type: String, required: true },
    Birthlocation: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add userId field
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("idNumber", idSchema);
