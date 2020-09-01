const mongoose = require('mongoose')
const validator = require('validator')
const joi = require('joi')

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    role: {
        type: [String]
    }
})

const createUserSchema = joi.object({
    name: joi.string().required().min(8).max(16),
    email: joi.string().email().required(),
    password: joi.string().required(),
    avatar: joi.string(),
    role: joi.array().required(),
})

const updateUserSchema = joi.object({
    name: joi.string().required().min(8).max(16),
    email: joi.string().email().required(),
    avatar: joi.string().uri(),
})

const User = mongoose.model('user', userSchema)

module.exports = { User, createUserSchema, updateUserSchema, }
