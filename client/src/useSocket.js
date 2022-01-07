import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return socket;
};
