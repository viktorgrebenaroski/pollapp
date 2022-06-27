const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const {
  createPoll,
  getPollStats,
  pollVote,
  hasVoted,
  getPollInfo
} = require('./utils/polls');

require('./db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cookieParser());

app.use((req, res, next) => {
  const cookieUsr = req.cookies._pusr;
  if (cookieUsr === undefined) {
    res.cookie('_pusr', uuidv4(), { maxAge: 9000000, httpOnly: true });
  }
  return next();
});

app.use(express.static(path.join(__dirname, 'public')));
let cookiesUsr;
io.on('connection', (socket) => {
  if (socket.handshake.headers.cookie) {
    cookiesUsr = cookie.parse(socket.handshake.headers.cookie);
  }

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    const hasVote = await hasVoted(roomId, cookiesUsr._pusr);
    if (hasVote) {
      socket.emit('pollSetStats', await getPollStats(roomId));
    } else {
      socket.emit('pollSet', await getPollInfo(roomId));
    }
  });
  socket.on('createPoll', async (poll) => {
    const pollid = await createPoll(poll);
    socket.emit('createPoll', pollid);
  });
  socket.on('pollVote', async (vote) => {
    await pollVote(vote.pollId, vote.answer, cookiesUsr._pusr);
    socket.emit('pollSetStats', await getPollStats(vote.pollId));
    io.to(vote.pollId).emit('pollStats', await getPollStats(vote.pollId));
  });
});

const PORT = process.env.PORT || 3000;

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
