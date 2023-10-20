import { useContext, useEffect, useRef } from 'react'
import { Context } from '../context/Context';

const VideoPlayer: React.FC<{stream: MediaStream; userName: string; className?: string;}> = ({ stream, userName, className }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { audioButtonRef, videoButtonRef } = useContext(Context);

    const findTrack = (needle: string) => {
        return stream.getTracks().find((track) => track.kind === needle);
    }

    const toggleMicrophone = () => {
        const audioTrack = findTrack('audio');

        if (!audioTrack || !audioButtonRef.current) {
            return;
        }

        if (audioTrack.enabled) {
            audioTrack.enabled = false;
            audioButtonRef.current.src = '/mic-off.svg';
        } else {
            audioTrack.enabled = true;
            audioButtonRef.current.src = '/mic-on.svg';
        }
    }

    const toggleCamera = () => {
        const videoTrack = findTrack('video');

        if (!videoTrack || !videoButtonRef.current) {
            return;
        }

        if (videoTrack.enabled) {
            videoTrack.enabled = false;
            videoButtonRef.current.src = '/eye-off.svg';
        } else {
            videoTrack.enabled = true;
            videoButtonRef.current.src = '/eye-on.svg';
        }
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        if (!stream) {
            return;
        }

        const audio = findTrack('audio');
        const video = findTrack('video');

        if (audio?.enabled) {
            audioButtonRef.current.src = '/mic-on.svg';
        } else {
            audioButtonRef.current.src = '/mic-off.svg';
        }

        if (video?.enabled) {
            videoButtonRef.current.src = '/eye-on.svg';
        } else {
            videoButtonRef.current.src = '/eye-off.svg';
        }
    }, [stream])

    return (
        <div className={ className }>
            <span className="absolute text-gray-100">{ userName }</span>
            <video className="rounded-lg" ref={ videoRef } autoPlay playsInline>VideoPlayer</video>
            <div className="flex gap-x-2 absolute left-1/2 -translate-x-1/2 bottom-[20px]">
                <div
                  className="hover:cursor-pointer flex place-items-center place-content-center rounded-full bg-green-600 h-[60px] w-[60px] hover:bg-gray-800"
                  onClick={ toggleMicrophone }
                >
                    <img ref={ audioButtonRef } src={ "/mic-on.svg" } className="h-[26px] w-[26px]"/>
                </div>
                <div
                  className="hover:cursor-pointer flex place-items-center place-content-center rounded-full bg-green-600 h-[60px] w-[60px] hover:bg-gray-800"
                  onClick={ toggleCamera }
                >
                    <img ref={ videoButtonRef } src={ "/eye-on.svg" } className="h-[26px] w-[26px]" />
                </div>
                { userName && <a className="hover:cursor-pointer flex place-items-center place-content-center rounded-full bg-red-500 h-[60px] w-[60px] hover:bg-red-700">
                    <img src={ "/phone-off.svg" } className="h-[26px] w-[26px]" />
                </a> }
            </div>
        </div>
    );
}

export default VideoPlayer