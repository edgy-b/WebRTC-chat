import { Socket } from 'socket.io';

const rooms: Record<string, Record<string, string>> = {};
interface Room {
    roomName: string;
    userName: string;
    password: string;
}

export const roomHandler = (socket: Socket) => {
    const createOrJoinRoom = ({ roomName, userName, password }: Room) => {
        const isCreate = rooms[roomName] ? false : true;
        console.log(rooms, 'rooms', isCreate, roomName);

        if (isCreate) {
            rooms[roomName] = { password };
            socket.emit('room-created', { roomName });
            console.log('room created');
        } else {
            
            socket.emit('room-joined');
            console.log('user joined room', roomName);
        }
    }

    socket.on('create-join', createOrJoinRoom);
}