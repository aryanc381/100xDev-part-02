import { useEffect, useRef } from "react"

export function Receiver() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        let pc: RTCPeerConnection | null = null;

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "receiver" }))
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if(message.type === 'createOffer') {
                pc = new RTCPeerConnection();
                pc.setRemoteDescription(message.sdp);

                pc.onicecandidate = (event) => {
                    console.log(event);
                    if(event.candidate) {
                        socket.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
                    }
                }

                pc.ontrack = (event) => {
                    console.log(event);
                    if(videoRef.current) {
                        videoRef.current.srcObject = new MediaStream([event.track]);
                    }
                }

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({ type: "createAnswer", sdp: pc.localDescription }))
            } else if(message.type === "iceCandidate") {
                pc?.addIceCandidate(message.candidate);
            }
        }
    }, []);
    return(
        <div className="">
            <p>Receiver</p>
            <video ref={videoRef} autoPlay playsInline></video>
        </div>
    )
}