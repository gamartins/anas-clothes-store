const { check, validationResult } = require('express-validator/check')
const passport = require('../auth')
const express = require('express')
const router = express.Router()
const Customers = require('../models/index').Customers

const customerFormValidators = [
    check('name').exists().withMessage('O campo nome é obrigatório'),
    check('name').not().isEmpty().withMessage('O campo nome não pode ser enviada branco'),

    check('phone').exists().withMessage('O campo telefone é obrigatório'),
    check('phone').not().isEmpty().withMessage('O campo telefone não pode ser enviada branco'),
    check('phone').isNumeric().withMessage('O campo deve possuir apenas números'),
    check('phone').isLength({ min: 10 }).withMessage('O campo deve possuir no mínimo 10 digitos'),

    check('address').exists().withMessage('O campo endereço é obrigatório'),
    check('address').not().isEmpty().withMessage('O campo endereço não pode ser enviada branco'),
]

router.all('*', passport.authenticate())

router.get('/', (req, res, next) => {
    Customers.findAll({ where: { user_id: req.user.id }})
    .then(customers => res.json({ customers }))
    .catch(error => next(error))
})

router.get('/:id', (req, res, next) => {
    Customers.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(customer => {
        if(customer) res.status(200).json({ customer })
        else res.status(404).json({ error: 'Cliente não encontrado' })
    })
    .catch(error => next(error))
})

router.post('/', customerFormValidators, (req, res, next) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(422).json(errors.array())

    const customer = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        user_id: req.user.id
    }

    Customers.create(customer)
    .then(customer => res.json(customer))
    .catch(error => next(error))
})

router.put('/:id', customerFormValidators,(req, res, next) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(422).json(errors.array())

    const customerUpdated = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        user_id: req.user.id
    }

    Customers.findById(req.params.id)
    .then(customer => customer.update(customerUpdated))
    .then(customer => res.json(customer))
    .catch(error => next(error))
})

router.delete('/:id', (req, res, next) => {
    Customers.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(customer => {
        if(customer) customer.destroy().then(() => res.json())
        else res.status(404).json({ error: 'Cliente não encontrado' })
    })
    .catch(error => next(error))
})

module.exports = router