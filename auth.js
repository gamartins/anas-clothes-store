const passport = require('passport')
const passportJWT = require('passport-jwt')

const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

const config = require('./config')
const Users = require('./models/index').Users

const jwtOptions = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest:	ExtractJwt.fromAuthHeaderAsBearerToken()
}

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    Users.findById(jwtPayload.id)
    .then(user => next(null, { id: user.id }))
    .catch(error => next(null, false))
})

passport.use(strategy)

module.exports = {
    initialize: () => passport.initialize(),
    authenticate: () =>	passport.authenticate("jwt", config.jwtSession)
}
