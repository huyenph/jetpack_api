const express = require('express')
const roleController = require('../controller/role')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

// endpoint : /role POST
router.post('/', authenticate, authorize(['0']), roleController.createRole)

// endpoint : /role GET
router.get('/', roleController.getRole)

module.exports = router
