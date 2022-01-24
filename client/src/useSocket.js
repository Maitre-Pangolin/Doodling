import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const newSocket = io();

    newSocket.on("roomData", (data) => {
      setRoom(data);
      //console.log(data);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return [socket, room, setRoom];
};
