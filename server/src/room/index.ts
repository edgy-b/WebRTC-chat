import { Socket } from 'socket.io';

const rooms: Record<string, Record<string, string>> = {};
interface Room {
    roomName: string;
    userName: string;
    password: string;
}

export const roomHandler = (socket: Socket) => {
    const createOrJoinRoom = ({ roomName, password }: Room) => {
        const isCreate = rooms[roomName] ? false : true;
        console.log(rooms, 'rooms', isCreate, roomName);

        if (isCreate) {
            rooms[roomName] = { password };
            socket.emit('room-created', { roomName });
            console.log('room created', roomName);
        } else {
            const { password: roomPassword } = rooms[roomName];

            if (password !== roomPassword) {
                socket.emit('password-not-match');
            } else {
                socket.emit('room-joined', { roomName, password });
                console.log('user joined room', roomName);
            }
        }
    }

    socket.on('create-join', createOrJoinRoom);
}