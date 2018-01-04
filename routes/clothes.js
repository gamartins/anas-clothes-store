const { check, validationResult } = require('express-validator/check')
const moment = require('moment')
const passport = require('../auth')
var express = require('express')
var router = express.Router()
var Clothes = require('../models/index').Clothes

const clotheFormErrors = [
    check('brand').exists().withMessage('O campo marca é obrigatório'),
    check('brand').not().isEmpty().withMessage('O campo marca não pode ser enviada branco'),
    check('purchase_price').exists().withMessage('O campo preço de compra é obrigatório'),
    check('purchase_price').not().isEmpty().withMessage('O campo preço de compra não pode ser enviada branco'),
    check('purchase_price').isDecimal().withMessage('O campo preço de compra deve enviar um valor decimal'),
    check('purchase_date').exists().withMessage('O campo data de compra é obrigatório'),
    check('purchase_date').not().isEmpty().withMessage('O campo data de compra não pode ser enviada branco'),
    
    check('purchase_date').custom((value, { req, }) => {
        const pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/ // mm/dd/yyyy pattern
        return pattern.test(req.body.purchase_date)
    }).withMessage('O campo data de deve apresentar uma data válida no formato DD/MM/YYYY'),

    check('purchase_date').custom((value, { req, }) => {
        const date = moment(req.body.purchase_date, 'DD/MM/YYYY')
        return date.isValid()
    }).withMessage('O campo data de deve apresentar uma data válida')
]

router.all('*', passport.authenticate())

/**
 * @api {get} /clothes Get list of all clothes
 * @apiGroup Clothes
 * @apiName GetClothes
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "id": 1,
 *      "brand": "Nike",
 *      "description": "Uma roupa esportiva",
 *      "sold": null,
 *      "purchase_price": "199.00",
 *      "user_id": 3
 *    },
 *    {
 *      "id": 2,
 *      "brand": "Nike",
 *      "description": "Uma roupa esportiva",
 *      "sold": null,
 *      "purchase_price": "199.00",
 *      "user_id": 3
 *    },
 *  ]
 * 
 */
router.get('/', (req, res, next) => {
    Clothes.findAll({ where: { user_id: req.user.id }})
    .then(clothes => res.json({ clothes }))
    .catch(error => next(error))
})

/**
 * @api {get} /clothes/:id Get info of specific clothe
 * @apiGroup Clothes
 * @apiName GetClothesById
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiParam { Number } id Clothe id number
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK  
 *  {
 *      "id": 2,
 *      "brand": "Nike",
 *      "description": "Uma roupa esportiva",
 *      "sold": null,
 *      "purchase_price": "199.00",
 *      "user_id": 3
 *  }
 * 
 */
router.get('/:id', (req, res, next) => {
    Clothes.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(clothe => {
        if(clothe) res.status(200).json({ clothe })
        else res.status(404).json({ error: 'Produto não encontrado' })
    })
    .catch(error => next(error))
})

/**
 * @api {post} /clothes Create new clothe
 * @apiGroup Clothes
 * @apiName PostClothe
 * 
 * @apiParam { String } brand Cloth brand, ie: Nike, Adidas...
 * @apiParam { String } description Description about the clothe
 * @apiParam { Decimal } purchase_price Product price, ie: 199.00
 * @apiParam { Date } purchase_date Date when the product was purchased, ie: 01/01/2018
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *  "id": 2,
 *  "brand": "Nike",
 *  "description": "Uma roupa esportiva",
 *  "purchase_price": "199.00",
 *  "purchase_date": "2017-12-29T03:00:00.000Z",
 *  "user_id": 3,
 *  "sold": null
 * }
 * 
 */
router.post('/', clotheFormErrors, (req, res, next) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(422).json(errors.array())

    const purchase_date = moment(req.body.purchase_date, 'DD/MM/YYYY')
    const clothe = {
        brand: req.body.brand,
        description: req.body.description,
        purchase_price: req.body.purchase_price,
        purchase_date: purchase_date.format('MM/DD/YYYY'),
        user_id: req.user.id
    }

    Clothes.create(clothe)
    .then(clothe => res.json(clothe))
    .catch(error => next(error))
})

/**
 * @api {post} /clothes Create new clothe
 * @apiGroup Clothes
 * @apiName UpdateClothe
 * 
 * @apiParam { Number } id The id of the product to be updated
 * @apiParam { String } brand Cloth brand, ie: Nike, Adidas...
 * @apiParam { String } description Description about the clothe
 * @apiParam { Decimal } purchase_price Product price, ie: 199.00
 * @apiParam { Date } purchase_date Date when the product was purchased, ie: 01/01/2018
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *  "id": 2,
 *  "brand": "Nike",
 *  "description": "Uma roupa esportiva",
 *  "purchase_price": "199.00",
 *  "purchase_date": "2017-12-29T03:00:00.000Z",
 *  "user_id": 3,
 *  "sold": null
 * }
 * 
 */
router.put('/:id', (req, res, next) => {
    const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(422).json(errors.array())

    const purchase_date = moment(req.body.purchase_date, 'DD/MM/YYYY')
    const clotheUpdated = {
        brand: req.body.brand,
        description: req.body.description,
        purchase_price: req.body.purchase_price,
        purchase_date: purchase_date,
        user_id: req.user.id
    }

    Clothes.findById(req.params.id)
    .then(clothe => clothe.update(clotheUpdated))
    .then(clothe => res.json(clothe))
    .catch(error => next(error))
})

/**
 * @api {delete} /clothes:id Remove a Clothe
 * @apiGroup Clothes
 * @apiName DeleteClothe
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  { }
 */
router.delete('/:id', (req, res, next) => {
    Clothes.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(clothe => {
        if(clothe) clothe.destroy().then(() => res.status(204).json())
        else res.status(404).json({ error: 'Produto não encontrado' })
    })
    .catch(error => next(error))
})

module.exports = router