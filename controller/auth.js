const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const config = require('../config')
const { User } = require('../model/user')

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const existedUser = await User.findOne({email})
    if (!existedUser) {
      return res.status(401).send({
        message: 'Email or password is incorrect'
      })
    }
    const isCorrectPassword = await bcryptjs.compare(
      password,
      existedUser.password
    )
    if (!isCorrectPassword) {
      return res.status(401).send({
        message: 'Email or password is incorrect'
      })
    }

    // create token
    const token = signToken({
      userId: existedUser._id,
      email: existedUser.email
    })
    res.status(200).send({ token })
  } catch (error) {
    return res.status(500).send(error)
  }
}

const signToken = payload => {
  const token = jwt.sign(payload, config.secretKey, {
    expiresIn: config.jwtExpiredIn
  })
  return token
}

module.exports = { login }
