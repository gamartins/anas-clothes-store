const passport = require('../auth')
const express = require('express')
const router = express.Router()

const Sales = require('../models/index').Sales
const Clothes = require('../models/index').Clothes

router.all('*', passport.authenticate())

router.get('/', (req, res) => {
    Sales.findAll({ where: { user_id: req.user.id }})
    .then(sales => res.json({ sales }))
    .catch(error => res.status(500).json(error.message))
})

router.get('/:id', (req, res) => {
    Sales.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(sale => res.json({ sale }))
    .catch(error => res.status(500).json(error.message))
})

router.post('/', (req, res) => {
    const sale = {
        date: req.body.date,
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

router.put('/:id', (req, res) => {
    const saleUpdated = {
        date: req.body.date,
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
    .catch(error => res.status(500).json(error.message))
})

router.delete('/:id', (req, res) => {
    let sale = null

    Sales.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(data => {
        sale = data
        return Clothes.findById(data.clothe_id, { where: { user_id: req.user.id }})
    })
    .then(clothe => {
        console.log(clothe)
        clothe.sold = false
        clothe.save()
    })
    .then(() => sale.destroy())
    .then(() => res.json())
    .catch(error => res.status(500).json(error.message))
})

module.exports = router