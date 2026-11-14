import { io } from "socket.io-client";

export const connectSocket = io(
  // process.env.NEXT_PUBLIC_SOCKET_IO_URL,
  {
    autoConnect: false,
    reconnection: false,
    transports: ["websocket"],
  }
);


export const presenseConnection = io(
   process.env.NEXT_PUBLIC_SOCKET_IO_URL,
  {
    autoConnect: false,
    reconnection: false,
    transports: ["websocket"],
    auth: (callback) => {
      callback({
        connectionType: "presense"
      })
    }
  }
)



export const chatConnection = io(
  process.env.NEXT_PUBLIC_SOCKET_IO_URL,
  {
    autoConnect: false,
    reconnection: false,
    transports: ["websocket"],
    auth: (callback) => {
      callback({
        connectionType: "chat"
      })
    }
  }
)