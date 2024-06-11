const { v4: uuidv4 } = require("uuid");
const createRoom = (name, noOfRounds, socketId) => {
  if (name && noOfRounds) {
    const room = {
      noOfRounds,
      roomId: uuidv4(),
      player1: {
        name: name,
        socketId: socketId,
      },
      player2: {
        name: null,
        socketId: null,
      },
    };


    return room;
  } else {
    console.log("Invalid data");
  }
};

module.exports = {
  createRoom,
};
