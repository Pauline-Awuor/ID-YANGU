const express = require('express')
const mainController = require('../controllers')

const authRouter = require('./auth')
const idRouter = require('./idDetail')

const mainRouter = express.Router()

mainRouter.get('/', mainController.main)

mainRouter.use('/auth', authRouter)
mainRouter.use('/idDetails', idRouter)

module.exports = mainRouter;

