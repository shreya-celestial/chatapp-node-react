import { useEffect, useState } from "react";
import styles from './styles/SideBar.module.css'

const SideBar = ({ socket, user }) => {
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState(null)

  const handleClick = async (room) => {
    await socket.emit('join_room', { room, user });
  }

  const handleText = async (e) => {
    if (e.key === 'Enter') {
      await socket.emit('new_room', e.target.value)
      e.target.value = ''
    }
  }

  socket.on('room_exists', (err) => {
    setError(err)
  })

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null)
      }, 5000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [error])

  socket.on('rooms_list', (list) => {
    setRooms(list)
  })

  return (
    <>
      <div className={styles.sidebar}>
        <h1><i>Conversations</i></h1>
        <input type="text" placeholder="Create a conversation..." onKeyUp={e => handleText(e)} />
        <div>
          {rooms.length === 0 ? <div className={styles.center}>Start a conversation</div> : rooms.map((room, index) => (
            <h3 key={index} onClick={() => handleClick(room)}>{room}</h3>
          ))}
        </div>
      </div>
      {error && <div className={styles.error}><h4>Alert!</h4>{error.msg}</div>}
    </>
  );
}

export default SideBar;