import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../context/Context';
import VideoPlayer from '../components/VideoPlayer';


const Room: React.FC = () => {
    const { roomName } = useParams<string>();
    const navigateTo = useNavigate();
    const { client, stream, userName } = useContext(Context);
    const onRoomJoin = ({ roomName, userName }: { roomName: string, userName: string }) => {
        console.log(roomName, userName, '---------- room nam and username');
    }

    const enterRoom = () => {
        console.log('========= log from room page ========');
        
    }

    useEffect(() => {
        if (!userName) {
            navigateTo('/')
        }

        // console.log(client, 'client\n', stream, 'stream\n', userName);
        
        client.on('room-joined', onRoomJoin);
        client.on('room-created', enterRoom);
    }, []);

    return (
        <div>
            <div>
                Room name { roomName }
            </div>
            <VideoPlayer stream={ stream } userName={ userName } className="relative" />
        </div>
    );
}

export default Room;
