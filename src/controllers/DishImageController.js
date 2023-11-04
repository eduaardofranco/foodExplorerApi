const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

const diskStorage = new DiskStorage()

class DishImageController {
    async update(request, response) {
        const dish_id = request.params.id
        const imageFilename = request.file.filename
        console.log('teste: ' +request.file)


        const dish = await knex('dishes')
        .where({ id: dish_id }).first()

        if(!dish) {
            throw new AppError('Dish not found', 404)
        }

        if(dish.image) {
            await diskStorage.deleteFile(dish.image)
        }

        const filename = await diskStorage.saveFile(imageFilename)
        dish.image = filename
        
        await knex('dishes').update(dish).where({ id: dish_id})

        return response.json(dish)
    }
}

module.exports = DishImageController