const { Router } = require('express')

const OrdersController = require('../controllers/OrdersController')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const ordersController = new OrdersController()

const ordersRoutes = Router()

ordersRoutes.use(ensureAuthenticated)
ordersRoutes.post('/',  ordersController.create)
ordersRoutes.get('/',  ordersController.index)
ordersRoutes.patch('/:id',  ordersController.update)

module.exports = ordersRoutes