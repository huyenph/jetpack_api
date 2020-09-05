const jwt = require('jsonwebtoken')
const { User } = require('../model/user')
const config = require('../config')

exports.authenticate = async (req, res, next) => {
	const tokenStr = req.get('Authorization')
	if (!tokenStr) {
		return res.status(400).send({ message: 'No token provider' })
	}
	const token = tokenStr.split(' ')[1]
	try {
		const decodeToken = jwt.verify(token, config.secretKey)
		const existedUser = await User.findById(decodeToken.userId)
		if (!existedUser) {
			return res.status(401).send({ message: 'Permission deny' })
		}
		req.userId = existedUser._id
		req.userEmail = existedUser.email
		req.userRole = existedUser.role
		console.log(existedUser.role)
		next()
	} catch (error) {
		return res.status(401).send({
			message: 'Permission deny',
			data: error
		})
	}
}

exports.authorize = accessRole => {
	return async (req, res, next) => {
		try {
			let canAccess = false
			req.userRole.forEach(role => {
				if (accessRole.includes(role.code)) {
					canAccess = true
				}
			})
			if (!canAccess) {
				return res.status(401).send({ message: 'Permission deny' })
			}
			next();
		} catch (error) {
			return res.status(500).send()
		}
	}
}