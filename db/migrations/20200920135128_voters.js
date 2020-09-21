
exports.up = function(knex) {
  return knex.schema.createTable('voters', t => {
    t.increments('id');
    t.string('usrcookie');
    t.integer('pollId').index().unsigned()

    t.foreign('pollId').references('id').inTable('polls');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('voters');
};
