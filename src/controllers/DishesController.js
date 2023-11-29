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

        //parse ingredients that are coming as a string
        let ingredients_list
        if(ingredients) {
            ingredients_list = JSON.parse(String(ingredients).trim());
        }

        
        const dish = await knex('dishes').where({ id: dish_id }).first()
        
        if (!dish) {
            return new AppError('Dish not found')
        }
        
        //if image was uploaded
        if (request.file) {
            const imageFilename = request.file.filename

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


        if (ingredients_list && ingredients_list.length !== 0) {
            // Delete existing ingredients for the dish
            await knex('ingredients').where({ dish_id }).del();
      
            // Insert the new ingredients
            const allIngredients = ingredients_list.map((ingredient) => {
              return {
                dish_id,
                name: ingredient,
              };
            });
      
            await knex('ingredients').insert(allIngredients);
          }

        return response.json({ updated_dish })
    }


    async show(request, response) {
        const { id } = request.params

        const dish = await knex('dishes').where('id', id).first()
        if(!dish) {
            throw new AppError('Dish not found')
        }
        const ingredients = await knex('ingredients').where('dish_id', id)

        return response.json({
            ...dish,
            ingredients
        })
    }

    async index(request, response) {
        const { nameOrIngredient } = request.query
        let dishes
        
        try {
            dishes = await knex('dishes')
        } catch (error) {
            throw new AppError('Error fetching dishes', error.message)
        }
        
        //if there is parameter on search, search by name or ingredient
        if(nameOrIngredient) {
            // By dish name
            const dishesByName = await knex('dishes')
            .where('name', 'like', `%${nameOrIngredient}%`)
            .orderBy('name')
            .groupBy('name');

    
            
            //by ingredients
            const filteredIngredients  = await knex('ingredients')
            .whereLike('name', `%${nameOrIngredient}%`)
            .orderBy('name')
            .groupBy('name');
            
            let dishesByIngredients
            
            dishesByIngredients = filteredIngredients.map(ingredient => {
                // Buscar prato correspondente ao ingrediente
                const dish = dishes.filter(dish => dish.id === ingredient.dish_id)
                
                return dish
                
            })
        
        const filteredDishes = [
            ...dishesByName,
            ...dishesByIngredients.flat().filter(dish => {
                return !dishesByName.some(d => d.id === dish.id)
            })
        ]
            return response.json(filteredDishes)
        }
        //otherwise, response all dishes
        else {
            return response.json(dishes)
        }
    }


    async delete(request, response) {
        const { id } = request.params
        await knex('dishes').where('id', id).delete()

        return response.json()
    } 
}

module.exports = DishesController