
import Chat from './components/Chat';

import { useEffect, useState } from 'react';
// import io from 'socket.io-client';
import socketIOClient from 'socket.io-client';
import MessagesList from './components/MessagesList';




const ENDPOINT = "http://localhost:4000";

function App() {
  const socket = socketIOClient(ENDPOINT);

  // el estado son los mensajes del chat. Se pasan como props a los hijos
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("MsgFromServer", msg => {
      setMessages([...messages, msg]);
    });
  });

  return (
    <>
      <MessagesList messages={messages}/>
      <Chat socket={socket}/>
    </>
  );
}

export default App;
