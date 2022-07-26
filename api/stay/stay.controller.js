const stayService = require('./stay.service')
const socketService = require('../../services/socket.service')
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
        // const filterBy = {

        // }
        // const stays = await stayService.query(filterBy)
        const stays = await stayService.query()
        res.send(stays)
    } catch (err) {
        logger.error('Failed to get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

async function addStay(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
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