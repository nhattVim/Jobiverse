import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routePaths'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MainLayout from '../layouts/MainLayout'
import JobList from '../pages/JobList'
import JobPost from '../pages/JobPost'
import UploadCV from '../pages/UploadCV'
import CVEditor from '../pages/CVEditor'
import CVManagement from '../pages/CVManagement'
import SavedJob from '../pages/SavedJob'
import SetInfomation from '../pages/SetInfomation'
import JobDetail from '../pages/JobDetail'
import EmployerInfo from '../pages/EmployerInfo'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      //JOB ROUTES
      {
        path: ROUTES.JOB_LIST,
        element: <JobList />
      },
      {
        path: ROUTES.JOB_POST,
        element: <JobPost />
      },
      {
        path: ROUTES.JOB_DETAIL,
        element: <JobDetail />
      },
      {
        path: ROUTES.SAVED_JOB,
        element: <SavedJob />
      },
      // CV ROUTES
      {
        path: ROUTES.UPLOAD_CV,
        element: <UploadCV />
      },
      {
        path: ROUTES.CREATE_CV,
        element: <CVEditor />
      },
      {
        path: ROUTES.CV_MANAGEMENT,
        element: <CVManagement />
      },
      {
        path: ROUTES.UPDATE_CV,
        element: <CVEditor />
      },
      // INFORMATION ROUTES
      {
        path: ROUTES.SET_INFORMATION,
        element: <SetInfomation />
      },
      {
        path: '/employer-info',
        element: <EmployerInfo />
      }
    ]
  },

  // AUTH ROUTES
  {
    path: ROUTES.LOGIN,
    element: <Login />
  },

  {
    path: ROUTES.REGISTER,
    element: <Register />
  }
])
