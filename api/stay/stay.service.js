const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        stays = stays.map(stay => {
            stay.createdAt = ObjectId(stay._id).getTimestamp()
            return stay
        })
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
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: id }, { $set: { ...stay } })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

// async function add(stay) {
//     try {
//         // peek only updatable fields!
//         const stayToAdd = {
//             // ...stay or do {fieldName, fieldname, ...... }
//         }
//         const collection = await dbService.getCollection('stay')
//         await collection.insertOne(stayToAdd)
//         return stayToAdd
//     } catch (err) {
//         logger.error('cannot insert stay', err)
//         throw err
//     }
// }

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

function _buildCriteria(filterBy = { txt: '', category: 'beach', price: null, bedrooms: null, beds: null, capacity: null }) {
    const criteria = {}
    const { txt, category, price, bedrooms, beds, capacity, hostId } = filterBy
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
    if (price) {
        var newPrice = JSON.parse(price)
        criteria.price = { $gte:parseInt(newPrice.min) , $lte:parseInt(newPrice.max) }
    }
    if (bedrooms) criteria.bedrooms = { $gte: +bedrooms }
    if (beds) criteria.beds = { $gte: +beds }
    if (hostId) {
        criteria["host._id"] = { $eq: hostId }
    }
    return criteria
}


module.exports = {
    query,
    getById,
    remove,
    update,
    add
}