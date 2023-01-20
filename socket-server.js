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

  socket.on("offer", (message) => {
    socket.broadcast.emit("offer", message);
  });

  socket.on("answer", (message) => {
    socket.broadcast.emit("answer", message);
  });

  socket.on("candidate", (message) => {
    socket.broadcast.emit("candidate", message);
  });

  socket.on("close", (message) => {
    socket.broadcast.emit("close", message);
  });

  socket.on("play", (message) => {
    io.emit("play", message);
  });

  socket.on("pause", (message) => {
    io.emit("pause", message);
  });

  // io.to("jelly room").emit("message", "클라이언트 들어옴");
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
