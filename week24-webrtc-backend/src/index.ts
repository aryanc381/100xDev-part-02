 /* 
  1. Sender connects to WebSocket server
  2. Sender sends { type: "sender" }

  3. Receiver connects to WebSocket server
  4. Receiver sends { type: "receiver" }

  5. Sender creates WebRTC offer
  6. Sender sends offer to WebSocket server
  7. Server forwards offer to receiver

  8. Receiver creates WebRTC answer
  9. Receiver sends answer to WebSocket server
  10. Server forwards answer to sender

  11. Both sides send ICE candidates
  12. Server forwards candidates between them

  13. WebRTC connection is established
*/

import WebSocket = require("ws");

const wss = new WebSocket.WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    if (message.type === 'sender') {
      senderSocket = ws;
      console.log("sender set");
    } else if (message.type === 'receiver') {
      receiverSocket = ws;
      console.log("receiver set");
    } else if (message.type === 'createOffer') {
      if (ws !== senderSocket) {
        return;
      }
      console.log("offer received");
      receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
    } else if (message.type === 'createAnswer') {
        if (ws !== receiverSocket) {
          return;
        }
        console.log("answer received");
        senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
    } else if (message.type === 'iceCandidate') {
      if (ws === senderSocket) {
        receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      } else if (ws === receiverSocket) {
        senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      }
    }
  });
});