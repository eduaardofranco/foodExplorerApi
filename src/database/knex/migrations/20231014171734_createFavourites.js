exports.up = knex => knex.schema.createTable('favourites', table => {
    table.increments('id')
    table.integer('user_id').references('id').inTable('users').onDelete('cascade')
    table.integer('dish_id').references('id').inTable('dishes').onDelete('cascade')
    table.timestamp('created_at').default(knex.fn.now())
    

})
exports.down = knex => knex.schema.dropTable('favourites')