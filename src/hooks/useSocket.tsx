import React, { useCallback, useEffect } from "react";
import io from "socket.io-client";

import { EVENT } from "constants/message";

const socket = io("http://localhost:4000");

function useSocket() {
  const sendMessage = useCallback(
    ({ key = EVENT.MESSAGE, payload }: { key?: string; payload?: any }) => {
      socket.emit("sendMessage", { key, payload });
    },
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("%csocket is connected", "color:red");
    });

    socket.on("disconnect", () => {
      console.log("%csocket is disconnected", "color:red");
    });

    socket.on("message", (message) => {
      console.log("message", message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return { socket, sendMessage };
}

export default useSocket;
