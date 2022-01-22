// SINGLETON IO ?

class Room {
  constructor(roomId, player, io) {
    this.id = roomId;
    this.ownerId = player.id;
    this.players = [player];
    this.gameState = "LOBBY";
    this.activePlayerId = null;
    this.wordToGuess = "";
    this.wordToGuessPlaceHolder = "";
    this.playerWhoGuessed = [];
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
    this.nextPlayer();
    this.proposeWord();
    //setInterval(() => this.activatePlayer(), 1000);
  }

  nextPlayer() {
    const index = this.players.findIndex((e) => e.id === this.activePlayerId);
    if (!index) this.activePlayer = this.players[0].id;
    if (index !== this.players.length - 1) {
      this.activePlayerId = this.players[index + 1].id;
    } else {
      this.activePlayerId = this.players[0].id;
    }
    this.playerWhoGuessed;
    //Should check if game is ended if yes trigger gameEnd

    this.emitRoomData();
  }

  guess(playerId, guess) {
    // if guess right add point and add to playerGuessed
    // player
    if (guess === this.wordToGuess) this.io.to(playerId).emit("correct");
  }

  endTurn() {
    //should handle reset server and emit endTurn to clients
  }

  proposeWord() {
    this.gameState = "CHOOSING";
    const words = ["cassoulet", "tree", "paltoquet"];
    this.io.to(this.activePlayerId).emit("proposingWords", words);
  }

  setWordToGuess(word) {
    this.wordToGuess = word;
    this.wordToGuessPlaceHolder = word
      .split("")
      .map((c) => "_")
      .join("");
    this.gameState = "GUESSING";
    this.emitRoomData();
  }

  emitRoomData() {
    const data = {
      id: this.id,
      players: this.players,
      gameState: this.gameState,
      ownerId: this.ownerId,
      activePlayerId: this.activePlayerId,
      wordToGuessPlaceHolder: this.wordToGuessPlaceHolder,
    };
    this.io.to(this.id).emit("roomData", data);
  }
}

module.exports.Room = Room;
