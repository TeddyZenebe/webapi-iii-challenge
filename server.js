const express = require('express');
const userRouter = require('./users/userRouter')
const server = express();

server.use(express.json())
server.use(logger)
server.use('/api/users', userRouter)


server.get('/', (req, res) => {
  res.send(`<h2>This is Teddy's first API!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const time = new Date()
  console.log(req.method, time, `http://localhost:4000${req.originalUrl}`)
  next()
};

module.exports = server;
