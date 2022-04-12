const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({
    email: req.body.email
  })
  if (candidate) {
const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
    if (passwordResult) {
const token = jwt.sign({
  email: candidate.email,
  userId: candidate._id
}, keys.jwt, {expiresIn: 60 * 60})
      res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      res.status(401).json({
        message: 'WRONG PASSWORD!'
      })
    }
  } else {
    res.status(404).json({
      message: 'ТАКОЙ ПОЛЬЗОВАТЕЛЬ НЕ ЗАРЕГИСТРИРОВАН'
    })
  }
  // res.status(200).json({
  //   login: {
  //     email: req.body.email,
  //     password: req.body.password
  //   }
  // })
}

module.exports.register = async function (req, res) {
//   const user = new User({
// email: req.body.email,
//     password: req.body.password
//   })
//   user.save().then(() => console.log('USER CREATED'))
  const candidate = await User.findOne({email: req.body.email})

  if (candidate) {
res.status(409).json({
  message: 'ТАКОЙ ПОЛЬЗОВАТЕЛЬ УЖЕ СУЩЕСТВУЕТ'
})
  } else {
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password
const user = new User({
  email: req.body.email,
  password: bcrypt.hashSync(password, salt)
})
    try {
      await user.save()
      res.status(201).json(user)
    } catch(e) {
      errorHandler(res, e)
    }

  }

}
