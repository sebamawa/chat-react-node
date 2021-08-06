import { useState, useEffect } from "react";

export default function MessagesList ({socket}) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("MsgFromServer", msg => {
            console.log(msg);
            const new_messages = [...messages, msg];
            setMessages(new_messages);
        });
      });

    return (
        <> 
            {messages.map((msg, i) => (
                <p>{msg}</p>
            ))}
        </>
    );
}