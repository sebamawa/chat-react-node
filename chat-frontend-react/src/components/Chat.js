import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../components/Chat.css";
import { useState } from 'react';
import MessagesList from './MessagesList';

export default function Chat({socket, messages, onRemoveMessage = f => f}) {
    // mensaje a enviar en el input del form
    const [message, setMessage] = useState("");

    const sendMessageToServerSkt = (event, socket) => {
        console.log(event);
        event.preventDefault();
        console.log(`Msg enviado al servidor: ${message}`);
        socket.emit('msgFromMe', message);
        setMessage("");
    }

    return (
        <>
            <Card bg="warning"  border="primary" style={{ width: '30rem', height: '50rem' }} >
                <Card.Header>CHAT</Card.Header>
                <Card.Body>
                    {/* <Card.Text> */}
                    <MessagesList messages={messages} onRemoveMsg={onRemoveMessage}/>
                        <div className="chat">
                            <form onSubmit={event => sendMessageToServerSkt(event, socket)} >
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
                    {/* </Card.Text> */}
                </Card.Body>
            </Card>
        </>
    );
}