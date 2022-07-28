const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query() {
    // console.log(filterBy)
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('order')
        var orders = await collection.find().toArray()
        orders = orders.map(order => {
            order.createdAt = ObjectId(order._id).getTimestamp()
            return order
        })
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne({ _id: ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order by id: ${orderId}`, err)
        throw err
    }
}


async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function update(order) {
    try {
        // peek only updatable properties
        const orderToSave = {
            _id: ObjectId(order._id), // needed for the returnd obj
            // Add the required fields
            // do spread to order object
        }
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: orderToSave._id }, { $set: orderToSave })
        return orderToSave
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}

async function add(order) {
    try {
        // peek only updatable fields!
        console.log('in order service')
        const collection = await dbService.getCollection('order')
        const addedOrder = await collection.insertOne(order)
        return addedOrder
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}




module.exports = {
    query,
    getById,

    remove,
    update,
    add
}