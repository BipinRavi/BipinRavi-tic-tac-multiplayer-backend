const rooms = [];

const getRooms = () => {
  return rooms;
};
const addRoom = (room) => {
  rooms.push(room);
};
const getRoom = (roomId) => {
  return rooms.find((room) => room.roomId === roomId);
};
const deleteRoom = (roomId) => {
  const index = rooms.findIndex((room) => room.roomId === roomId);
  if (index !== -1) {
    return rooms.splice(index, 1)[0];
  }
};
const updateRoom = (roomId, room) => {
  const index = rooms.findIndex((room) => room.roomId === roomId);
  if (index !== -1) {
    return (rooms[index] = room);
  }
};

module.exports = { getRooms, addRoom, getRoom, deleteRoom, updateRoom };
