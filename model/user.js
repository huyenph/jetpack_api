const mongoose = require('mongoose')
const joi = require('joi')

const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
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
    role: [
        {
            role_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'role'
            },
            code: {
                type: String
            },
            title: {
                type: String
            }
        }
    ]
})

exports.createUserSchema = joi.object({
    firstName: joi.string().required().min(4).max(16),
    lastName: joi.string().required().min(4).max(16),
    email: joi.string().email().required(),
    password: joi.string().required(),
    avatar: joi.string(),
    role: joi.array().items(
        joi.object({
            role_id: joi.string().required(),
            code: joi.string().required(),
            title: joi.string().required()
        })
    ),
})

exports.updateUserSchema = joi.object({
    firstName: joi.string().required().min(4).max(16),
    lastName: joi.string().required().min(4).max(16),
    email: joi.string().email().required(),
    avatar: joi.string().uri(),
})

exports.User = mongoose.model('user', userSchema)