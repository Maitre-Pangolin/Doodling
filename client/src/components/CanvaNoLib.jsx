import React, { useRef, useEffect, useState } from "react";

const CanvaNoLib = ({ socket, roomId, isActivePlayer, SIZE }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const context = canvas.getContext("2d");

    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;

    contextRef.current = context;
  }, []);

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !isActivePlayer) return;
    let { offsetX, offsetY } = nativeEvent;
    if (nativeEvent.type === "touchmove") {
      offsetX =
        nativeEvent.touches[0].pageX - nativeEvent.touches[0].target.offsetLeft;
      offsetY =
        nativeEvent.touches[0].pageY - nativeEvent.touches[0].target.offsetTop;
    }
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const startDrawing = ({ nativeEvent }) => {
    console.log(nativeEvent);
    if (!isActivePlayer) return;
    let { offsetX, offsetY } = nativeEvent;
    if (nativeEvent.type === "touchstart") {
      offsetX =
        nativeEvent.touches[0].pageX - nativeEvent.touches[0].target.offsetLeft;
      offsetY =
        nativeEvent.touches[0].pageY - nativeEvent.touches[0].target.offsetTop;
    }
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const endDrawing = () => {
    if (!isActivePlayer) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <canvas
      onMouseMove={draw}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      ref={canvasRef}
      className=' border-2 mx-auto'></canvas>
  );
};

export default CanvaNoLib;
