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

// app.use(express.static(__dirname + "/build"));

// app.get("/", (req, res) => {
//   console.log()
// });

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
