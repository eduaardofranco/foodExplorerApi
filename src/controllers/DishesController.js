const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class DishesController {
    async create(request, response) {
        const { name, avatar, price, description, ingredients } = request.body
        const user_id = request.user.id

        if(!name) {
            throw new AppError('Name is required')
        }
        if(!avatar) {
            throw new AppError('Avatar is required')
        }
        if(!price) {
            throw new AppError('Price is required')
        }
        if(!description) {
            throw new AppError('Description is required')
        }
        if(!ingredients) {
            throw new AppError('Ingredients is required')
        }
        
        const [dish_id] = await knex('dishes')
        .insert({
            name: name,
            avatar: avatar,
            price: price,
            description: description,
            user_id: user_id
        })

        const ingredientsList = ingredients.map(ingredient => {
            return {
                dish_id,
                name: ingredient
            }
         })

         await knex('ingredients').insert(ingredientsList)


        return response.json()
    }
}

module.exports = DishesController