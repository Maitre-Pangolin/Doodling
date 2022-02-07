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

  useEffect(() => {
    socket.on("startDrawing", (data) => {
      contextRef.current.beginPath();
      contextRef.current.moveTo(data.x * SIZE, data.y * SIZE);
    });

    socket.on("draw", (data) => {
      contextRef.current.lineTo(data.x * SIZE, data.y * SIZE);
      contextRef.current.stroke();
    });

    socket.on("endDrawing", (data) => {
      contextRef.current.closePath();
    });

    socket.on("cleanDrawing", () => {
      console.log("clean");
      contextRef.current.clearRect(0, 0, SIZE, SIZE);
    });
  }, []);

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
    socket.emit("startDrawing", roomId, {
      x: offsetX / SIZE,
      y: offsetY / SIZE,
    });
  };

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
    socket.emit("draw", roomId, { x: offsetX / SIZE, y: offsetY / SIZE });
  };

  const endDrawing = () => {
    if (!isActivePlayer) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    socket.emit("endDrawing", roomId);
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
