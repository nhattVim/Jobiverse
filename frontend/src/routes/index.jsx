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
import CVManager from '../pages/CVManager'
import SavedJob from '../pages/SavedJob'
import SetInfomation from '../pages/SetInfomation'
import JobDetail from '../pages/JobDetail'
import EmployerInfo from '../pages/EmployerInfo'
import ProtectedRoute from './ProtectedRoute'

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
        element: <ProtectedRoute><JobPost /></ProtectedRoute>
      },
      {
        path: ROUTES.JOB_DETAIL,
        element: <JobDetail />
      },
      {
        path: ROUTES.SAVED_JOB,
        element: <ProtectedRoute><SavedJob /></ProtectedRoute>
      },
      // CV ROUTES
      {
        path: ROUTES.UPLOAD_CV,
        element: <ProtectedRoute><UploadCV /></ProtectedRoute>
      },
      {
        path: ROUTES.CREATE_CV,
        element: <ProtectedRoute><CVEditor /></ProtectedRoute>
      },
      {
        path: ROUTES.CV_MANAGER,
        element: <ProtectedRoute><CVManager /></ProtectedRoute>
      },
      {
        path: ROUTES.UPDATE_CV,
        element: <ProtectedRoute><CVEditor /></ProtectedRoute>
      },
      // INFORMATION ROUTES
      {
        path: ROUTES.SET_INFORMATION,
        element: <ProtectedRoute><SetInfomation /></ProtectedRoute>
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
