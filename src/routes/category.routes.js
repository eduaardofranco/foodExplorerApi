const { Router } = require('express')
const CategoryController = require('../controllers/CategoryController')

const categoryController = new CategoryController()

const categoryRoutes = Router()
categoryRoutes.post('/', categoryController.create)
categoryRoutes.get('/', categoryController.show)

module.exports = categoryRoutes