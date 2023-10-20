import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import Input from './Input';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const CreateRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);
    const { client } = useContext(Context);
    const navigateTo = useNavigate();

    const alertOnRoom = () => {
        console.log('user tries to join room', password, roomName, error, !error);
        if (!error) {
            setError('Room already exists and password did not match. Enter correct password to join existing room or fill in unique room name to create it.');
            setShow(true);
        }
    }

    const joinOnRoom = ({ roomName }: { roomName: string }) => {
        navigateTo(`/room/${roomName}`);
    }

    const errorOnJoining = (errors: string[]) => {
        if (!error) {
            setError(errors.reduce((acc, err) => acc + err + '\n', ''));
            setShow(true);
        }
    }

    useEffect(() => {
        client.on('room-joined', joinOnRoom);

        return () => {
            setError('');
        }
    }, []);

    useEffect(() => {
        client.on('password-not-match', alertOnRoom);
        client.on('error-joining', errorOnJoining)
    }, [error]);

    const createOrJoin = () => {
        client.emit('create-join', { roomName, userName, password });
    }

    const hideModal = () => {
        setShow(false);
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg mt-8">
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
            <button onClick={ createOrJoin } className="w-full rounded-lg p-4 bg-green-700 hover:bg-green-600">
                Join or create room
            </button>
            {
                error && <Modal show={ show } handleClose={ hideModal }>
                    { error }
                </Modal>
            }
        </div>
    );
}

export default CreateRoom;

