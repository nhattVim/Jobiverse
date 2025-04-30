import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routePaths";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import MainLayout from "../layouts/MainLayout";
import JobList from "../pages/JobList";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.JOB_LIST,
        element: <JobList />,
      },
    ],
  },

  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },

  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
]);
