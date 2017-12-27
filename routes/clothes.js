const passport = require('../auth')
var express = require('express')
var router = express.Router()
var Clothes = require('../models/index').Clothes

router.all('*', passport.authenticate())

router.get('/', function(req, res, next){
    Clothes.findAll()
    .then(clothes => res.json({ clothes }))
    .catch(error => res.status(500).json(error))
})

router.get('/:id', (req, res) => {
    Clothes.findById(req.params.id)
    .then(clothe => res.json({ clothe }))
    .catch(error => res.status(500).json(error))
})

router.post('/', (req, res) => {
    const clothe = {
        brand: req.body.brand,
        description: req.body.description,
        purchase_price: req.body.purchase_price,
        purchase_date: req.body.purchase_date,
    }

    Clothes.create(clothe)
    .then(clothe => res.json(clothe))
    .catch(error => res.status(500).json(error))
})

router.put('/:id', (req, res) => {
    const clotheUpdated = {
        brand: req.body.brand,
        description: req.body.description,
        purchase_price: req.body.purchase_price,
        purchase_date: req.body.purchase_date,
    }

    Clothes.findById(req.params.id)
    .then(clothe => clothe.update(clotheUpdated))
    .then(clothe => res.json(clothe))
    .catch(error => res.status(500).json(error))
})

router.delete('/:id', (req, res) => {
    Clothes.findById(req.params.id)
    .then(clothe => clothe.destroy())
    .then(() => res.json())
    .catch(error => res.status(500).json(error))
})

module.exports = router