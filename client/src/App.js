import { useState, useEffect } from "react";
import "./App.css";
import { useSocket } from "./useSocket";
import userNameGenerator from "mw-username-generator";

function App() {
  const [socket, room, setRoom] = useSocket();
  const [roomId, setRoomId] = useState(null);
  //const [owner, setOwner] = useState(false);
  const [username, setUsername] = useState(userNameGenerator());
  // const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("Socket :", socket?.id);
    });
  }, [socket]);

  const handleCreateRoom = () => {
    socket.emit("createRoom", username);
  };

  const handleJoinRoom = () => {
    console.log("Room :", roomId);
    socket.emit("joinRoom", roomId, username, (validation) => {
      //if (validation) setJoined(true);
      //Should create error path here
    });
  };

  return room ? (
    <>
      <Lobby socket={socket} room={room} />
    </>
  ) : (
    <>
      <div className='flex flex-col gap-4'>
        <input
          type='text'
          name='username'
          className='border-2'
          value={username}
          onChange={({ target }) => setUsername(target.value)}></input>
        <button
          onClick={handleCreateRoom}
          className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
          CreateRoom
        </button>
        <input
          type='text'
          className='border-2'
          onChange={({ target }) => setRoomId(target.value)}></input>
        <button
          onClick={handleJoinRoom}
          className='bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
          Join Room
        </button>
      </div>
    </>
  );
}

export default App;

function Lobby({ socket, room }) {
  //const [room, setRoom] = useState({});

  /*useEffect(() => {
    socket?.emit("getRoomInfo", roomId, (room) => {
      setRoom(room);
    });

    socket?.on("roomUpdate", (room) => {
      setRoom(room);
    });

    socket?.on("gameStarted", () => {
      console.log("gameStarted");
      setGameStarted(true);
    });
  }, [socket, roomId]);*/

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

function Game({ room, socket }) {
  const [guess, setGuess] = useState("");

  /*useEffect(() => {
    socket?.on("activePlayer", (playerId) => {
      console.log("active", playerId);
      setActivePlayerId(playerId);
    });
  }, [socket]);*/

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
}
