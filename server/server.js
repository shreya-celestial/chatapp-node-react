const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const events = require('./socketEvents')
const { Server } = require('socket.io')

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`${socket.id} connected!`)
  events(socket)
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected!`)
  })
})

server.listen(5001, () => {
  console.log('Listening on http://localhost:5001/');
})