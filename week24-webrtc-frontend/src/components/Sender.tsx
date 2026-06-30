import { useEffect, useRef, useState } from "react"

export function Sender() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    async function startSendingVideo() {
        if(!socket) return;
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            console.log('onnegotiationneeded')
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({ type: "createOffer", sdp: pc.localDescription }));
        }

        pc.onicecandidate = (event) => {
            console.log(event)
            if(event.candidate) {
                socket.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
            }
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.type === "createAnswer") {
                pc.setRemoteDescription(data.sdp);
            } else if(data.type === "iceCandidate") {
                pc.addIceCandidate(data.candidate);
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        pc.addTrack(stream.getVideoTracks()[0]);
        if(videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "sender" }));
        }
        setSocket(socket);
    }, []);
    return(
        <div className="">
            <p>Sender</p>
            <video ref={videoRef} autoPlay playsInline muted></video>
            <button onClick={startSendingVideo}>Send video</button>
        </div>
    )
}