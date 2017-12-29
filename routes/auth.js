const bcrypt = require('bcrypt')

const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')
const config = require('../config')

const ExtractJwt = passportJWT.ExtractJwt
const jwtOptions = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const Users = require('../models/index').Users

const express = require('express')
const router = express.Router()

const { check, validationResult } = require('express-validator/check')
const loginFormErrors = [
    check('email').isEmail().withMessage('O e-mail deve estar no formato nome@email.com'),
    check('email').exists().withMessage('O e-mail deve ser informado'),
    check('password').exists().withMessage('A senha deve ser informada'),
    check('password').not().isEmpty().withMessage('A senha não pode ser enviada branco'),
]

router.post('/', loginFormErrors, (req, res, next) => {
        
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(422).json(errors.array())

    Users.findOne({ where: {email: req.body.email} })
    .then(user => {
        if(!user) return res.status(401).json({ error: "Usuário não encontrado." })

        isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

        if(isPasswordValid) {
            const payload = { id: user.id }
            const token = jwt.sign(payload, jwtOptions.secretOrKey)
            return res.status(200).json({ token: token })
        } else {
            return res.status(401).json({ error: "Wrong password" })
        }
    })
    .catch(error => next(error))
})

module.exports = router