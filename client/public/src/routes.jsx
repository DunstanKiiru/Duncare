import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import Pets from "./Pages/Pets";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/Pets",
        element: <Pets />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
