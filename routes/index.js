const express = require('express');
const mainController = require('../controllers');
const authRouter = require('./auth');

const mainRouter = express.Router();

mainRouter.get('/', mainController.main);

mainRouter.use('/auth', authRouter);

module.exports = mainRouter;

app.listen(3000)