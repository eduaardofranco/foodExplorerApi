const knex = require('../database/knex')

class DishesController {
    async create(request, response) {
        const { name, avatar, price, description, ingredients } = request.body
        const user_id = request.user.id

        return response.json({ name, avatar, price, description, ingredients, user_id })
    }
}

module.exports = DishesController