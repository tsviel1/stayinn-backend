const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getStay, getStays, deleteStay, updateStay, addStay} = require('./stay.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getStays)
router.get('/:id', getStay)
router.put('/:id',  updateStay)
router.post('/', addStay)
// router.post('/', requireAuth, requireAdmin, addStay)

// router.put('/:id',  requireAuth, updateStay)
router.delete('/:id',  requireAuth, requireAdmin, deleteStay)

module.exports = router