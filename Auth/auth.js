
const express = require('express');
const authController = require('../controllers/auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mainRouter = require('./routes');

const authRouter = express.Router();

authRouter.post('/register', authController.register);

module.exports = authRouter;

app.listen(3000)