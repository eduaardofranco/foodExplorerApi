const { Router } = require('express')
const DishesController = require('../controllers/DishesController')

const DisheImageController = require('../controllers/DishImageController')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const multer = require('multer')

const uploadConfig = require('../configs/upload')

const dishesController = new DishesController()
const disheImageController = new DisheImageController()

const upload = multer(uploadConfig.MULTER)

const dishesRoutes = Router()
dishesRoutes.use(ensureAuthenticated)
dishesRoutes.post('/', upload.single('image'),  dishesController.create)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)
dishesRoutes.get('/', dishesController.index)

module.exports = dishesRoutes