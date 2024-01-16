import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import SideBar from './components/SideBar';
import ChatWind from './components/ChatWind';

const socket = io.connect('http://localhost:5001')
const USERID = uuidv4()

const App = () => {
  return (
    <div className='home'>
      <SideBar socket={socket} user={USERID} />
      <ChatWind socket={socket} user={USERID} />
    </div>
  );
}

export default App;