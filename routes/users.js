const passport = require('../auth')
const express = require('express');
const router = express.Router();
const Users = require('../models/index').Users

router.get('/', passport.authenticate(), (req, res) => {
  Users.findAll()
  .then(users => res.json({ users }))
  .catch(error => res.status(500).json(error))
})

router.get('/:id', passport.authenticate(), (req, res) => {
  Users.findById(req.params.id)
  .then(user => res.json({ user }))
  .catch(error => res.status(500).json(error))
})

router.post('/', (req, res) => {
  const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
  }

  Users.create(user)
  .then(user => res.json(user))
  .catch(error => res.status(500).json(error))
})

router.put('/:id', passport.authenticate(), (req, res) => {
  const userUpdated = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }

  Users.findById(req.params.id)
  .then(user => user.update(userUpdated))
  .then(user => res.json(user))
  .catch(error => res.status(500).json(error))
})

router.delete('/:id', passport.authenticate(), (req, res) => {
  Users.findById(req.params.id)
  .then(user => user.destroy())
  .then(() => res.json())
  .catch(error => res.status(500).json(error))
})

module.exports = router;
