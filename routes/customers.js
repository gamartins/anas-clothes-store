const passport = require('../auth')
const express = require('express')
const router = express.Router()
const Customers = require('../models/index').Customers

router.all('*', passport.authenticate())

router.get('/', (req, res) => {
    Customers.findAll({ where: { user_id: req.user.id }})
    .then(customers => res.json({ customers }))
    .catch(error => res.status(500).json(error.message))
})

router.get('/:id', (req, res) => {
    Customers.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(customer => res.json({ customer }))
    .catch(error => res.status(500).json(error.message))    
})

router.post('/', (req, res) => {
    const customer = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        user_id: req.user.id
    }

    Customers.create(customer)
    .then(customer => res.json(customer))
    .catch(error => res.json(error.message))
})

router.put('/:id', (req, res) => {
    const customerUpdated = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        user_id: req.user.id
    }

    Customers.findById(req.params.id)
    .then(customer => customer.update(customerUpdated))
    .then(customer => res.json(customer))
    .catch(error => res.status(500).json(error.message))
})

router.delete('/:id', (req, res) => {
    Customers.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(customer => customer.destroy())
    .then(() => res.json())
    .catch(error => res.status(500).json(error.message))
})

module.exports = router