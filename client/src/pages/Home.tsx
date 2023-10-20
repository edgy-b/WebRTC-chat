import { useContext } from 'react';
import CreateRoom from '../components/CreateRoom'
import { Context } from '../context/Context';
import VideoPlayer from '../components/VideoPlayer';

const Home: React.FC = () => {
    const { stream } = useContext(Context);
    return (
        <div className="App flex flex-col items-center justify-center w-screen h-screen bg-slate-900">
            { stream && <VideoPlayer stream={ stream } userName='' className="relative" /> }
            <CreateRoom />
        </div>
    )
}

export default Home
