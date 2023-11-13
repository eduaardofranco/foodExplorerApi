const { Router } = require('express')
const FavouritesController = require('../controllers/FavouritesController')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const favouritesController = new FavouritesController()

const favouritesRoutes = Router()
favouritesRoutes.use(ensureAuthenticated)
favouritesRoutes.post('/:id',  favouritesController.create)
favouritesRoutes.get('/',  favouritesController.show)
favouritesRoutes.delete('/:id',  favouritesController.delete)

module.exports = favouritesRoutes