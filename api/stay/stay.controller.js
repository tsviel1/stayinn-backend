const stayService = require('./stay.service')
const logger = require('../../services/logger.service')

async function getStay(req, res) {
    try {
        const stay = await stayService.getById(req.params.id)
        res.send(stay)
    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}

async function getStays(req, res) {
    try {
        const filterBy = req.query
        const stays = await stayService.query(filterBy)
        res.send(stays)
    } catch (err) {
        logger.error('Failed to get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

async function addStay(req, res) {
    try {
      const stay = req.body
      const addedStay = await stayService.add(stay)
      res.json(addedStay)
    } catch (err) {
      logger.error('Failed to add stay', err)
      res.status(500).send({ err: 'Failed to add stay' })
    }
  }

async function deleteStay(req, res) {
    try {
        await stayService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete stay', err)
        res.status(500).send({ err: 'Failed to delete stay' })
    }
}

async function updateStay(req, res) {
    try {
        const stay = req.body
        const savedStay = await stayService.update(stay)
        res.send(savedStay)
    } catch (err) {
        logger.error('Failed to update stay', err)
        res.status(500).send({ err: 'Failed to update stay' })
    }
}

module.exports = {
    getStay,
    getStays,
    addStay,
    deleteStay,
    updateStay
}