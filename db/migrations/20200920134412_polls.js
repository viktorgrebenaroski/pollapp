
exports.up = function(knex) {
  return knex.schema.createTable('polls', t => {
    t.increments('id')
    t.string('url')
    t.string('question')
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('polls');
};
