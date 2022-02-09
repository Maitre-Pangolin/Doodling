import { useEffect, useState, useContext } from "react";
import DrawingArea from "./DrawingArea";
import RoomInfo from "../RoomInfo";
import Player from "../Player";
import ChoosingWord from "./ChoosingWord";
import { RoomContext, SocketContext } from "../../context/context";
import { useGame } from "../../hooks/gameLogic";
import InputArea from "./InputArea";

const Game = () => {
  const socket = useContext(SocketContext);
  const room = useContext(RoomContext);
  const [wordToDraw, setWordToDraw] = useGame();
  const isActivePlayer = socket.id === room.activePlayer.id;

  return (
    <>
      <RoomInfo room={room} />

      <ChoosingWord
        isActivePlayer={isActivePlayer}
        setWordToDraw={setWordToDraw}
      />

      <p className='tracking-widest text-center text-md md:text-2xl my-5'>
        Looking for : {wordToDraw || room.wordToGuessPlaceHolder}
      </p>
      <DrawingArea isActivePlayer={isActivePlayer} />

      <InputArea />

      <div className='flex flex-col gap-2'>
        <h1>Round {room.currentRound}</h1>

        {room.players.map((player, index) => (
          <Player key={index} playerInfo={player} />
        ))}
      </div>
    </>
  );
};

export default Game;
