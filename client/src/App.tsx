import { useEffect } from 'react';
import socketIO from 'socket.io-client';

const hostUrl = `http://localhost:${process.env.PORT || 8080}`;

function App() {
    useEffect(() => {
        socketIO(hostUrl);
    }, []);

    return (
        <div className="App">
            <button className="">Start new meeting</button>
        </div>
    );
}

export default App;
