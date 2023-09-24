import { createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';

export const Context = createContext<null | any>(null);
const hostUrl = `http://localhost:${process.env.PORT || 8080}`;
const client = socketIO(hostUrl);

export interface Room {
    roomName: string;
    password?: string;
}

const ContextProvider = ({ children }: any) => {
    const navigateTo = useNavigate();

    const enterRoom = ({ roomName } : Room) => {
        console.log('ROOM NAME: ', roomName);
        navigateTo(`/room/${roomName}`);
    }

    const joinRoom = ({ roomName, password }: Room) => {
        console.log('JOIN ROOM NAME: ', roomName, password);
    }

    useEffect(() => {
        console.log('use effect work');
        
        client.on('room-created', enterRoom);
        client.on('room-joined', joinRoom);
    }, []);

    return (
        <Context.Provider value={{ client }}>
            { children}
        </Context.Provider>
    );
};

export default ContextProvider;

