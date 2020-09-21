const { Model } = require('objection');

class Answers extends Model {
  static get tableName() {
    return 'answers';
  }
}

module.exports = Answers;
