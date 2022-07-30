const orderService = require('./order.service')
const dbService = require('../../services/db.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')

// Tbc onapprove
// async function onApprove(req, res) {
//     try {
//         const order = req.body
//         const guestId = order.by._id
//         order.by._id = guestId
//         const hostId = order.stay.host._id
//         socketService.emitToUser({type: 'order-approved', data: order, userId: guestId})
//     }
//     catch (err) {

//     }
// }

async function getOrder(req, res) {
  try {
    const order = await orderService.getById(req.params.id)
    res.send(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(500).send({ err: 'Failed to get order' })
  }
}

async function getOrders(req, res) {
  try {
    const user = req.query
    const orders = await orderService.query(user)
    // console.log('order controller', orders)
    res.send(orders)
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}
async function addOrder(req, res) {
  // var loggedinUser = authService.validateToken(req.cookies.loginToken)

  try {
    const order = req.body
    const loggedinUser = order.by._id
    order.by._id = loggedinUser
    const hostId = order.stay.host._id
    const addedOrder = await orderService.add(order)
    //   socketService.broadcast({type: 'order-sent', data: order, userId: loggedinUser})
    // emitting order-sent message to only the host of the apartment that was ordered.
    socketService.emitToUser({
      type: 'order-sent',
      data: order,
      userId: hostId,
    })
    res.json(addedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}

async function deleteOrder(req, res) {
  try {
    await orderService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete order', err)
    res.status(500).send({ err: 'Failed to delete order' })
  }
}

async function updateOrder(req, res) {
  try {
    const order = req.body
    const guestId = order.by._id
    order.by._id = guestId
    if (order.status === 'approved') {
      // const hostId = order.stay.host._id
      socketService.emitToUser({
        type: 'order-approved',
        data: order,
        userId: guestId,
      })
    } else if (order.status === 'rejected') {
        socketService.emitToUser({
            type: 'order-rejected',
            data: order,
            userId: guestId,
          })
    }
    const savedOrder = await orderService.update(order)
    res.send(savedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })
  }
}

module.exports = {
  getOrder,
  getOrders,
  addOrder,
  deleteOrder,
  updateOrder,
}
