import React, { useMemo, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { v4 as uuidv4 } from "uuid";

import { socket } from "libs/socket";
import { ROLE } from "types/message";

import Viewer from "pages/Viewer";
import Client from "pages/Client";

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

function App() {
  const myRole = useMemo(
    () =>
      window.location.pathname.replace("/", "") === ROLE.CLIENT
        ? ROLE.CLIENT
        : ROLE.VIEWER,
    []
  );

  useEffect(() => {
    const roomId = uuidv4();

    socket.emit("create", myRole);

    socket.on("create", (role) => {
      if (myRole !== role) {
        socket.emit("join", roomId);
      }
    });

    socket.on("join", (roomId) => {
      socket.emit("welcome", roomId);
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("leave", roomId);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        socket.emit("leave", roomId);
      });
    };
  }, []);

  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;
