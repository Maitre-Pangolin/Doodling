import { useState } from "react";

const Game = ({ socket, room }) => {
  const [guess, setGuess] = useState("");

  return (
    <>
      <h1>Game</h1>
      {room.players && (
        <ul>
          {Object.keys(room.players).map((key) => {
            const { id, username } = room.players[key];
            return (
              <li key={id} className={id === socket.id ? "font-bold" : null}>
                {username} {id === room.activePlayerId ? " Active" : null}
              </li>
            );
          })}
        </ul>
      )}
      <input
        type='text'
        className='border-2'
        onChange={({ target }) => setGuess(target.value)}></input>
      <button
        className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
        onClick={() => {
          //socket.emit("startGame", room.id);
          console.log(guess);
        }}>
        Guess
      </button>
    </>
  );
};

export default Game;
