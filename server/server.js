import http from "http";
import app from "./app";
import { Server } from "socket.io";

const PORT = 7002;
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }

    const anotherUser = rooms[roomID].find((id) => id !== socket.id);

    if (anotherUser) {
      socket.emit("another user", anotherUser);
      socket.to(anotherUser).emit("user joined", socket.id);
    }
  });

  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

async function startServer() {
  server.listen(`faceview is live on port ${PORT}`);
}

startServer();
