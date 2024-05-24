const { Server } = require("socket.io");
const express = require("express");
const { createServer } = require("http");
const { createRoom } = require("./app/room");
const { getRoom, getRooms } = require("./files/data");

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
  console.log(socket.id);
  console.log("connected");
  socket.on("change", (data, num) => {
    console.log("change", data);
    socket.broadcast.emit("change", data, num);
  });
  socket.on("createRoom", (roomId) => {
    socket.join(roomId);
    console.log("joined room", roomId);
  });

  socket.on("joinRoom", (roomId, name) => {
    const room = getRoom(roomId);
    if (room) {
      if (room.player1 === null) {
        room.player1 = name;
      } else if (room.player2 === null) {
        room.player2 = name;
      } else {
        console.log("Room is full");
        return;
      }
    } else {
      console.log("Room not found");
      return;
    }
    socket.join(roomId);
    console.log("joined room", roomId);
    io.in(roomId).emit("player2Joined", room);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log("left room", roomId);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
//app server handler
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/createRoom", createRoom);

//server starts here
server.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server is running on port 5000");
});
