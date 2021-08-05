import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import "../components/Chat.css";
import { useState } from 'react';

export default function Chat({socket}) {
    // mensaje a enviar en el input del form
    const [message, setMessage] = useState("");

    const sendMessageSkt = (event, socket) => {
        console.log(event);
        event.preventDefault();
        console.log(`Msg enviado al servidor: ${message}`);
        socket.emit('msg', message);
        setMessage("");
    }

    return (
        <>
            <div className="chat">
                <form onSubmit={event => sendMessageSkt(event, socket)} >
                    <input
                        type="text"
                        value={message}
                        placeholder="write a message ..."
                        onChange={event => setMessage(event.target.value)}
                        required
                    />
                    <button>Send</button>
                </form>
            </div>
        </>
    );
}