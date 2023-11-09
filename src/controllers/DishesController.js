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

        if(!imageFilename) {
            throw new AppError('Image is required')
        }
        if(!name) {
            throw new AppError('Name is required')
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

    async update(request, response) {
        const { image, name, category_id, ingredients, price, description } = request.body
        const dish_id = request.params.id
       
        const imageFilename = request.file.filename
        
        const dish = await knex('dishes').where({ id: dish_id }).first()
        
        if (!dish) {
            return new AppError('Dish not found')
        }
        
        if (imageFilename) {

            const diskStorage = new DiskStorage()
            
            //if dish has image, delete it
            if(dish.image) {
                const deleted = await diskStorage.deleteFile(dish.image)
            }
            //will return name with hash
            const fileName = await diskStorage.saveFile(imageFilename)

            dish.image = fileName
        }
        

        const updated_dish = await knex('dishes')
        .where({ id: dish_id })
        .update({
            image: dish.image,
            name,
            category_id,
            price,
            description,
            updated_at: knex.fn.now()
        })


        if (ingredients && ingredients.length !== 0) {
            // Delete existing ingredients for the dish
            await knex('ingredients').where({ dish_id }).del();
      
            // Insert the new ingredients
            const listIngredients = ingredients.map((ingredient) => {
              return {
                dish_id,
                name: ingredient,
              };
            });
      
            await knex('ingredients').insert(listIngredients);
          }

        return response.json({ updated_dish })
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