import { Socket } from 'socket.io';
import { iceServers } from '../configs';

const rooms: Record<string, RoomInfo> = {};

interface RoomInfo {
    password: string
    users: string[]
}
interface Room {
    roomName: string;
    userName: string;
    password: string;
}

export const roomHandler = (socket: Socket) => {
    const leaveRoom = ({ roomName, userName }: { roomName: string, userName: string }) => {
        rooms[roomName].users = rooms[roomName]?.users?.filter((name) => name !== roomName);
        socket.to(roomName).emit('user-disconnected', userName);
    }

    const createOrJoinRoom = ({ roomName, userName, password }: Room) => {
        const isCreate = rooms[roomName] ? false : true;
        console.log(rooms, '====== rooms ======\n');
        const errors = [];

        if (!roomName) {
            errors.push('Room name must be entered.');
        }

        if (!userName) {
            errors.push('User name must be entered.');
        }

        if (!password) {
            errors.push('Password must be entered.');
        }

        if (errors.length === 0) {
            if (isCreate) {
                rooms[roomName] = { password, users: [userName] };
                socket.join(roomName);
                socket.emit('room-created', { roomName, iceServers, userName });
                console.log('room created', roomName, ' ---- rooms ----',  rooms);
            } else {
                const { password: roomPassword, users } = rooms[roomName];

                if (password !== roomPassword) {
                    socket.emit('password-not-match');
                } else {
                    users.push(userName);
                    socket.emit('room-joined', { roomName, password, iceServers, userName });
                    socket.join(roomName);
                    socket.to(roomName).emit('user-joined', { userName, iceServers, roomName });
                    socket.emit('get-users', { roomName, participants: users })
                    console.log('user joined room', roomName);
                }
            }
        } else {
            socket.emit('error-joining', errors);
        }

        socket.on('disconnect', () => {
            console.log('user disconnected in create or join');
            leaveRoom({ roomName, userName });
        });
    }

    socket.on('create-join', createOrJoinRoom);

    socket.on('user-ready', ({ roomName }) => {
        console.log(' USER READY on room: ', roomName);

        socket.to(roomName).emit('user-ready', { roomName, iceServers });
    });

    socket.on('candidate', (event) => {
        console.log('candidate triggered', event, 'event from candidate trigger');

        socket.to(event.roomName).emit('candidate', event);
    });

    socket.on('offer', ({ roomName, sdp }) => {
        console.log('offer event trigger', roomName, sdp);

        socket.to(roomName).emit('offer', { sdp, roomName });
    });

    socket.on('answer', ({ roomName, sdp }) => {
        console.log('answer event trigger', roomName, sdp);

        socket.to(roomName).emit('answer', sdp);
    });
}