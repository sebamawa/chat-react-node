
import Chat from './components/Chat';

import { useEffect, useState } from 'react';
// import io from 'socket.io-client';
import socketIOClient from 'socket.io-client';


const ENDPOINT = "http://localhost:4000";

function App() {
  const socket = socketIOClient(ENDPOINT);

  // el estado son los mensajes del chat. Se pasan como props a los hijos
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('whatsappweb-message', data => {
      const msg = {...data};
      console.log(data);
      setMessages([...messages, msg]);
    });
    socket.on("MsgFromServer", data => {
      const msg = {...data};
      setMessages([...messages, msg]);
    });
  });

  return (
    <>
      <Chat socket={socket} messages={messages}
        onRemoveMessage={id => {
          const newMesseges = messages.filter(msg => msg.id !== id);
          setMessages(newMesseges);
        }}
      />
    </>
  );
}

export default App;
