import { useParams } from 'react-router-dom';

const Room: React.FC = () => {
    const { roomName } = useParams<string>();

    return (
        <div>
            Room name { roomName }
        </div>
    );
}

export default Room;
