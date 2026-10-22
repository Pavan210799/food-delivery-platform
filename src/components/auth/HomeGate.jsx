import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import HomePage from '../../pages/HomePage'

/** App entry: guests land on login; signed-in users see home. */
export default function HomeGate() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <HomePage />
}
