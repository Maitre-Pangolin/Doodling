// SINGLETON IO ?
const { randomWord } = require("./words");

class Room {
  constructor(roomId, player, io) {
    this.id = roomId;
    this.ownerId = player.id;
    this.players = [player];
    this.gameState = "LOBBY";
    this.activePlayerId = null;
    this.wordToGuess = "";
    this.wordToGuessPlaceHolder = "";
    this.playersWhoGuessed = [];
    this.numberOfRound = 1;
    this.currentRound = 0;
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
    //this.emitRoomData();
    this.currentRound = 1;
    this.nextPlayer();

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
    this.playersWhoGuessed.push(this.activePlayerId);
    //

    this.emitRoomData();
    this.proposeWord();

    //END CALLSTACK ?
  }

  guess(playerId, guess) {
    // should add point to players
    if (guess === this.wordToGuess && this.gameState === "GUESSING") {
      this.io.to(playerId).emit("correctGuess");
      this.playersWhoGuessed.push(playerId);
      this.emitRoomData();
      if (this.playersWhoGuessed.length === this.players.length) {
        this.endTurn(); // SHOULD INTERNALLY EMIT AN END TURN ? No Closure ?
      }
    }
  }

  endTurn() {
    //Should check if game is ended if yes trigger gameEnd
    const index = this.players.findIndex((e) => e.id === this.activePlayerId);
    this.io.to(this.id).emit("endTurnReset");
    this.playersWhoGuessed = [];

    if (
      index === this.players.length - 1 &&
      this.currentRound === this.numberOfRound
    )
      return this.gameOver();
    if (index === this.players.length - 1) {
      this.currentRound += 1;
    }
    console.log("endTurn");
    this.io.to(this.id).emit("cleanDrawing");
    this.nextPlayer();
  }

  gameOver() {
    this.io.to(this.id).emit("gameOver");
    this.gameState = "LOBBY";
    this.activePlayerId = null;
    this.wordToGuess = "";
    this.wordToGuessPlaceHolder = "";
    this.currentRound = 0;
    this.emitRoomData();
  }

  proposeWord() {
    this.gameState = "CHOOSING";
    const words = [randomWord(), randomWord(), randomWord()];
    this.emitRoomData();
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
      playersWhoGuessed: this.playersWhoGuessed,
      currentRound: this.currentRound,
    };
    this.io.to(this.id).emit("roomData", data);
  }
}

module.exports.Room = Room;
