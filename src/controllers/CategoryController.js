const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcryptjs')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

class CategoryController {
    async create(request, response) {
        const { name } = request.body

        //insert category data
        const [category] = await knex('category')
        .returning('*')
        .insert({
            name
        })


        return response.json({ category })
    }

    async show(request, response) {
        const category = await knex('category').select('*')
        
        return response.json(category)
    }
}

module.exports = CategoryController