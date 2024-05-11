const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("change", (data, num) => {
    console.log("change", data);
    socket.broadcast.emit("change", data, num);
  });
});

io.listen(5000);
