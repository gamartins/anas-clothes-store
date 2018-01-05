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

/**
 * @api {get} /customers Get list of all customers
 * @apiGroup Customers
 * @apiName GetCustomers
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *      {
 *          "id": 1,
 *          "name": "Rafinha",
 *          "phone": "8535551234",
 *          "address": "Montese?",
 *          "user_id": 3,
 *          "updatedAt": "2018-01-03T23:41:00.786Z",
 *          "createdAt": "2018-01-03T23:41:00.786Z"
 *      },
 *      {
 *          "id": 1,
 *          "name": "Rafinha",
 *          "phone": "8535551234",
 *          "address": "Montese?",
 *          "user_id": 3,
 *          "updatedAt": "2018-01-03T23:41:00.786Z",
 *          "createdAt": "2018-01-03T23:41:00.786Z"
 *      }
 *  ]
 * 
 */
router.get('/', (req, res, next) => {
    Customers.findAll({ where: { user_id: req.user.id }})
    .then(customers => res.json({ customers }))
    .catch(error => next(error))
})

/**
 * @api {get} /customers/:id Get info from a specific customer
 * @apiGroup Customers
 * @apiName GetCustomersById
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiParam { Number } id Customer id number
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "id": 1,
 *      "name": "Rafinha",
 *      "phone": "8535551234",
 *      "address": "Montese?",
 *      "user_id": 3
 *  }
 * 
 */
router.get('/:id', (req, res, next) => {
    Customers.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(customer => {
        if(customer) res.status(200).json({ customer })
        else res.status(404).json({ error: 'Cliente não encontrado' })
    })
    .catch(error => next(error))
})

/**
 * @api {post} /customers Create new customer
 * @apiGroup Customers
 * @apiName PostCustomer
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiParam { String } name Customer's name
 * @apiParam { String } phone Phone number
 * @apiParam { Decimal } address Customer's address
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "id": 1,
 *      "name": "Rafinha",
 *      "phone": "8535551234",
 *      "address": "Montese?",
 *      "user_id": 3
 *  }
 * 
 */
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

/**
 * @api {put} /customers Update data from a customer
 * @apiGroup Customers
 * @apiName PutCustomer
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiParam { Number } id Customer's id
 * @apiParam { String } name Customer's name
 * @apiParam { String } phone Phone number
 * @apiParam { Decimal } address Customer's address
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "id": 1,
 *      "name": "Rafinha",
 *      "phone": "8535551234",
 *      "address": "Montese?",
 *      "user_id": 3
 *  }
 * 
 */
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

/**
 * @api {delete} /customers/:id Remove a customer
 * @apiGroup Customers
 * @apiName DeleteCustomer
 * @apiHeader {String} Authorization Bearer authorization token.
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 204 OK
 *  { }
 */
router.delete('/:id', (req, res, next) => {
    Customers.findById(req.params.id, { where: { user_id: req.user.id }})
    .then(customer => {
        if(customer) customer.destroy().then(() => res.status(204).json())
        else res.status(404).json({ error: 'Cliente não encontrado' })
    })
    .catch(error => next(error))
})

module.exports = router