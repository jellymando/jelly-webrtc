import io from "socket.io-client";

export const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("%csocket is connected", "color:red");
});

socket.on("disconnect", () => {
  console.log("%csocket is disconnected", "color:red");
});

socket.on("message", (message) => {
  console.log("message", message);
});
