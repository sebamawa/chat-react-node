import { useState, useEffect } from "react";
import Message from "./Message";

export default function MessagesList ({messages = [], onRemoveMsg = f => f}) {
    // los mensajes se pasan desde App.js como prop
    // const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     socket.on("MsgFromServer", msg => {
    //         console.log(msg);
    //         const new_messages = [...messages, msg];
    //         setMessages(new_messages);
    //     });
    //   });

    if (!messages.length) return <p>No hay mensajes aun.</p>;
    return (
        messages.map((msg, i) => (
               <p key={i}>
                    <Message {...msg} onRemove={onRemoveMsg} /> 
               </p>
           ))
    );
}