const AppError = require("../utils/AppError")
const knex = require('../database/knex')

class FavouritesController {
    async create (request, response) {
        
        const dish_id = request.params.id
        const user_id  = request.user.id

        if(!user_id) {
            throw new AppError('User not found', 202)
        }

        const [favourites_id] = await knex('favourites')
        .insert({
            dish_id,
            user_id
        })

        return response.json({ favourites_id })

    }

    async show(request, response) {
        const user_id  = request.user.id

        const favourites = await knex('favourites')
        .where({ user_id })

        return response.json( { favourites })
    }
    async delete(request, response) {
        
        const dish_id = request.params.id
        const user_id  = request.user.id

        await knex('favourites')
        .where({ dish_id })
        .delete()

        return response.json()
    }
}

module.exports = FavouritesController