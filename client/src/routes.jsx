import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import Pets from "./Pages/Pets";
import Owners from "./Pages/Owners";
import Staff from "./Pages/Staff";
import Treatments from "./Pages/Treatments";

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
        path: "/pets",
        element: <Pets />,
      },
      {
        path: "/owners",
        element: <Owners/>
      },
      {
        path: "/staff",
        element: <Staff/>
      },
      {
        path: "/treatment",
        element: <Treatments/>
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
