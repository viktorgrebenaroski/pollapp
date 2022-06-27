const { Model } = require('objection');

class Polls extends Model {
  static get tableName() {
    return 'polls';
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const Answers = require('./answers.model');
    // eslint-disable-next-line global-require
    const Voters = require('./voters.model');
    return {
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answers,
        join: {
          from: 'polls.id',
          to: 'answers.pollId'
        },
      },
      voters: {
        relation: Model.HasManyRelation,
        modelClass: Voters,
        join: {
          from: 'polls.id',
          to: 'voters.pollId'
        },
      }
    };
  }
}

module.exports = Polls;
