const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
},{timestamps: true});
// Create the model and expose it to our app
module.exports = mongoose.model('User', userSchema);

