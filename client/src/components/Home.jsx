import { useState } from "react";
import userNameGenerator from "mw-username-generator";

const Home = ({ socket }) => {
  const [username, setUsername] = useState(userNameGenerator());
  const [roomId, setRoomId] = useState(null);

  const handleCreateRoom = () => {
    socket.emit("createRoom", username);
  };

  const handleJoinRoom = () => {
    //console.log("Room :", roomId);
    socket.emit("joinRoom", roomId, username);
  };

  return (
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
};

export default Home;
