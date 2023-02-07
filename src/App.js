import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { v4 as uuidv4 } from "uuid";

import useSocket from "hooks/useSocket";
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
  const { initRoom, leaveRoom } = useSocket();

  useEffect(() => {
    const roomId = uuidv4();

    initRoom(roomId);

    window.addEventListener("beforeunload", () => {
      leaveRoom(roomId);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        leaveRoom(roomId);
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
