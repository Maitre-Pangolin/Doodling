const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
  console.log(`Server listening on port:${PORT}`);
});

const io = socket(server);

io.sockets.on("connection", (socket) => {
  console.log("connection");
  socket.on("click", (data) => {
    console.log("click", data);
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
