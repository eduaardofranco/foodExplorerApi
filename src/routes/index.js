const { Router } = require('express')

const usersRouter = require('./users.routes')
const sessionsRouter = require('./sessions.routes')
const dishesRouter = require('./dishes.routes')
const categoryRouter = require('./category.routes')
const favouritesRoutes = require('./favourites.routes')
const ordersRoutes = require('./orders.routes')

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/dishes', dishesRouter)
routes.use('/category', categoryRouter)
routes.use('/favourites', favouritesRoutes)
routes.use('/orders', ordersRoutes)

module.exports = routes