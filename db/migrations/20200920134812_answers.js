
exports.up = function(knex) {
  return knex.schema.createTable('answers', t => {
    t.increments('id')
    t.integer('pollId').index().unsigned()
    t.string('answer')
    t.integer('votes').defaultTo('0');
    t.foreign('pollId').references('id').inTable('polls');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('answers');
};
