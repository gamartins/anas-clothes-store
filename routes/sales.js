const { check, validationResult } = require('express-validator/check')
const moment = require('moment')
const passport = require('../auth')
const express = require('express')
const router = express.Router()

const Sales = require('../models/index').Sales
const Clothes = require('../models/index').Clothes

const saleFormValidator = [
    check('paid').exists().withMessage('O campo pago é obrigatório'),
    check('paid').isBoolean().withMessage('O campo pago deve ser do tipo bool'),
    check('paid').not().isEmpty().withMessage('O campo pago não pode ser enviada branco'),

    check('value').exists().withMessage('O campo valor é obrigatório'),
    check('value').isDecimal().withMessage('O campo valor deve ser do tipo decimal'),
    check('value').not().isEmpty().withMessage('O campo valor não pode ser enviada branco'),

    check('clothe_id').exists().withMessage('O campo clothe_id é obrigatório'),
    check('clothe_id').not().isEmpty().withMessage('O campo clothe_id não pode ser enviada branco'),

    check('customer_id').exists().withMessage('O campo customer_id é obrigatório'),
    check('customer_id').not().isEmpty().withMessage('O campo customer_id não pode ser enviada branco'),

    check('date').exists().withMessage('O campo data de venda é obrigatório'),
    check('date').not().isEmpty().withMessage('O campo data de venda não pode ser enviada branco'),
    
    check('date').custom((value, { req, }) => {
        const pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/ // mm/dd/yyyy pattern
        return pattern.test(req.body.purchase_date)
    }).withMessage('O campo data de deve apresentar uma data válida no formato DD/MM/YYYY'),

    check('date').custom((value, { req, }) => {
        const date = moment(req.body.purchase_date, 'DD/MM/YYYY')
        return date.isValid()
    }).withMessage('O campo data de deve apresentar uma data válida')
]

router.all('*', passport.authenticate())

router.get('/', (req, res, next) => {
    Sales.findAll({ where: { user_id: req.user.id }})
    .then(sales => res.json({ sales }))
    .catch(error => next(error))
})

router.get('/:id', (req, res, next) => {
    Sales.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(sale => {
        if(sale) res.status(200).json({ sale })
        else res.status(404).json({ error: 'Venda não encontrada' })
    })
    .catch(error => next(error))
})

router.post('/', saleFormValidator,(req, res, next) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(422).json(errors.array())

    const date = moment(req.body.date, 'DD-MM-YYYY')
    const sale = {
        date: date.format('MM-DD-YYYY'),
        paid: req.body.paid,
        value: req.body.value,
        clothe_id: req.body.clothe_id,
        customer_id: req.body.customer_id,
        user_id: req.user.id,
    }

    Clothes.findById(sale.clothe_id, { where: { user_id: req.user.id }})
    .then(clothe => {
        if (clothe.sold) {
            throw new Error('O produto já foi vendido')
        } else {
            clothe.sold = sale.paid
            clothe.save()
        }
    })
    .then(() => Sales.create(sale))
    .then(sale => res.json(sale))
    .catch(error => res.json(error.message))
})

router.put('/:id', saleFormValidator, (req, res, next) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(422).json(errors.array())

    const date = moment(req.body.date, 'DD-MM-YYYY')
    const saleUpdated = {
        date: date.format('MM-DD-YYYY'),
        paid: req.body.paid,
        value: req.body.value,
        clothe_id: req.body.clothe_id,
        customer_id: req.body.customer_id,
        user_id: req.user.id,
    }

    Clothes.findById(saleUpdated.clothe_id, { where: { user_id: req.user.id }})
    .then(clothe => {
        clothe.sold = saleUpdated.paid
        clothe.save()
    })
    .then(() => Sales.findById(req.params.id))
    .then(sale => sale.update(saleUpdated))
    .then(sale => res.json(sale))
    .catch(error => next(error))
})

router.delete('/:id', (req, res, next) => {
    let sale = null

    Sales.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(data => {
        sale = data
        return Clothes.findById(data.clothe_id, { where: { user_id: req.user.id }})
    })
    .then(clothe => {
        clothe.sold = false
        clothe.save()
    })
    .then(() => sale.destroy())
    .then(() => res.json())
    .catch(error => next(error))
})

module.exports = router