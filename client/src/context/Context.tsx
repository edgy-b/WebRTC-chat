import { createContext, useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';
import { UsersReducer } from '../stores/UsersReducer';

export const Context = createContext<null | any>(null);
const hostUrl = `http://localhost:${process.env.PORT || 8080}`;
const client = socketIO(hostUrl);

export interface Room {
    roomName: string;
    userName: string;
    password?: string;
    iceServers?: any
}

declare global {
    interface Window {
        rtcpeer:any;
    }
}

const ContextProvider = ({ children }: any) => {
    const navigateTo = useNavigate();
    const audioButtonRef = useRef<HTMLImageElement>(null);
    const videoButtonRef = useRef<HTMLImageElement>(null);
    const [stream, setStream] = useState<MediaStream>();
    const [users, dispatch] = useReducer(UsersReducer, {});
    const [userName, setUserName] = useState('');
    const [rtcPeerConnection, setRtcPeerConnection] = useState<RTCPeerConnection>();
    const [participants, setParticipants] = useState<string[]>();

    const getUsers = ({ participants }: { participants: string[] }) => {
        setParticipants(participants);
        console.log(participants, 'participants');
    }

    const enterRoom = ({ roomName, iceServers, userName } : Room) => {
        // console.log('ROOM NAME: ', roomName, iceServers, ' ice servers', stream, 'stream');
        setUserName(userName);
        navigateTo(`/room/${roomName}`);
    }

    const joinRoom = ({ roomName, password, iceServers, userName }: Room) => {
        setUserName(userName);
        client.emit('user-ready', { roomName });
        // console.log('JOIN ROOM NAME: ', roomName, password, ' ice servers = ', iceServers, stream, 'stream');
    }

    const readyUser = ({ roomName, iceServers }: { roomName: string; iceServers: Object; }) => {
        console.log(roomName, ' roomName', iceServers, 'ice servers on READY USER');
        if (!stream) {
            return;
        }

        const rtcPeerConnection = new RTCPeerConnection(iceServers);
        setRtcPeerConnection(rtcPeerConnection);

        stream.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track);
        });

        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onAddTrack;
        rtcPeerConnection.createOffer()
            .then((sessionDescription) => {
                rtcPeerConnection.setLocalDescription(sessionDescription)
                client.emit('offer', {
                    type: 'offer',
                    sdp: sessionDescription,
                    room: roomName
                })
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        console.log(stream, 'stream beffore setting it up', !stream);

        if (!stream) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true})
                .then((stream) => { setStream(stream) })
                .catch((error) => console.log(error));
        }

        console.log(stream, 'stream after setting it up');
        
        
        client.on('room-created', enterRoom);
        client.on('room-joined', joinRoom);
        client.on('get-users', getUsers);

    }, []);

    const onIceCandidate = (event: any) => {
        console.log(event, ' ==== type of event from on ice candidate');
        
        if (event.candidate) {
            console.log('sending ice candidate');

            client.emit('candidate', {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });          
        }
    }

    const onAddTrack = (event: any) => {
        console.log(event, 'type of Event form on add track');
        console.log(event.streams, 'type of Event form streams');
        
        
        // event.streams[0].getTracks.forEach((track: any) => {
        //     console.log(track);
        // })
    }

    const offerReady = ({ sdp, roomName}: { sdp: RTCSessionDescriptionInit; roomName: string }) => {
        if (!rtcPeerConnection) {
            return;
        }

        if (!stream) {
            return;
        }

        console.log(sdp, 'sdp\n', 'offer ready', typeof sdp);
        

        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onAddTrack;

        console.log(stream, ' --- stream on offer ---');
        

        // stream.getTracks().forEach((track) => {
        //     console.log(track);
        //     rtcPeerConnection.addTrack(track, stream)
        // });

        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdp));

        rtcPeerConnection.createAnswer()
            .then((sessionDescription) => {
                rtcPeerConnection.setLocalDescription(sessionDescription)
                client.emit('answer', {
                    type: 'answer',
                    sdp: sessionDescription,
                    roomName: roomName
                })
            })
            .catch((err) => console.log(err));
    }

    const answerReady = (event: any) => {
        console.log(event, 'event\n', 'answer ready', stream, ' ==== stream ==== ');

        rtcPeerConnection?.setRemoteDescription(new RTCSessionDescription(event));
    }

    useEffect(() => {
        if (!stream) {
            return;
        }

        if (!rtcPeerConnection) {
            return;
        }

        console.log(' ***** settting tracks for stream *****', rtcPeerConnection.getStats());
        

        stream.getTracks().forEach((track) => {
            console.log(' ***** settting track for stream 22 *****');
            rtcPeerConnection.addTrack(track);
        })
    }, [rtcPeerConnection]);

    const onCandidate = (event: any) => {
        console.log(event, ' ON CANDIDATE TRIGGER CLIENT ');
    }

    useEffect(() => {
        if (!stream) {
            return;
        }

        console.log(stream, rtcPeerConnection, ' 1. stream, 2. rtc peer connetection');

        client.on('user-joined', ({ userName, iceServers, roomName }) => {
            console.log(' UUUUUUser joined', userName, roomName);            
            
            // rtcPeerConnection.onicecandidate = onIceCandidate;
            // rtcPeerConnection.ontrack = onAddTrack;

            // console.log(stream.getTracks(), ' ------------ stream tracks ------------------');
            

            // // stream.getTracks().forEach((track) => {
            // //     console.log(track);
            // //     rtcPeerConnection.addTrack(track, stream)
            // // });

            // console.log(rtcPeerConnection, 'rtc after adding tracks');

            // rtcPeerConnection.createOffer()
            //     .then((sessionDescription) => {
            //         rtcPeerConnection.setLocalDescription(sessionDescription)
            //         client.emit('offer', {
            //             type: 'offer',
            //             sdp: sessionDescription,
            //             roomName
            //         })
            //     })
            //     .catch((err) => console.log(err));
        });

        client.on('call', (call) => {

        });
        client.on('offer', offerReady);
        client.on('answer', answerReady);
        client.on('candidate', onCandidate);
    }, [stream, rtcPeerConnection]);

    useEffect(() => {
        client.on('user-ready', readyUser);
    }, []);

    return (
        <Context.Provider value={{ client, stream, userName, audioButtonRef, videoButtonRef }}>
            { children}
        </Context.Provider>
    );
};

export default ContextProvider;

