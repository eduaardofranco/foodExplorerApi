exports.up = knex => knex.schema.createTable('orders', table => {
    table.increments('id')
    table.text('description')
    table.enu('status', ['pending', 'preparing', 'delivered']).default('pending')
    table.integer('user_id').references('id').inTable('users')
    table.timestamp('created_at').default(knex.fn.now())
    

})
exports.down = knex => knex.schema.dropTable('orders')