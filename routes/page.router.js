const express = require("express")
const router = express.Router()
const pageController = require("../controllers/page.controller")
const pageModel = require('../models/page.model')

router.get('/', pageController.index)
router.use(pageController.middleware)
router.get('/user', pageController.user)

module.exports = router
