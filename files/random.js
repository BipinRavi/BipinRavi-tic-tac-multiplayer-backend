const { createRoom } = require("../app/room");

const randomRoom = [];
let isEmpty = false;
let emptyRoomId;

const joinRandom = (name, socketId) => {
  let room;
  if (isEmpty) {
    room = randomRoom.find((room) => room.roomId == emptyRoomId);
    room.player2 = { name, socketId };
    const index = randomRoom.findIndex((room) => room.roomId === emptyRoomId);
    randomRoom[index] = room;
    isEmpty = false;
  } else {
    room = createRoom(name, 10, socketId);
    randomRoom.push(room);
    emptyRoomId = room.roomId;
    isEmpty = true;
  }

  return { isEmpty, room };
};

module.exports = { joinRandom };
