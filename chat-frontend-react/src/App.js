
import Chat from './components/Chat';

import { useEffect, useState } from 'react';
// import io from 'socket.io-client';
import socketIOClient from 'socket.io-client';
import MessagesList from './components/MessagesList';




const ENDPOINT = "http://localhost:4000";

function App() {
  // const [response, setResponse] = useState("");
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    // const socket = socketIOClient(ENDPOINT);
    // socket.on("MsgFromServer", data => {
    //   setResponse(data);
    // });
  });

  return (
    <>
      <MessagesList socket={socket}/>
      <Chat socket={socket}/>
    </>
  );
}

export default App;
