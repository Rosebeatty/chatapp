// api/index.tsx
// var userId = localStorage.getItem('userId')
// var socket = new WebSocket(`ws://localhost:8080/ws/${userId}`);

import Socket from '../pages/Home'

interface Message {
  (msg: MessageEvent): void,
}

let connectSocket = (cb: Message): void => {
  console.log("connecting");
  // var userID = parseInt(cb.upgradeReq.url.substr(1), 10)

  Socket.onopen = (): void => {
    console.log("Successfully Connected");
  };

  Socket.onmessage = (msg: MessageEvent): void=> {
    cb(msg);
  };

  Socket.onclose = (event: Event): void => {
    console.log("Socket Closed Connection: ", event);
    localStorage.setItem('userId', "")
  };

  Socket.onerror = (error: Event): void => {
    console.log("Socket Error: ", error);
  };
};

let sendMsg = (msg: string): void => {
  console.log("sending msg: ", msg);
  // userId = `?${id}`;
  Socket.send(msg);
};

export { connectSocket, sendMsg };

