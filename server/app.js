const express = require("express");
const path = require("path");
const socket = require("socket.io");
const { v4 } = require("uuid");
const { v4: uuidv4 } = require("uuid");
const { Player } = require("./Player");
const { Room } = require("./Room");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
  console.log(`Server listening on port:${PORT}`);
});

//const players = { id: "", name: "" };
const rooms = {};

const io = socket(server); // TRY TO IMPLEMENT SINGLETON

io.sockets.on("connection", (socket) => {
  //console.log("connection");

  socket.on("createRoom", (username) => {
    console.log("Room Creation");
    const roomId = uuidv4();
    socket.join(roomId);
    const player = new Player(socket.id, username);
    rooms[roomId] = new Room(roomId, player, io);
    //callback(roomId);
  });

  socket.on("joinRoom", (roomId, username) => {
    if (roomId in rooms) {
      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);
      rooms[roomId].addPlayer(new Player(socket.id, username));
      //socket.to(roomId).emit("roomUpdate", rooms[roomId]);
    }
  });

  socket.on("startGame", (roomId) => {
    if (io.sockets.adapter.rooms.get(roomId) && roomId in rooms) {
      rooms[roomId].startGame();
    }
  });

  socket.on("choosingWord", (roomId, word) => {
    if (io.sockets.adapter.rooms.get(roomId) && roomId in rooms) {
      rooms[roomId].setWordToGuess(word);
    }
  });

  socket.on("guess", (roomId, guess) => {
    if (io.sockets.adapter.rooms.get(roomId) && roomId in rooms) {
      rooms[roomId].guess(socket.id, guess);
    }
  });

  socket.on("getRoomInfo", (roomId, callback) => {
    if (io.sockets.adapter.rooms.get(roomId) && roomId in rooms) {
      const { id, players, gameState } = rooms[roomId];
      callback({ id, players, gameState });
    }
    //callback(false);
  });

  socket.on("draw", (roomId, data) => {
    if (io.sockets.adapter.rooms.get(roomId) && roomId in rooms) {
      socket.to(roomId).emit("draw", data);
    }
  });

  socket.on("disconnecting", () => {
    //Remove player from room and delete room if empty
    console.log(`Disconnecting socket : ${socket.id}`);
    [...socket.rooms].forEach((roomId) => {
      if (rooms[roomId]) {
        rooms[roomId].removePlayer(socket.id);
        //console.log(rooms[roomId]);
        if (!rooms[roomId].players.length) {
          console.log(`Deleting Room ${roomId}`);
          delete rooms[roomId];
        }
      }
    });
  });

  socket.on("disconnect", () => {});
});
