const { createRoom } = require("../app/room");

const randomRoom = [];
let isEmpty = false;
let emptyRoomId;

const joinRandom = (name, socketId) => {
  let room;
  if (isEmpty) {
    room = randomRoom.find((room) => room.roomId == emptyRoomId);
    if (!room) {
      isEmpty = false;
      return { isEmpty, room };
    }
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

const leaveRandom = (roomId) => {
  const index = randomRoom.findIndex((room) => room.roomId === roomId);
  if (index !== -1) {
    return randomRoom.splice(index, 1)[0];
  }
};

module.exports = { joinRandom, leaveRandom };
