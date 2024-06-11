const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const { createRoom } = require("./app/room");
const { getRoom, updateRoom, addRoom } = require("./files/data");
const e = require("cors");
const { joinRandom } = require("./files/random");

const app = express();
const server = createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
  connectionStateRecovery: {},
});

//socket.io connection hanlder
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("change", (data, num, roomId, player) => {
    const room = getRoom(roomId);
    if (!room) socket.emit("roomNotFound");
    console.log("change", data, "at", num, "by", player);
    io.to(roomId).emit("change", data, num);
  });
  socket.on("createRoom", (name, noOfRounds) => {
    const room = createRoom(name, noOfRounds, socket.id);
    socket.join(room.roomId);
    addRoom(room);
    console.log("Created room", room, name);
    io.in(room.roomId).emit("roomCreated", room);
  });

  socket.on("joinRoom", (roomId, name) => {
    const room = getRoom(roomId);
    if (room) {
      if (room.player1.name === name || room.player2.name === name) {
        console.log("Player already in room");
        return;
      }
      if (room.player1.name === null) {
        room.player1.name = name;
        room.player1.socketId = socket.id;
      } else if (room.player2.name === null) {
        room.player2.name = name;
        room.player2.socketId = socket.id;
      } else {
        console.log("Room is full");
        return;
      }
    } else {
      console.log("Room not found");
      socket.emit("roomNotFound");
      return;
    }
    socket.join(roomId);
    updateRoom(roomId, room);
    console.log("joined room", room, name);
    io.to(roomId).emit("playerJoined", room, name);
  });

  socket.on("randomGame", (name) => {
    const { isEmpty, room } = joinRandom(name, socket.id);
    socket.join(room.roomId);

    if (isEmpty) {
      socket.emit("randomSearch", room, name);
      console.log("waiting for player", room, name);
    } else {
      socket.emit("randomSearch", room, name);
      setTimeout(() => {
        console.log("random matched", room, name);
        io.in(room.roomId).emit("randomMatched", room, name);
      }, 1000);
    }
  });

  socket.on("startGame", (roomId) => {
    const room = getRoom(roomId);
    if (room) {
      console.log("game started");
      io.in(roomId).emit("gameStarted", room);
    }
  });

  socket.on("leavingRoom", (roomId, name) => {
    const room = getRoom(roomId);
    if (room) {
      if (room.player1.name === name) {
        room.player1 = { name: null, socketId: null };
      } else if (room.player2.name === name) {
        room.player2 = { name: null, socketId: null };
      }
      io.in(roomId).emit("playerLeft", room);
    } else {
      console.log("Room not found");
      socket.emit("roomNotFound");
      return;
    }
    updateRoom(roomId, room);
    socket.leave(roomId);
    console.log("left room", roomId);
    io.to(roomId).emit("playerLeft", room, name);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        const room = getRoom(roomId);
        if (room) {
          if (room.player1.socketId === socket.id) {
            room.player1 = { name: null, socketId: null };
          } else if (room.player2.socketId === socket.id) {
            room.player2 = { name: null, socketId: null };
          }
          // io.in(room).emit("playerLeft", room);
          updateRoom(room.roomId, room);
        }

        console.log("player left", room);
      }
    });
  });

  socket.on("disconnect", (para) => {
    console.log("disconnected");
  });
});
//app server handler
app.get("/", (req, res) => {
  res.send("Hello World");
});

//server starts here
server.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server is running on port 5000");
});
