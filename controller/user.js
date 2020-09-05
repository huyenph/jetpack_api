const bcryptjs = require('bcryptjs')
const { User, createUserSchema, updateUserSchema } = require('../model/user')

exports.createUser = async (req, res) => {
  try {
    const validationResult = createUserSchema.validate(req.body)
    if (validationResult.error) {
      return res.status(422).send({
        message: 'Validation fail',
        data: validationResult.error.details
      })
    }
    const { firstName, lastName, email, password, avatar } = req.body
    const existedUser = await User.findOne({ email })
    if (existedUser) {
      return res.status(401).send({
        message: 'This email address is already being used!'
      })
    }
    // hash password
    const hashPassword = await bcryptjs.hash(password, 12)

    const user = User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      avatar,
      role: req.body.role,
    })
    const newUser = await user.save()
    res.status(201).send({
      message: 'Success',
      data: newUser
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).send()
    }
    return res.status(200).send({
      message: 'Success',
      data: user
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select({ password: 0 })
    return res.status(200).send({
      message: 'Success',
      data: users
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findByIdAndDelete(userId, { useFindAndModify: false })
    if (!user) {
      return res.status(404).send()
    }
    return res.status(200).send({
      message: 'Success',
      data: user
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.updateUserById = async (req, res) => {
  try {
    const validationResult = updateUserSchema.validate()
    if (validationResult.error) {
      return res.status(422).send({
        message: 'Validation fail',
        data: validationResult.error.details
      })
    }
    const userId = req.params.id
    const allowUpdateFields = ['firstName', 'lastName', 'email', 'avatar']
    const updateFields = Object.keys(req.body)
    const { email } = req.body
    const existedUser = await User.findOne({ email })
    if (existedUser._id != userId) {
      return res.status(401).send({
        message: 'This email address is already being used!'
      })
    }
    const canUpdate = updateFields.every(field => allowUpdateFields.includes(field))
    if (!canUpdate) {
      return res.status(400).send({
        message: 'Some field are not allowed to update!'
      })
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      useFindAndModify: false,
    })
    if (!user) {
      return res.status(404).send()
    }
    return res.status(200).send({
      message: 'Success',
      data: user
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({
      message: 'Need an image for uploading'
    })
  }
  try {
    const user = await User.findById(req.userId)
    user.avatar = req.file.filename
    await user.save()
    res.status(200).send({
      message: 'Successs',
      data: user
    })
  } catch (error) {
    res.status(500).send(error)
  }
}