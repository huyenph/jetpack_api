const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const config = require('../config')
const { User } = require('../model/user')

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '906ac091b0de48',
    pass: 'b3de767059efba',
  },
})

const message = {
  from: 'elonmusk@tesla.com', // Sender address
  to: 'huyen.phamhoang96@email.com',         // List of recipients
  subject: 'Design Your Model S | Tesla', // Subject line
  text: 'Have the most fun you can in a car. Get your Tesla today!',
  html: '<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>',
}

exports.login = async (req, res) => {
  console.log(req.headers.host)
  const { email, password } = req.body
  try {
    const existedUser = await User.findOne({ email })
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
    res.status(200).send({
      message: 'Success',
      token
    })
    transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info)
      }
    })
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

// module.exports = { login }
