import { useState, useContext } from "react";

import { FaChevronUp } from "react-icons/fa";
import { RoomContext } from "../context/context";

const RoomInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const room = useContext(RoomContext);

  return (
    <div className='fixed bottom-2 left-2 bg-blue-500/70 p-4 rounded-xl w-fit text-white transition-width  duration-300 ease-out hover:ease-in z-50'>
      {isOpen ? (
        <>
          <button
            className='absolute right-6 font-bold text-black'
            onClick={() => setIsOpen(false)}>
            X
          </button>
          <h1 className='p-2'>ROOM OBJECT</h1>
          <ObjDescription obj={room} />
        </>
      ) : (
        <button onClick={() => setIsOpen(true)}>
          <FaChevronUp />
        </button>
      )}
    </div>
  );
};

export default RoomInfo;

const ObjDescription = ({ obj = {} }) => {
  if (!obj) return null;
  return (
    <ul>
      {Object.entries(obj).map(([key, value], index) => (
        <li key={index} className='list-disc list-inside px-4'>
          <span className='font-bold'>{key} </span>
          {typeof value === "object" ? (
            <ObjDescription obj={value} />
          ) : (
            " " + value
          )}
        </li>
      ))}
    </ul>
  );
};
