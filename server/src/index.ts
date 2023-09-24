import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { roomHandler } from './room';

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('user is connected');

    roomHandler(socket);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log('listening to server');
});

