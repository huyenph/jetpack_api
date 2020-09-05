const mongoose = require('mongoose')
const joi = require('joi')

const roleSchema = mongoose.Schema({
  code: {
    type: String
  },
  title: {
    type: String
  },
})

exports.createRoleSchema = joi.object({
  code: joi.string().required(),
  title: joi.string().required(),
})

exports.Role = mongoose.model('role', roleSchema)