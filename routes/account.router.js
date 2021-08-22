const express = require("express")
const router = express.Router()
const accountController = require("../controllers/account.controller")
const accountModel = require('../models/account.models')

router.get('/login', accountController.login)
router.get('/register', accountController.register)
router.post('/register', accountModel.registerValidator, accountController.postRegister)
router.post('/login', accountController.postLogin)
router.get('/logout', accountController.logout)

module.exports = router