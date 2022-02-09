// SINGLETON IO ?
const { randomWord } = require("./words");

class Room {
  constructor(roomId, player, io) {
    this.id = roomId;
    this.ownerId = player.id;
    this.players = [player];
    this.gameState = "LOBBY";
    this.activePlayer = null;
    this.wordToGuess = "";
    this.wordClue = "";
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
    //if (!this.activePlayer) this.activePlayer = this.players[0];

    const index = this.players.findIndex((e) => e.id === this.activePlayer?.id);
    if (!index) this.activePlayer = this.players[0];
    if (index !== this.players.length - 1) {
      this.activePlayer = this.players[index + 1];
    } else {
      this.activePlayer = this.players[0];
    }

    this.playersWhoGuessed.push(this.activePlayer.id);
    this.emitRoomData();
    this.proposeWord();

    //END CALLSTACK ?
  }

  guess(playerId, guess) {
    // should add point to players
    if (guess === this.wordToGuess && this.gameState === "GUESSING") {
      this.io.to(playerId).emit("correctGuess", guess);
      this.playersWhoGuessed.push(playerId);
      this.emitRoomData();
      if (this.playersWhoGuessed.length === this.players.length) {
        this.endTurn(); // SHOULD INTERNALLY EMIT AN END TURN ? No Closure ?
      }
    }
  }

  endTurn() {
    //Should check if game is ended if yes trigger gameEnd
    const index = this.players.findIndex((e) => e.id === this.activePlayer.id);
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
    this.activePlayer = null;
    this.wordToGuess = "";
    this.wordClue = "";
    this.currentRound = 0;
    this.emitRoomData();
  }

  proposeWord() {
    this.gameState = "CHOOSING";
    const words = [randomWord(), randomWord(), randomWord()];
    this.emitRoomData();
    console.log("hey", words);
    this.io.to(this.activePlayer.id).emit("proposingWords", words);
  }

  setWordToGuess(word) {
    this.wordToGuess = word;
    this.wordClue = word
      .split("")
      .map((c) => "_")
      .join("");
    this.gameState = "GUESSING";
    this.emitRoomData();
    //this.io.to(this.activePlayerId).emit("wordToDraw",);
  }

  emitRoomData() {
    const data = {
      id: this.id,
      players: this.players,
      gameState: this.gameState,
      ownerId: this.ownerId,
      activePlayer: this.activePlayer,
      wordToGuessPlaceHolder: this.wordClue,
      playersWhoGuessed: this.playersWhoGuessed,
      currentRound: this.currentRound,
    };
    this.io.to(this.id).emit("roomData", data);
  }
}

module.exports.Room = Room;
