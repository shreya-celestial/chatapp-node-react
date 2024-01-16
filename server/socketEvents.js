let rooms = [];
const messages = []

const events = (socket) => {

  socket.emit('rooms_list', rooms)

  socket.on('new_room', (roomName) => {
    const found = rooms.find((room) => room === roomName)
    if (!found) {
      rooms.push(roomName)
      socket.emit('rooms_list', rooms)
      socket.broadcast.emit('rooms_list', rooms)
    }
    else {
      const err = {
        msg: `Conversation with name "${roomName}" already exists!`
      }
      socket.emit('room_exists', err)
    }
  })

  socket.on('join_room', async (data) => {
    socket.join(data.room)
    await socket.emit('room_user', data)
    const roomMsgs = messages.filter((msg) => msg.room === data.room)
    socket.emit('room_messages', { room: data.room, msgs: roomMsgs })
  })

  socket.on('send_message', (data) => {
    messages.push(data)
    const roomMsgs = messages.filter((msg) => msg.room === data.room)
    socket.to(data.room).emit('receive_messages', { room: data.room, msgs: roomMsgs })
  })
}

module.exports = events