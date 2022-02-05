import { useEffect, useState } from "react";
import DrawingArea from "./DrawingArea";
import RoomInfo from "./RoomInfo";

const Game = ({ socket, room }) => {
  const [guess, setGuess] = useState("");
  const [words, setWords] = useState([]);
  const [wordToGuess, setWordToGuess] = useState("");
  const [hasGuessed, setHasGuessed] = useState(false);
  /*const [isActivePlayer, setIsActivePlayer] = useState(
    socket.id === room.activePlayerId
  );*/

  useEffect(() => {
    socket.on("proposingWords", (words) => {
      setWords(words);
    });
    socket.on("correctGuess", () => {
      setHasGuessed(true);
      setWordToGuess(guess);
    });
    socket.on("endTurnReset", () => {
      setHasGuessed(false);
      setWordToGuess("");
      setGuess("");
      //setIsActivePlayer(socket.id === room.activePlayerId);
    });
    socket.on("gameOver", () => {});
  }, [guess, socket]);

  /*useEffect(() => {
    setIsActivePlayer(socket.id === room.activePlayerId);
  }, [socket.id, room.activePlayerId]);*/

  let isActivePlayer = socket.id === room.activePlayerId;

  return (
    <>
      <RoomInfo room={room} />
      <DrawingArea
        socket={socket}
        roomId={room.id}
        isActivePlayer={isActivePlayer}
      />
      {isActivePlayer && (
        <h2>
          I'm active {socket.id} {room.activePlayerId}
        </h2>
      )}
      <div className='flex flex-col gap-2'>
        <h1>Game</h1>
        <h1>Round {room.currentRound}</h1>
        {room.players && (
          <ul>
            {Object.keys(room.players).map((key) => {
              const { id, username } = room.players[key];
              return (
                <li key={id} className={id === socket.id ? "font-bold" : null}>
                  {username} {id === room.activePlayerId ? " Active" : null}
                  {room.playersWhoGuessed.includes(id) &&
                  !(id === room.activePlayerId)
                    ? " Found"
                    : null}
                </li>
              );
            })}
          </ul>
        )}
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
                //console.log(guess);
              }}>
              Guess
            </button>
          </>
        )}
        {words.map((word, i) => (
          <Button
            key={i}
            word={word}
            room={room}
            socket={socket}
            setWords={setWords}
            setWordToGuess={setWordToGuess}
          />
        ))}
        <p className='tracking-widest'>
          Looking for :{" "}
          {isActivePlayer || hasGuessed
            ? wordToGuess
            : room.wordToGuessPlaceHolder}
        </p>
      </div>
    </>
  );
};

export default Game;

function Button({ word, setWords, socket, room, setWordToGuess }) {
  return (
    <button
      className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded'
      onClick={() => {
        socket.emit("choosingWord", room.id, word);
        setWords([]);
        setWordToGuess(word);
      }}>
      {word}
    </button>
  );
}
