const express = require('express')
const multer = require('multer')
const userController = require('../controller/user')
const authController = require('../controller/auth')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

const uploadFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'storage')
    },
    filename: (req, file, cb) => {
      let allowedFile = {
        'image/png': '.png',
        'image/jpeg': '.jpeg',
        'image/jpg': '.jpg'
      }
      if (allowedFile[file.mimetype] == undefined) {
        cb(Error('Invalid file format'))
      } else {
        cb(
          null,
          file.fieldname + '-' + Date.now() + allowedFile[file.mimetype]
        )
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    cb(null, true)
  },
  limits: {
    fileSize: 1000 * 1000,
  },
})

const upload = uploadFile.single('file')

// endpoint : /user/upload/avatar POST
router.post('/upload/avatar',
  authenticate,
  function (req, res, next) {
    upload(req, res, function (error) {
      if (error) {
        return res.status(400).send({
          message: error.message
        })
      }
      next()
    })
  },
  userController.uploadAvatar
)

// endpoint : /user/login POST
router.post('/login', authController.login)

// endpoint : /user POST
router.post('/', userController.createUser)

// endpoint : /user/id PATCH
router.patch('/:id', authenticate, userController.updateUserById)

// endpoint : /user/id GET
router.get('/:id', authenticate, authorize(['0']), userController.getUserById)

// endpoint : /user GET
router.get('/', authenticate, authorize(['0']), userController.getUsers)

// endpoint : /user/id DELETE
router.delete('/:id', authenticate, authorize(['0']), userController.deleteUserById)

module.exports = router

