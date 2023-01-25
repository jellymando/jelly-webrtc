import io from "socket.io-client";

export const socket = io("http://localhost:3030");

socket.on("connect", () => {
  console.log("%csocket is connected", "color:red");
});

socket.on("disconnect", () => {
  console.log("%csocket is disconnected", "color:red");
});

socket.onAny((event, payload) => {
  console.log("socket recieve", event, payload);
});
