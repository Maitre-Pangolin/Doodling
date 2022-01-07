import "./App.css";
import { useSocket } from "./useSocket";

function App() {
  const socket = useSocket();

  const handleClick = () => {
    socket.emit("click", "test");
  };

  return (
    <>
      <div>Hello</div>
      <button onClick={handleClick}>Click</button>
    </>
  );
}

export default App;
