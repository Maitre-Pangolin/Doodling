import React from "react";

const Lobby = ({ socket, room }) => {
  return (
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
};

export default Lobby;
