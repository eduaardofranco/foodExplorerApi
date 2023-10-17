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
    async show(request, response) {
        const { id } = request.params

        const dish = await knex('dishes').where('id', id).first()
        const ingredients = await knex('ingredients').where('dish_id', id)

        return response.json({
            ...dish,
            ingredients
        })
    }

    async index(request, response) {
        const { name, ingredients } = request.query
        const user_id = request.user.id
        
        let dishes
        
        if(ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())
            
            dishes = await knex('ingredients')
            .whereIn('name', filterIngredients)

        } else {
            dishes = await knex('dishes')
            .where({ user_id })
            .whereLike('name', `%${name}%`)
            .orderBy('name')
        }
       

        return response.json(dishes)
    }


    async delete(request, response) {
        const { id } = request.params
        await knex('dishes').where('id', id).delete()

        return response.json()
    }
}

module.exports = DishesController