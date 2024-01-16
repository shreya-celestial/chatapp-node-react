import { useEffect, useRef, useState } from "react";
import styles from './styles/ChatWind.module.css';
import moment from 'moment'

let roomRef = null
const ChatWind = ({ socket, user }) => {
  const [curRoom, setCurRoom] = useState(null)
  const [chats, setChats] = useState([]);
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("User's Name")

  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [chats]);

  socket.on('room_user', (data) => {
    if (data.user === user) {
      setCurRoom(data.room)
      roomRef = data.room
    }
  })

  socket.on('room_messages', (data) => {
    if (data.room === curRoom) {
      setChats(data.msgs)
    }
  })

  socket.on('receive_messages', (data) => {
    if (data.room === roomRef) {
      setChats(data.msgs)
    }
  })

  const handleMessage = async (e) => {
    e.preventDefault();
    const msg = e.target.elements.message.value;
    if (msg.trim()) {
      const data = {
        userId: user,
        message: msg,
        name: username,
        room: curRoom,
        timestamp: moment().format()
      }
      await socket.emit('send_message', data)
      const arr = [...chats, data];
      setChats(arr)
      e.target.elements.message.value = ''
    }
  }

  return (
    <div className={styles.chatWindow}>
      {curRoom ? <>
        <div>
          <div className={styles.headings}>
            <h1>{curRoom}</h1>
            {!isEditing && <h3 onClick={() => setIsEditing(true)}>{username}</h3>}
            {isEditing && <input
              type="text"
              value={username}
              placeholder="Enter a username"
              onChange={e => setUsername(e.target.value)}
              onBlur={() => {
                if (username) {
                  setIsEditing(false)
                } else {
                  setIsEditing(false)
                  setUsername("User's Name")
                }
              }}
            />}
          </div>
          <div className={styles.window}>
            {chats.length === 0 ? '' : chats.map((chat, index) => (
              <div key={index} className={chat.userId === user ? styles.mine : ''}>
                {chat.message}
                <br />
                <h6>
                  {chat.userId === user ? <span>
                    {moment(chat.timestamp).format('YYYY MM DD') === moment().format('YYYY MM DD') ? moment(chat.timestamp).format('h:mm a') : moment(chat.timestamp).format("MMMM Do, h:mm a")}
                  </span> : ''}
                  {chat.userId === user ? 'You' : chat.name}
                  {chat.userId !== user ? <span>
                    {moment(chat.timestamp).format('YYYY MM DD') === moment().format('YYYY MM DD') ? moment(chat.timestamp).format('h:mm a') : moment(chat.timestamp).format("MMMM Do, h:mm a")}
                  </span> : ''}
                </h6>
              </div>
            ))}
            <br ref={messagesEndRef} />
          </div>
        </div>
        <form onSubmit={handleMessage}>
          <input type="text" placeholder="Enter your message here..." name="message" />
          <button>Send</button>
        </form>
      </> : <div className={styles.centre}><h4>Please select a conversation to chat</h4></div>}
    </div>
  );
}

export default ChatWind;