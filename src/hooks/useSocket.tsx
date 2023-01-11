import React, { useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

import { KEY, ROLE } from "constants/message";

const socket = io("http://localhost:4000");

function useSocket() {
  const location = useLocation();

  const sendMessage = useCallback(
    ({ key = KEY.MESSAGE, payload }: { key?: string; payload?: any }) => {
      const role =
        location.pathname.replace("/", "") === ROLE.CLIENT
          ? ROLE.CLIENT
          : ROLE.VIEWER;
      socket.emit("sendMessage", { key, role, payload });
    },
    [location.pathname, socket]
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("%csocket is connected", "color:red");
    });

    socket.on("disconnect", () => {
      console.log("%csocket is disconnected", "color:red");
    });

    socket.on("message", (message) => {
      const { key, role, payload } = message;
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
