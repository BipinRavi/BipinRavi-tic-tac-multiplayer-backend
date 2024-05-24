const { v4: uuidv4 } = require("uuid");
const { addRoom } = require("../files/data");

const createRoom = (req, res) => {
  const { name, noOfRounds } = req.body;
  if (name && noOfRounds) {
    const room = {
      noOfRounds,
      roomId: uuidv4(),
      player1: name,
      player2: null,
    };

    addRoom(room);

    res.status(200).json(room);
  } else {
    res.status(400).json({ message: "Please provide the details" });
  }
};

module.exports = {
  createRoom,
};
