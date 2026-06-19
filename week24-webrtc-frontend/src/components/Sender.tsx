import { useEffect, useState } from "react"

export function Sender() {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    async function startSendingVideo() {
        if(!socket) return;
        // create an offer
        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.send(JSON.stringify({ type: "createOffer", sdp: pc.localDescription }));

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.type === "createAnswer") {
                pc.setRemoteDescription(data.sdp);
            } 
        }
    }

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000');
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "sender" }));
        }
    }, []);
    return(
        <div className="">
            <p>Sender</p>
            <button onClick={startSendingVideo}>Send video</button>
        </div>
    )
}