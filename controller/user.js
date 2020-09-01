const bcryptjs = require('bcryptjs')
const { User, createUserSchema, updateUserSchema } = require('../model/user')

const createUser = async (req, res) => {
  try {
    const validationResult = createUserSchema.validate(req.body)
    if (validationResult.error) {
      return res.status(422).send({
        message: 'Validation fail',
        data: validationResult.error.details
      })
    }
    const { name, email, password, avatar, role } = req.body
    // hash password
    const hashPassword = await bcryptjs.hash(password, 12)
    const user = User({
      name,
      email,
      password: hashPassword,
      avatar,
      role,
    })
    const newUser = await user.save()
    res.status(201).send(newUser)
  } catch (error) {
    return res.status(500).send(error)
  }
}

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).send()
    }
    return res.status(200).send(user)
  } catch (error) {
    return res.status(500).send(error)
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).send(users)
  } catch (error) {
    res.status(500).send(error)
  }
}

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).send()
    }
    return res.status(200).send(user)
  } catch (error) {
    return res.status(500).send(error)
  }
}

const updateUserById = async (req, res) => {
  try {
    const validationResult = updateUserSchema.validate()
    if (validationResult.error) {
      return res.status(422).send({
        message: 'Validation fail',
        data: validationResult.error.details
      })
    }
    const userId = req.params.id
    const allowUpdateFields = ['name', 'email', 'avatar']
    const updateFields = Object.keys(req.body)
    const canUpdate = updateFields.every(field => allowUpdateFields.includes(field))
    if (!canUpdate) {
      return res.status(400).send({
        message: 'Some field are not allowed to update!'
      })
    }
    const user = await User.findByIdAndUpdate(userId)
    if (!user) {
      return res.status(404).send()
    }
    return res.status(200).send(user)
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  createUser,
  getUserById,
  getUsers,
  deleteUserById,
  updateUserById,
}

