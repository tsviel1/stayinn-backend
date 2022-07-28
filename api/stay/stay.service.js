const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    console.log(filterBy, '1')
    const criteria = _buildCriteria(filterBy)
    console.log(criteria, '2');
    try {
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        stays = stays.map(stay => {
            stay.createdAt = ObjectId(stay._id).getTimestamp()
            return stay
        })
        // console.log(stays);
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne({ _id: ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay by id: ${stayId}`, err)
        throw err
    }
}


async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function update(stay) {
    try {
        // peek only updatable properties
        const stayToSave = {
            _id: ObjectId(stay._id), // needed for the returnd obj
            // Add the required fields
            // do spread to stay object
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: stayToSave._id }, { $set: stayToSave })
        return stayToSave
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        // peek only updatable fields!
        const stayToAdd = {
            // ...stay or do {fieldName, fieldname, ...... }
        }
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stayToAdd)
        return stayToAdd
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

function _buildCriteria(filterBy = { txt: '', category: 'beach', price: null, bedrooms: null, beds: null, capacity: null }) {
    const criteria = {}
    console.log(filterBy, '3');
    const { txt, category, price, bedrooms, beds, capacity } = filterBy
    const txtCriteria = { $regex: txt, $options: 'i' }
    if (txt) criteria.$or = [
        {
            'address.street': txtCriteria
        },
        {
            ' address.country': txtCriteria
        }
    ]
    if (category) criteria.tags = { $eq: category }
    if (capacity) criteria.capacity = { $gte: +capacity }
    console.log(capacity, 'critiria capacity');
    return criteria

}


module.exports = {
    query,
    getById,
    remove,
    update,
    add
}