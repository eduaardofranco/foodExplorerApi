const AppError = require("../utils/AppError")
const knex = require('../database/knex')

class OrdersController {
    async create (request, response) {
        
        const user_id  = request.user.id
        const { description } = request.body

        if(!user_id) {
            throw new AppError('User not found', 202)
        }

        const [order_id] = await knex('orders')
        .insert({
            user_id,
            description
        }) 

        return response.json({ order_id })

    }

    async index(request, response) {
        const user_id  = request.user.id

        const orders = await knex('orders')
        .where({ user_id })

        return response.json( orders )
    }

    async update(request, response) {
        const id = request.params.id
        const { status } = request.body
        
        try {
            const [updated_order] = await knex('orders')
            .where({ id })
            .update({ status: status })
            .returning('*')

            if(!updated_order) {
                return response.status(404).json({ error: 'Order not found' });
            }

            return response.json(updated_order)
        } catch (error) {
            console.log('error updating order: ',error)
            throw new AppError('Error updating order status')
        }

    }
}

module.exports = OrdersController