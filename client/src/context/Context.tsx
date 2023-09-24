import { createContext } from 'react';
import socketIO from 'socket.io-client';

const hostUrl = `http://localhost:${process.env.PORT || 8080}`;
export const Context = createContext<null | any>(null);
const client = socketIO(hostUrl);


const ContextProvider = ({ children }: any) => {
    return (
        <Context.Provider value={{ client }}>
            { children}
        </Context.Provider>
    );
};

export default ContextProvider;

