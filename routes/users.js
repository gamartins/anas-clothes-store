const passport = require('../auth')
const express = require('express');
const router = express.Router();
const Users = require('../models/index').Users

const { check, validationResult } = require('express-validator/check')
const userFormErrors = [
  check('name').exists().withMessage('O campo name deve ser informado'),
  check('name').not().isEmpty().withMessage('O campo name não pode ser enviada branco'),
  check('email').isEmail().withMessage('O e-mail deve estar no formato nome@email.com'),
  check('email').exists().withMessage('O e-mail deve ser informado'),
  check('password').exists().withMessage('A senha deve ser informada'),
  check('password').isLength({ min: 6}).withMessage('A senha devo possuir no mínimo 6 digitos')
]

router.get('/', passport.authenticate(), (req, res, next) => {
  Users.findAll()
  .then(users => res.json({ users }))
  .catch(error => next(error))
})

router.get('/:id', passport.authenticate(), (req, res, next) => {
  Users.findById(req.params.id)
  .then(user => {
    if(user) res.status(200).json({ user })
    else res.status(404).json({ error: 'Usuário não encontrado' })
  })
  .catch(error => next(error))
})

router.post('/', userFormErrors , (req, res, next) => {
  const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(422).json(errors.array())

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }

  Users.create(user)
  .then(user => res.json(user))
  .catch(error => next(error))
})

router.put('/:id', userFormErrors, passport.authenticate(), (req, res, next) => {
  const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(422).json(errors.array())

  const userUpdated = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }

  Users.findById(req.params.id)
  .then(user => user.update(userUpdated))
  .then(user => res.json(user))
  .catch(error => next(error))
})

router.delete('/:id', passport.authenticate(), (req, res, next) => {
  Users.findById(req.params.id)
  .then(user => {
    if(user) user.destroy().then(() => res.status(204).json())
    else res.status(404).json({ error: 'Usuário não encontrado' })
  })
  .catch(error => next(error))
})

module.exports = router;
