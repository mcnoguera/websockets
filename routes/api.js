var express = require('express')
const { Op } = require('sequelize')

var router = express.Router()
const Joi = require('joi')

const Message = require('../models/message')

router.get('/', function (req, res, next) {
  Message.findAll().then((result) => {
    res.send(result)
  })
})

router.get('/:ts', function (req, res, next) {
  Message.findAll({
    where: {
      ts: {
        [Op.eq]: req.params.ts,
      },
    },
  }).then((value) => res.send(value))
})

router.post('/', function (req, res, next) {
  Message.create({
    message: req.body.message,
    author: req.body.author,
    ts: req.body.ts,
  }).then((result) => {
    res.send(result)
  })
})

router.delete('/:ts', (req, res) => {
  Message.destroy({
    where: {
      ts: { [Op.eq]: req.params.ts },
    },
  }).then((response) => {
    if (response === 1) res.status(204).send()
    else res.status(404).send({ message: 'Message was not found' })
  })
})

router.put('/:ts', (req, res) => {
  // const { error } = validateMessage(req.body);

  // if (error) {
  //   return res.status(400).send(error);
  // }

  Message.update(req.body, {
    where: {
      ts: { [Op.eq]: req.params.ts },
    },
  }).then((response) => {
    if (response[0] !== 0) res.send({ message: 'Message updated' })
    else res.status(404).send({ message: 'Message was not found' })
  })
})

const validateMessage = (message) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string().email(),
  })

  return schema.validate(message)
}

module.exports = router