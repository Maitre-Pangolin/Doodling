import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../context/context";

const handle = () => {};

export const useGame = () => {
  const socket = useContext(SocketContext);
  const [wordToDraw, setWordToDraw] = useState("");

  useEffect(() => {
    socket.on("correctGuess", (word) => {
      setWordToDraw(word);
    });

    socket.on("endTurnReset", () => {
      setWordToDraw("");
    });

    return () => {};
  }, [socket]);

  return [wordToDraw, setWordToDraw];
};

export const useWords = () => {
  const [words, setWords] = useState(["test", "blue"]);
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on("proposingWords", (words) => {
      setWords(words);
    });
  }, [socket]);

  return words;
};
