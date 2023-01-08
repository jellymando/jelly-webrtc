import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import io from "socket.io-client";

import Viewer from "components/Viewer";
import Client from "components/Client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Viewer />
  },
  {
    path: "/client",
    element: <Client />
  }
]);

const socket = io("http://localhost:4000", {
  cors: {
    origin: "*"
  }
});

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("%csocket is connected", "color:red");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("%csocket is disconnected", "color:red");
      setIsConnected(false);
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    socket.emit("ping");

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const sendPing = () => {
    socket.emit("ping");
  };

  return <RouterProvider router={router} />;
}

export default App;
