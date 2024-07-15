const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const idSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    idNumber: { type: Number, required: true, unique: true },
    date: { type: Date, required: true },
    phone: { type: String, required: true },
    birthLocation: { type: String, },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("idNumber", idSchema);
