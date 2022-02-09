import { useState, useContext } from "react";
import userNameGenerator from "mw-username-generator";
import { IoDiceOutline } from "react-icons/io5";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import avatar from "../avatar.jpg";
import { SocketContext } from "../context/context";

const Home = () => {
  const [username, setUsername] = useState(userNameGenerator());
  const [roomId, setRoomId] = useState(null);
  const socket = useContext(SocketContext);

  const handleCreateRoom = () => {
    socket.emit("createRoom", username);
  };

  const handleJoinRoom = () => {
    //console.log("Room :", roomId);
    socket.emit("joinRoom", roomId, username);
  };

  return (
    <>
      <div>
        <h1 className='text-5xl  md:text-8xl text-center p-2 my-10 tracking-widest text-blue-800 font-header'>
          DOODLING
        </h1>
        <div className='bg-white flex flex-col w-full md:w-[600px] mx-auto p-5 md:p-10 gap-5 rounded-2xl shadow-md'>
          <div className='w-full inline-flex '>
            <input
              type='text'
              name='username'
              className='border-2 w-full p-4 text-xl md:text-2xl'
              value={username}
              onChange={({ target }) => setUsername(target.value)}></input>
            <button
              className='bg-blue-500 p-4 text-2xl md:text-4xl text-white group active:bg-blue-400 '
              onClick={() => setUsername(userNameGenerator())}>
              <IoDiceOutline className=' group-hover:rotate-45   transition duration-300 ease-out hover:ease-in' />
            </button>
          </div>
          <div
            id='placeHolder'
            className='bg-blue-200 w-full h-32 flex justify-center  items-center'>
            <div className='text-2xl  flex flex-col justify-evenly h-full'>
              <MdArrowBackIos />
              <MdArrowBackIos />
              <MdArrowBackIos />
            </div>
            <div>
              <img src={avatar} alt='avatar' className='w-32 rounded-md' />
            </div>
            <div className='text-2xl  flex flex-col justify-evenly h-full'>
              <MdArrowForwardIos />
              <MdArrowForwardIos />
              <MdArrowForwardIos />
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            className='bg-transparent hover:bg-blue-500 bg-white text-blue-700 font-bold hover:text-white py-4 px-4 border border-blue-500 hover:border-transparent rounded text-2xl transition duration-150 ease-out hover:ease-in'>
            Create Room
          </button>
          <h2 className='text-center text-2xl font-bold'>OR</h2>
          <button
            onClick={handleJoinRoom}
            className='bg-transparent hover:bg-blue-500 bg-white text-blue-700 font-bold hover:text-white py-4 px-4 border border-blue-500 hover:border-transparent rounded text-2xl transition duration-150 ease-out hover:ease-in'>
            Join Room
          </button>
          <input
            type='text'
            placeholder='Room #'
            className='border-2 w-full p-4 text-xl md:text-2xl'
            onChange={({ target }) => setRoomId(target.value)}></input>
        </div>
      </div>
    </>
  );
};

export default Home;
