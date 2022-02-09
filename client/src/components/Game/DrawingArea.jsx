import React, { useState } from "react";
import Canva from "./Canva";

const DrawingArea = ({ isActivePlayer }) => {
  const [color, setColor] = useState([]);
  const [drawParams, setDrawParams] = useState({ color: "blue" });
  const SIZE = window.innerWidth <= 768 ? 375 : 768; // weird mobile if using innerWidth in calc

  const colors = ["black", "blue", "gold", "linegreen"];

  return (
    <>
      <Canva SIZE={SIZE} isActivePlayer={isActivePlayer} />
    </>
  );
};

export default DrawingArea;
