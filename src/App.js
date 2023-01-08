import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
  return <RouterProvider router={router} />;
}

export default App;
