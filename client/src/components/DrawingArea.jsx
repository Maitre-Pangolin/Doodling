import React, { useState } from "react";
import CanvaNoLib from "./CanvaNoLib";

const DrawingArea = ({ socket, roomId, isActivePlayer }) => {
  const [color, setColor] = useState([]);
  const SIZE = window.innerWidth <= 768 ? 375 : 768; // weird mobile if using innerWidth in calc
  return (
    <>
      <CanvaNoLib
        SIZE={SIZE}
        socket={socket}
        roomId={roomId}
        isActivePlayer={isActivePlayer}
      />
    </>
  );
};

export default DrawingArea;
