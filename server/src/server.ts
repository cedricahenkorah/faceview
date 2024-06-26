import "dotenv/config";
import http from "http";
import app from "./app";
import { Server } from "socket.io";
import cron from "node-cron";
import { connectDB } from "./config/dbConnection";
import mongoose from "mongoose";

const PORT = process.env.PORT || 7002;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    console.log("calling");
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

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err: any) => {
  console.log("MongoDB connection error", err);
});

// async function wakeServer() {
//   const uri = process.env.SERVER_URL;

//   try {
//     const response = await fetch(`${uri}`);

//     if (response.ok) {
//       console.log("hi server");
//     } else {
//       throw new Error("Server is down");
//     }
//   } catch (error) {
//     console.error("Error waking server:", error);
//   }
// }

// cron.schedule("*/6 * * * *", wakeServer);

async function startServer() {
  connectDB();

  server.listen(PORT, () => {
    console.log(`Faceview is live on port ${PORT}`);
  });
}

startServer();
