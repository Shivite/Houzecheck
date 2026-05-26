const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let scores = [];

io.on("connection", (socket) => {

  console.log("User Connected");

  // Listen emitted event from frontend
  socket.on("addScore", (data) => {
    console.log("Received Data:", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});