import { useEffect, useState } from "react";
import DrawingArea from "./DrawingArea";
import RoomInfo from "./RoomInfo";
import Player from "./Player";
import ChoosingWord from "./ChoosingWord";

const Game = ({ socket, room }) => {
  const [guess, setGuess] = useState("");
  const [wordToGuess, setWordToGuess] = useState("");
  const [hasGuessed, setHasGuessed] = useState(false);
  const [words, setWords] = useState([]);

  useEffect(() => {
    socket.on("correctGuess", () => {
      setHasGuessed(true);
      setWordToGuess(guess);
    });
    socket.on("proposingWords", (words) => {
      setWords(words);
    });
    socket.on("endTurnReset", () => {
      setHasGuessed(false);
      setWordToGuess("");
      setGuess("");
    });
    socket.on("gameOver", () => {});
  }, [guess, socket]);

  let isActivePlayer = socket.id === room.activePlayerId;
  const activePlayerName = room.players.find(
    (player) => (player.id = room.activePlayerId)
  ).username;

  return (
    <>
      <RoomInfo room={room} />
      {room.gameState === "CHOOSING" && (
        <ChoosingWord
          isActivePlayer={isActivePlayer}
          activePlayerName={activePlayerName}
          socket={socket}
          roomId={room.id}
          setWordToGuess={setWordToGuess}
          words={words}
          setWords={setWords}
        />
      )}
      <p className='tracking-widest text-center text-md md:text-2xl my-5'>
        Looking for :{" "}
        {isActivePlayer || hasGuessed
          ? wordToGuess
          : room.wordToGuessPlaceHolder}
      </p>
      <DrawingArea
        socket={socket}
        roomId={room.id}
        isActivePlayer={isActivePlayer}
      />

      <div className='flex flex-col gap-2'>
        <h1>Round {room.currentRound}</h1>

        {room.players.map((player, index) => (
          <Player key={index} playerInfo={player} />
        ))}

        {!isActivePlayer && !hasGuessed && (
          <>
            <input
              type='text'
              className='border-2'
              onChange={({ target }) => setGuess(target.value)}></input>
            <button
              className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
              disabled={hasGuessed}
              onClick={() => {
                socket.emit("guess", room.id, guess);
              }}>
              Guess
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Game;
