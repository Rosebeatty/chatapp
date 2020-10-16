// api/index.js
var socket = new WebSocket("ws://localhost:8080/ws");

interface Message {
 (msg: MessageEvent): void
}

let connectSocket = (cb: Message): void => {
  console.log("connecting");

  socket.onopen = (): void => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg: MessageEvent): void=> {
    console.log(cb);
    cb(msg);
  };

  socket.onclose = (event: Event): void => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = (error: Event): void => {
    console.log("Socket Error: ", error);
  };
};

let sendMsg = (msg: string): void => {
  console.log("sending msg: ", msg);
  socket.send(msg);
};

export { connectSocket, sendMsg };

