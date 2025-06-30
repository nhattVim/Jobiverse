import { Navigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { useContext } from 'react'
import { ROUTES } from './routePaths'

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext)
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return children
}

export default ProtectedRoute
