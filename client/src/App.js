import { useState, useEffect } from "react";
import "./App.css";
import { useSocket } from "./useSocket";
import userNameGenerator from "mw-username-generator";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game";

function App() {
  const [socket, room, setRoom] = useSocket();

  return !room ? (
    <Home socket={socket} />
  ) : (
    <>
      {room.gameState === "LOBBY" ? (
        <Lobby socket={socket} room={room} />
      ) : (
        <Game socket={socket} room={room} />
      )}
    </>
  );
}

export default App;
/*
function Lobby({ socket, room }) {

  return room.gameState !== "LOBBY" ? (
    <Game room={room} socket={socket} />
  ) : (
    <>
      <h1>Lobby</h1>
      <h1>{room.id}</h1>
      {room.players && (
        <ul>
          {Object.keys(room.players).map((key) => {
            const { id, username } = room.players[key];
            return (
              <li key={id} className={id === socket.id ? "font-bold" : null}>
                {username}
              </li>
            );
          })}
        </ul>
      )}
      {room.ownerId === socket.id && (
        <>
          <button
            className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
            onClick={() => {
              socket.emit("startGame", room.id);
            }}>
            Start game
          </button>
        </>
      )}
    </>
  );
}
*/
/*
function Game({ room, socket }) {
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
    </>
  );
}*/
