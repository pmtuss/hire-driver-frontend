import { Navigate } from 'react-router-dom'

export default function LogoutPage() {
  localStorage.removeItem('token')

  return <Navigate to={'/login'} />
}
