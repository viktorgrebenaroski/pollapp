const { Model } = require('objection');

class Voters extends Model {
  static get tableName() {
    return 'voters';
  }
}

module.exports = Voters;
