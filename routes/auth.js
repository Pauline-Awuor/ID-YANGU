const express = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/userController');
const accessToken = require('../middleware/accessToken');

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.patch('/update-profile', accessToken, userController.updateUserProfile);

module.exports = authRouter;
