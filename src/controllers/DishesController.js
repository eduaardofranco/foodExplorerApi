const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class DishesController {
    async create(request, response) {

        const { name, price, description, ingredients, category } = request.body
        
        const user_id = request.user.id
        //image variable from request.file
        const imageFilename = request.file.filename

        const diskStorage = new DiskStorage()

        if(!name) {
            throw new AppError('Name is required')
        }
        if(!imageFilename) {
            throw new AppError('Image is required')
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

        //will return name with hash
        const fileName = await diskStorage.saveFile(imageFilename)
        
        const [dish_id] = await knex('dishes')
        .insert({
            name,
            image: fileName,
            price,
            description,
            user_id,
            category_id: category
        })

        if(ingredients.length !== 0) {
            const ingredientsList = ingredients.map(ingredient => {
                return {
                    dish_id,
                    name: ingredient
                }
             })
    
             await knex('ingredients').insert(ingredientsList)
        }




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
        
        let dishes
        
        if(ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())

            dishes = await knex('ingredients')
            .select([
                'dishes.id',
                'dishes.name'
            ])
            .whereIn('ingredients.name', filterIngredients)
            .whereLike('dishes.name', `%${name}%`)
            .innerJoin('dishes', 'dishes.id', 'ingredients.dish_id')
            .orderBy('dishes.name')

        } else {
            dishes = await knex('dishes')
            .whereLike('name', `%${name}%`)
            .orderBy('name')
        }

        const allIngredients = await knex('ingredients')
        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredients = allIngredients.filter(ingredient => ingredient.dish_id === dish.id)

            return {
                ...dish,
                ingredients: dishIngredients
            }
        })
       

        return response.json(dishesWithIngredients)
    }


    async delete(request, response) {
        const { id } = request.params
        await knex('dishes').where('id', id).delete()

        return response.json()
    }
}

module.exports = DishesController