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
  let connectedRoom;

  socket.on("create", (role) => {
    socket.broadcast.emit("create", role);
  });

  socket.on("join", (roomId) => {
    if (!connectedRoom) {
      socket.join(roomId);
      socket.broadcast.emit("join", roomId);
      connectedRoom = roomId;
    }
  });

  socket.on("welcome", (roomId) => {
    if (!connectedRoom) {
      socket.join(roomId);
      connectedRoom = roomId;
      socket.broadcast.to(connectedRoom).emit("welcome", roomId);
    }
  });

  socket.on("leave", (roomId) => {
    if (connectedRoom === roomId) {
      socket.broadcast.to(connectedRoom).emit("leave");
      socket.leave(connectedRoom);
      connectedRoom = null;
    }
  });

  socket.on("offer", (message) => {
    socket.broadcast.to(connectedRoom).emit("offer", message);
  });

  socket.on("answer", (message) => {
    socket.broadcast.to(connectedRoom).emit("answer", message);
  });

  socket.on("candidate", (message) => {
    socket.broadcast.to(connectedRoom).emit("candidate", message);
  });

  socket.on("close", (message) => {
    socket.broadcast.to(connectedRoom).emit("close", message);
  });

  socket.on("play", (message) => {
    socket.broadcast.to(connectedRoom).emit("play", message);
  });

  socket.on("pause", (message) => {
    socket.broadcast.to(connectedRoom).emit("pause", message);
  });
});

server.listen(3030, () => {
  console.log("listening on *:3030");
});
