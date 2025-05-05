import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routePaths";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import JobList from "../pages/JobList";
import JobPost from "../pages/JobPost";
import UploadCV from "../pages/UploadCV";
import CreateCV from "../pages/CreateCV";

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
      {
        path: ROUTES.JOB_POST,
        element: <JobPost />,
      },
      {
        path: "/upload-cv",
        element: <UploadCV />,
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

  {
    path: ROUTES.CREATE_CV,
    element: <CreateCV />,
  },
]);
