const passport = require('../auth')
var express = require('express')
var router = express.Router()
var Clothes = require('../models/index').Clothes

router.all('*', passport.authenticate())

router.get('/', (req, res) => {
    Clothes.findAll({ where: { user_id: req.user.id }})
    .then(clothes => res.json({ clothes }))
    .catch(error => res.status(500).json(error.message))
})

router.get('/:id', (req, res) => {
    Clothes.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(clothe => res.json({ clothe }))
    .catch(error => res.status(500).json(error.message))
})

router.post('/', (req, res) => {
    const clothe = {
        brand: req.body.brand,
        description: req.body.description,
        purchase_price: req.body.purchase_price,
        purchase_date: req.body.purchase_date,
        user_id: req.user.id
    }

    Clothes.create(clothe)
    .then(clothe => res.json(clothe))
    .catch(error => res.status(500).json(error.message))
})

router.put('/:id', (req, res) => {
    const clotheUpdated = {
        brand: req.body.brand,
        description: req.body.description,
        purchase_price: req.body.purchase_price,
        purchase_date: req.body.purchase_date,
        user_id: req.user.id
    }

    Clothes.findById(req.params.id)
    .then(clothe => clothe.update(clotheUpdated))
    .then(clothe => res.json(clothe))
    .catch(error => res.status(500).json(error.message))
})

router.delete('/:id', (req, res) => {
    Clothes.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(clothe => clothe.destroy())
    .then(() => res.json())
    .catch(error => res.status(500).json(error.message))
})

module.exports = router