const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {
  // socket.join("jelly room");

  socket.on("sendMessage", (message) => {
    // 본인을 제외한 소켓에 메세지 전송
    socket.broadcast.emit("message", message);
  });

  // io.to("jelly room").emit("message", "클라이언트 들어옴");
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
