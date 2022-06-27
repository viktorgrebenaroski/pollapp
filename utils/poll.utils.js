const Polls = require('../models/polls.model');

const getPollId = async (pollUrl) => {
  const pollId = await Polls.query().select('id').where('url', pollUrl).first();
  return pollId;
};

module.exports = {
  getPollId,
};
