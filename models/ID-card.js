const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const idSchema = new Schema({
    user: { type: mongoose.Types.ObjectId,  ref: "User" , required: true },
    location: { type: String, required: true, },
    idNumber: { type: Number, required: true, unique: true },
    dateOfBirth: {type: Date, required:true }
},{timestamps : true });

module.exports = mongoose.model('idNumber', idSchema);