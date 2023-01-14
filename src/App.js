import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

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
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;
