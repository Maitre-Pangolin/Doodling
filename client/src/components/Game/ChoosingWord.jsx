import { useWords } from "../../hooks/gameLogic";
import { useContext } from "react";
import { SocketContext, RoomContext } from "../../context/context";

const ChoosingWord = ({ isActivePlayer = false, setWordToDraw }) => {
  const words = useWords();
  const room = useContext(RoomContext);

  if (room.gameState !== "CHOOSING") return null;

  return (
    <div className=' w-screen h-screen bg-blue-800/50 flex justify-center items-center fixed top-0 z-20 backdrop-blur-sm'>
      {isActivePlayer ? (
        <div className='flex flex-col gap-6'>
          <p className='  font-bold text-white text-xl md:text-2xl tracking-wide'>
            Pick a word to draw
          </p>
          {words.map((word, i) => (
            <WordButton
              key={i}
              word={word}
              roomId={room.id}
              setWordToDraw={setWordToDraw}
            />
          ))}
        </div>
      ) : (
        <div className='font-bold text-xl md:text-2xl tracking-wide text-white'>
          {room.activePlayer.username} is picking a word{" "}
        </div>
      )}
    </div>
  );
};

export default ChoosingWord;

function WordButton({ word, roomId, setWordToDraw }) {
  const socket = useContext(SocketContext);

  return (
    <button
      className='bg-transparent bg-blue-500 hover:bg-blue-200 hover:text-blue-700 font-bold text-white py-4 px-4   rounded text-2xl transition duration-150 ease-out hover:ease-in'
      onClick={() => {
        socket.emit("choosingWord", roomId, word);
        //setWords([]);
        setWordToDraw(word);
      }}>
      {word}
    </button>
  );
}
