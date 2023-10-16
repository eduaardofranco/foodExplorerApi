const { Router } = require('express')
const DishesController = require('../controllers/DishesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const dishesController = new DishesController()

const dishesRoutes = Router()

dishesRoutes.post('/', ensureAuthenticated ,dishesController.create)

module.exports = dishesRoutes