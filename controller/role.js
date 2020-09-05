const { Role, createRoleSchema } = require('../model/role')

exports.createRole = async (req, res) => {
  try {
    const validateResult = createRoleSchema.validate(req.body)
    if (validateResult.error) {
      return res.status(422).send({
        message: 'Validation fail',
        data: validateResult.error.details
      })
    }
    const { code, title } = req.body
    const existedRole = await Role.findOne({ code })
    if (existedRole) {
      return res.status(401).send({
        message: 'This role is already existed!'
      })
    }
    const role = Role({ code, title })
    const newRole = await role.save()
    res.status(201).send({
      message: 'Success',
      data: newRole
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.getRole = async (req, res) => {
  try {
    const roles = await Role.find()
    return res.status(200).send({
      message: 'Success',
      data: roles
    })
  } catch (error) {
    res.status(500).send(error)
  }
}