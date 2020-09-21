const { nanoid } = require('nanoid');

const Polls = require('../models/polls.model');

const createPoll = async (pollObj) => {
  const pollId = nanoid(12);
  const { answers, question } = pollObj;
  const poll = await Polls.query().insert({
    url: pollId,
    question
  });
  await Polls.relatedQuery('answers').for(poll.id).insert(answers);
  return pollId;
};

const getPollStats = async (pollId) => {
  const pollInfo = await Polls.query().where('url', pollId).select('id', 'question',
    Polls.relatedQuery('answers')
      .sum('votes')
      .as('numberOfVotes'),
    Polls.relatedQuery('answers')
      .count()
      .as('numberOfAnswers')).first();
  const pollAnswers = await pollInfo.$relatedQuery('answers').orderBy('id', 'ASC');
  const pollResult = {
    question: pollInfo.question,
    answers: pollAnswers,
    allvotes: pollInfo.numberOfVotes,
    allAnswers: pollInfo.numberOfAnswers
  };
  return pollResult;
};

const pollVote = async (pollid, answer, usercookie) => {
  const pollInfo = await Polls.query().select('id').where('url', pollid).first();
  const pollAnswers = await pollInfo.$relatedQuery('answers').orderBy('id', 'ASC');
  await pollInfo.$relatedQuery('answers').patch({
    votes: pollAnswers[answer].votes + (1)
  }).where('id', pollAnswers[answer].id);
  await pollInfo.$relatedQuery('voters').insert({
    usrcookie: usercookie
  });
};

const hasVoted = async (pollid, cookieusr) => {
  const pollId = await Polls.query()
    .select('id')
    .where('url', pollid)
    .first();

  const hasVote = await Polls.relatedQuery('voters').for(pollId.id).where({
    usrcookie: cookieusr
  }).first();

  if (hasVote) {
    return true;
  }
  return false;
};
const getPollInfo = async (pollid) => {
  const pollInfo = await Polls.query().where('url', pollid).select('id', 'question').first();
  const pollAnswers = await pollInfo.$relatedQuery('answers').select('answer').orderBy('id', 'ASC');
  delete pollInfo.id;
  const pollReturn = {
    info: pollInfo,
    answers: pollAnswers
  };
  return pollReturn;
};

module.exports = {
  createPoll,
  getPollStats,
  pollVote,
  hasVoted,
  getPollInfo
};
