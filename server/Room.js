// SINGLETON IO ?

class Room {
  constructor(roomId, player, io) {
    this.id = roomId;
    this.ownerId = player.id;
    this.players = [player];
    this.gameState = "LOBBY";
    this.activePlayerId = null;
    this.io = io;

    this.emitRoomData();
  }

  addPlayer(player) {
    this.players.push(player);
    this.emitRoomData();
  }

  removePlayer(playerId) {
    this.players = this.players.filter((player) => player.id !== playerId);
    this.emitRoomData();
  }

  startGame() {
    this.gameState = "STARTED";
    this.activatePlayer();
    setInterval(() => this.activatePlayer(), 1000);
  }

  activatePlayer() {
    const index = this.players.findIndex((e) => e.id === this.activePlayerId);
    if (!index) this.activePlayer = this.players[0].id;
    if (index !== this.players.length - 1) {
      this.activePlayerId = this.players[index + 1].id;
    } else {
      this.activePlayerId = this.players[0].id;
    }
    this.emitRoomData();
  }

  selectWord() {}

  emitRoomData() {
    const data = {
      id: this.id,
      players: this.players,
      gameState: this.gameState,
      ownerId: this.ownerId,
      activePlayerId: this.activePlayerId,
    };
    this.io.to(this.id).emit("roomData", data);
  }
}

module.exports.Room = Room;
