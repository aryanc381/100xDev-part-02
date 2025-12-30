import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    ws.onopen = () => {
      console.log('Connected to WS');
      setSocket(ws);
    }

    ws.onmessage = (message) => {
      console.log('Received message: ', message.data);
      setMessage(message.data);
    }
  }, []);

  if(!socket) {
    return <div className="">
      Loading...
    </div>
  }

  return (
    <div>
      <div className="">
        {message}
      </div>
      <div className="">
        <input type="text" placeholder='send message' value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={() => {socket.send(input)}}>Send</button>
      </div>
    </div>
  )
}


export default App
