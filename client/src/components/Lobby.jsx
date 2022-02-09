import React, { useContext } from "react";
import RoomInfo from "./RoomInfo";
import { FiCopy } from "react-icons/fi";
import Player from "./Player";
import { RoomContext, SocketContext } from "../context/context";

const Lobby = () => {
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);
  const isOwner = socket.id === room.ownerId;

  return (
    <>
      <RoomInfo />
      <h2 className='text-5xl  md:text-8xl text-center p-2 my-10 tracking-widest text-blue-800 font-header'>
        Lobby
      </h2>
      <div className='bg-white flex flex-col w-full md:w-[1000px] mx-auto   gap-5 rounded-2xl shadow-md'>
        <div className='p-4 md:p-6 '>
          <h3 className='text-3xl  md:text-5xl text-blue-800 font-header'>
            Room #
          </h3>
          <div className='flex justify-between align-middle items-center border-2 mt-6 '>
            <p className='font-bold text-sm md:text-2xl grow text-center'>
              {room.id}
            </p>
            <button
              className='bg-blue-500 p-3 md:p-4 text-xl md:text-4xl text-white group active:bg-blue-400 '
              onClick={() => {
                navigator.clipboard.writeText(room.id);
              }}>
              <FiCopy className=' group-hover:rotate-45   transition duration-300 ease-out hover:ease-in' />
            </button>
          </div>
        </div>
        <hr />
        <div className='p-4 md:p-6  '>
          <h3 className='text-3xl  md:text-5xl text-blue-800 font-header'>
            Players
          </h3>
          <div className='mt-6 flex flex-col md:flex-row flex-wrap justify-around gap-4'>
            {room.players.map((player, index) => (
              <Player key={index} playerInfo={player} />
            ))}
          </div>
        </div>
        {isOwner && (
          <>
            <hr />
            <div className='p-4 md:p-6 '>
              <h3 className='text-3xl  md:text-5xl text-blue-800 font-header'>
                Settings
              </h3>
              <div className='flex flex-col mt-8 tracking-widest'>
                <button
                  className='bg-transparent hover:bg-blue-500 bg-white text-blue-700 font-bold hover:text-white py-4 px-4 border border-blue-500 hover:border-transparent rounded text-2xl transition duration-150 ease-out hover:ease-in'
                  onClick={() => {
                    socket.emit("startGame", room.id);
                  }}>
                  Start Game
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Lobby;
