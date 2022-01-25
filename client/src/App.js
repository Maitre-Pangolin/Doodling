import { useSocket } from "./useSocket";
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
