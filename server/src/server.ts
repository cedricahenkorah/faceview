import "dotenv/config";
import http from "http";
import app from "./app";
import { Server } from "socket.io";
import cors from "cors";

app.use(cors());

const PORT = process.env.PORT || 7002;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms: any = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }

    // check if a user already exists in the room
    const anotherUser = rooms[roomID].find((id: any) => id !== socket.id);

    if (anotherUser) {
      // notify the user that just joined that another user exist
      socket.emit("other user", anotherUser);

      // notify the existing user that a user just joined the room
      socket.to(anotherUser).emit("user joined", socket.id);
      console.log("joined");
    }
  });

  socket.on("handleSocketDisconnect", (roomId, callback) => {
    let index = -1;
    if (rooms[roomId]) {
      index = rooms[roomId].indexOf(socket.id);
    }
    if (index > -1) {
      rooms[roomId].splice(index, 1);
      console.log("Current Sessions: " + rooms[roomId]);
    }

    if (callback) callback();
  });

  // facilitate the handshake b/n the two peers (users) - sending and receiving the offer
  socket.on("offer", (payload) => {
    // payload includes who am I (caller / target) and the actual offer object
    io.to(payload.target).emit("offer", payload);
  });

  // facilitate the handshake b/n the two peers (users) - user B sending back the offer to user A(caller)
  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });

  socket.on("disconnect", () => {
    for (const roomID in rooms) {
      rooms[roomID] = rooms[roomID].filter((id: any) => id !== socket.id);
      socket.to(roomID).emit("user disconnected", socket.id); // Notify others
      if (rooms[roomID].length === 0) {
        delete rooms[roomID];
        console.log(`Room ${roomID} deleted`);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`faceview is live on port ${PORT}`);
});

// startServer();
