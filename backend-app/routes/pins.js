const express = require('express')
const router = express.Router()
const pinController = require('../controllers/pinController')

// routes
router.post('/', pinController.createPin)
router.get('/', pinController.getAllPins)

module.exports = router
