class Player {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.guess = "";
    this.hasGuessed = false;
    this.timer = null;
  }

  setGuess(guess) {
    this.guess = guess;
    clearTimeout(this.timer);
    setTimeout(() => {
      this.guess = "";
    }, 1000);
  }

  reset() {
    this.guess = "";
    clearTimeout(this.timer);
    this.hasGuessed = true;
  }
}

module.exports.Player = Player;
