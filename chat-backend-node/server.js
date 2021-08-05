import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
import { Server } from 'socket.io';
const io = new Server(server, {cors: {origin: "*", methods: ["GET", "POST"]}});

io.on('connection', (socket) => {
    console.log('Socket connected');
    socket.emit('MsgFromServer', 'Gracias por conectarse');

    socket.on("msg", (data) => {
        console.log(data);
    });
});





server.listen(4000, () => {
    console.log('server listening on port 4000');
});