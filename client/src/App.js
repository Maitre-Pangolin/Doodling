import { useSocket } from "./hooks/useSocket";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game/Game";
import { RoomContext, SocketContext } from "./context/context";

function App() {
  const [socket, room] = useSocket();
  //const [socket, room] = useSocket();
  return (
    <>
      <div className='bg-blue-200 w-screen h-screen -z-10 fixed top-0'></div>
      <SocketContext.Provider value={socket}>
        {!room ? (
          <Home />
        ) : (
          <>
            <RoomContext.Provider value={room}>
              {room.gameState === "LOBBY" ? <Lobby /> : <Game />}
            </RoomContext.Provider>
          </>
        )}
      </SocketContext.Provider>
    </>
  );
}

export default App;
