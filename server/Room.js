const { randomWord } = require("./words");
const roomEvents = require("./events");

const gameStates = {
  LOBBY: "LOBBY",
  START_ROUND: "START_ROUND",
  NEXT_PLAYER: "NEXT_PLAYER",
  CHOOSING_WORD: "CHOOSING_WORD",
  START_TURN: "START_TURN",
  IN_TURN: "IN_TURN",
  END_TURN: "END_TURN",
  END_ROUND: "END_ROUND",
  END_GAME: "END_GAME",
};

const MAX_PLAYERS = 8;
class Room {
  constructor(roomId, player, io) {
    this.id = roomId;
    this.owner = player;
    this.players = [player];
    this.gameState = "LOBBY";
    this.activePlayer = null;
    this.wordToGuess = "";
    this.wordClue = "";
    //this.playersWhoGuessed = [];
    //this.numberOfRound = 2;
    this.currentRound = 0;
    this.settings = {
      numberOfRound: 2,
      timePerTurnInSec: 60,
    };
    this.io = io;
    this.turnTimer = null;

    this.emitRoomData();
  }

  // UTILS

  emitRoomData() {
    const data = {
      id: this.id,
      players: this.players,
      gameState: this.gameState,
      owner: this.owner,
      activePlayer: this.activePlayer,
      wordClue: this.wordClue,
      playersWhoGuessed: this.playersWhoGuessed,
      currentRound: this.currentRound,
      settings: this.settings,
    };
    this.io.to(this.id).emit("roomData", data);
  }

  hasEveryoneFound() {
    return this.players.every(({ hasGuessed }) => hasGuessed);
  }

  isRoundFinished() {
    return this.activePlayer === this.players[this.players.length - 1];
  }

  isGameFinished() {
    return this.currentRound === this.settings.numberOfRound;
  }

  turnReset() {
    this.players.forEach((player) => player.reset());
    this.io.to(this.id).emit("cleanDrawing");
  }

  // PLAYER & ROOM MANAGEMENT

  addPlayer(player, socket) {
    if (this.players.length >= 8) return;
    this.players.push(player);
    socket.join(this.id);
    console.log(`${username} joined room ${this.id}`);
    this.emitRoomData();
  }

  removePlayer(playerId) {
    //should remove player from players
    // if activePlayer should endTurn
    // if owner should transfer ownership to next player
  }

  setSettings(settings) {
    this.settings = settings;
    this.emitRoomData();
  }

  // STATES ACTIONS

  startRound() {
    if (
      !(
        this.gameState === gameStates.LOBBY ||
        this.gameState === gameStates.END_ROUND
      )
    )
      return;
    this.currentRound++;
    this.gameState === gameStates.START_ROUND;
    this.emitRoomData();
    //display score and round remaining
    setTimeout(() => {
      this.startTurn();
    }, 1000);
  }

  startTurn() {
    this.gameState = gameStates.START_TURN;
    //should emit reset to client
    //reset all Players .guess and .hasGuess ,playerWhoGuessed
    this.activePlayer = nextPlayer();
    this.emitRoomData();
    this.choosingWord();
  }

  choosingWord() {
    if (this.gameState !== gameStates.START_TURN) return;
    this.gameState = gameStates.CHOOSING_WORD;
    const words = [randomWord(), randomWord(), randomWord()];
    this.io.to(this.activePlayer.id).emit("words", words);
    this.emitRoomData();
  }

  inTurn() {
    this.gameState = gameStates.IN_TURN;
    this.emitRoomData();
    this.turnTimer = setTimeout(() => {
      endTurn();
    }, this.settings.timePerTurnInSec * 1000);
    this.io.to(this.id).emit("startTurnTimer");
    //should start timer and send set timer to client , can trigger endTurn
    // should set an interval revealing a letter every tick
  }

  endTurn() {
    this.gameState = gameStates.END_TURN;
    clearTimeout(this.turnTimer);
    this.wordClue = this.wordToGuess;
    this.emitRoomData();
    //display drawing & solution

    this.isRoundFinished() ? this.endRound() : this.startTurn();
    //check if round is finished
  }

  endRound() {
    this.gameState = gameStates.END_ROUND;
    if (this.isGameFinished()) {
      this.endGame();
    } else {
      this.currentRound++;
      this.startRound();
    }
    //check if game end and route to next round or game end
  }

  endGame() {
    this.gameState = gameStates.END_GAME;
    //should display score for a time and then back to lobby
  }

  // GAME ACTIONS HANDLERS

  startHandler() {}

  guessHandler(playerId, guess) {
    const player = this.players.find(({ id }) => id === playerId); // CHECK IF VALUE OR REF
    if (this.gameState !== gameStates.IN_TURN) return;
    //should add guess to player
    player.setGuess(guess);
    if (guess === this.word) {
      this.io.to(playerId).emit("correctGuess", guess);
      //this.playersWhoGuessed.push(playerId);
      player.hasGuessed = true;
      this.this.emitRoomData();
      if (this.hasEveryoneFound()) this.endTurn();
    }
  }

  selectWordHandler(word) {
    if (this.gameState !== gameStates.CHOOSING_WORD) return;
    this.wordToGuess = word;
    this.wordClue = word
      .split("")
      .map((c) => "_")
      .join("");
    this.activePlayer.hasGuessed = true;
    this.inTurn();
  }
}
