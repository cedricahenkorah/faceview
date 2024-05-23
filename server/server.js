import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import cors from "cors";

app.use(cors());

const PORT = 7002;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    console.log("answered");
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, () => {
  console.log(`Faceview is live on port ${PORT}`);
});
