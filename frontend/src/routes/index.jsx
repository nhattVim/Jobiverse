import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from './routePaths'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MainLayout from '../layouts/MainLayout'
import JobList from '../pages/JobList'
import JobEditor from '../pages/JobEditor'
import UploadCV from '../pages/UploadCV'
import CVEditor from '../pages/CVEditor'
import CVManager from '../pages/CVManager'
import SavedJob from '../pages/SavedJob'
import SetInfomation from '../pages/SetInfomation'
import JobDetail from '../pages/JobDetail'
import ProtectedRoute from './ProtectedRoute'
import EmployerProfile from '../pages/EmployerProfile'
import StudentProfile from '../pages/StudentProfile'
import EmployerDetail from '../pages/EmployerDetail'
import JobManager from '../pages/JobManager'
import Security from '../pages/Security'

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
        path: ROUTES.CREATE_JOB,
        element: <ProtectedRoute><JobEditor /></ProtectedRoute>
      },
      {
        path: ROUTES.UPDATE_JOB,
        element: <ProtectedRoute><JobEditor /></ProtectedRoute>
      },
      {
        path: ROUTES.JOB_DETAIL,
        element: <JobDetail />
      },
      {
        path: ROUTES.SAVED_JOB,
        element: <ProtectedRoute><SavedJob /></ProtectedRoute>
      },
      {
        path: ROUTES.JOB_MANAGER,
        element: <ProtectedRoute><JobManager /></ProtectedRoute>
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
        path: ROUTES.EMPLOYER_DETAIL,
        element: <EmployerDetail />
      },
      // SECURITY ROUTES
      {
        path: ROUTES.SECURITY,
        element: <ProtectedRoute><Security /></ProtectedRoute>
      }
    ]
  },

  // PROFILE ROUTES
  {
    path: ROUTES.EMPLOYER_PROFILE,
    element: <EmployerProfile />
  },
  {
    path: ROUTES.STUDENT_PROFILE,
    element: <StudentProfile />
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
