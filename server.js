import express from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const port = process.env.PORT || 8000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://video-conferencing-website-two.vercel.app", "https://video-conferencing-website-ln0t.onrender.com"],
    methods: ["GET", "POST"]
  }
});
const allusers = {};

nextApp.prepare().then(() => {
  app.all("*", (req, res) => nextHandler(req, res));

  io.on("connection", (socket) => {
    console.log(
      `Someone connected to socket server and socket id is ${socket.id}`,
    );

    socket.on("join-user", (username) => {
      console.log(`${username} joined socket connection`);
      allusers[username] = { username, id: socket.id };

      io.emit("joined", allusers);
    });

    socket.on("offer", ({ from, to, offer }) => {
      if (allusers[to]) {
        io.to(allusers[to].id).emit("offer", { from, to, offer });
      }
    });

    socket.on("answer", ({ from, to, answer }) => {
      if (allusers[from]) {
        io.to(allusers[from].id).emit("answer", { from, to, answer });
      }
    });

    socket.on("end-call", ({ from, to }) => {
      if (allusers[to]) {
        io.to(allusers[to].id).emit("end-call", { from, to });
      }
    });

    socket.on("call-ended", (caller) => {
      const [from, to] = caller;

      if (allusers[from]) {
        io.to(allusers[from].id).emit("call-ended", caller);
      }

      if (allusers[to]) {
        io.to(allusers[to].id).emit("call-ended", caller);
      }
    });

    socket.on("icecandidate", (candidate) => {
      socket.broadcast.emit("icecandidate", candidate);
    });

    socket.on("disconnect", () => {
      const disconnectedUser = Object.keys(allusers).find(
        (user) => allusers[user].id === socket.id,
      );

      if (disconnectedUser) {
        delete allusers[disconnectedUser];
        io.emit("joined", allusers);
      }
    });
  });

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
