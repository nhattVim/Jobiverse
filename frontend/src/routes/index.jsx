import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routePaths'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MainLayout from '../layouts/MainLayout'
import JobList from '../pages/JobList'
import JobPost from '../pages/JobPost'
import UploadCV from '../pages/UploadCV'
import CreateCV from '../pages/CreateCV'
import CVManagement from '../pages/CVManagement'
import SetInfomation from '../pages/SetInfomation'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: ROUTES.JOB_LIST,
        element: <JobList />
      },
      {
        path: ROUTES.JOB_POST,
        element: <JobPost />
      },
      {
        path: ROUTES.UPLOAD_CV,
        element: <UploadCV />
      },
      {
        path: ROUTES.CV_MANAGEMENT,
        element: <CVManagement />
      },
      {
        path: ROUTES.SET_INFORMATION,
        element: <SetInfomation />
      },
      {
        path: ROUTES.CREATE_CV,
        element: <CreateCV />
      }
    ]
  },

  {
    path: ROUTES.LOGIN,
    element: <Login />
  },

  {
    path: ROUTES.REGISTER,
    element: <Register />
  },

  {
    path: ROUTES.CREATE_CV,
    element: <CreateCV />
  }
])
