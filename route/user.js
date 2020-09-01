const express = require('express')
const multer = require('multer')
const userController = require('../controller/user')
const authController = require('../controller/auth')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

const uploadFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'storage')
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname)
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, true)
  }
})

// endpoint : /users/upload/avatar POST
router.post('/upload',
  authenticate,
  uploadFile.single('file'),
  userController.uploadAvatar
)

// endpoint : /users/login POST
router.post('/login', authController.login)

// endpoint : /users POST
router.post('/', userController.createUser)

// endpoint : /users/id PATCH
router.patch('/:id', authenticate, userController.updateUserById)

// endpoint : /users/id GET
router.get('/:id', authenticate, authorize(['admin']), userController.getUserById)

// endpoint : /users GET
router.get('/', authenticate, authorize(['admin']), userController.getUsers)

// endpoint : /users/id DELETE
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUserById)

module.exports = router

