import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import Input from './Input';

const CreateRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { client } = useContext(Context);

    const createOrJoin = () => {
        client.emit('create-join', { roomName, userName, password });
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg">
            <div>
                <Input
                  name="room"
                  label="Room name:"
                  inputType="text"
                  value={ roomName }
                  callback={ setRoomName }
                  className="pb-6"
                />
                <Input
                  name="username"
                  label="Your user name:"
                  inputType="text"
                  value={ userName }
                  callback={ setUserName }
                  className="pb-6"
                />
                <Input
                  name="password"
                  label="Room password:"
                  inputType="password"
                  value={ password }
                  callback={ setPassword }
                  className="pb-6"
                />
            </div>
            <button onClick={ createOrJoin } className="w-full rounded-lg p-4 bg-green-700">
                Join or create room
            </button>
        </div>
        
    );
}

export default CreateRoom;

