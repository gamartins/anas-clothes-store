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

router.post('/', (req, res) => {
    Users.findOne({ where: {email: req.body.email} })
    .then(user => {
        isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

        if(isPasswordValid) {
            const payload = { id: user.id }
            const token = jwt.sign(payload, jwtOptions.secretOrKey)
            res.status(200).json({ token: token })
        }

        else if(user)
            res.status(401).json({ error: "Senha incorreta" })

        else
            res.status(401).json({ error: "Usuário não encontrado." })
    })
    .catch(error => res.status(401).json({ error: error.message }))
})

module.exports = router