
exports.up = knex => knex.schema.createTable('dishes', table => {
    table.increments('id')
    table.text('name')
    table.text('avatar').nullable()
    table.decimal('price', 10, 2).notNullable();
    table.text('description')
    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
    table.integer('user_id').references('id').inTable('users').onDelete('cascade')
})
  
exports.down = knex => knex.schema.dropTable('dishes')
