import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { privateRoutes, publicRoutes } from './routes'

import '@goongmaps/goong-js/dist/goong-js.css'
import { isExpiredToken } from './utils/jwt'
import { useMemo } from 'react'

function App() {
  const navigate = useNavigate()

  const isValidAccessToken = (token: string | null) => {
    return token && !isExpiredToken(token)
  }

  const accessToken = useMemo(() => {
    return localStorage.getItem('token')
  }, [navigate])

  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.name}
            element={
              route.layout ? (
                <route.layout>
                  <route.element />
                </route.layout>
              ) : (
                <route.element />
              )
            }
          />
        )
      })}
      {privateRoutes.map((route) => {
        return (
          <Route
            key={route.name}
            path={route.path}
            element={
              !isValidAccessToken(accessToken) ? (
                <Navigate to='/login' />
              ) : route.layout ? (
                <route.layout>
                  <route.element />
                </route.layout>
              ) : (
                <route.element />
              )
            }
          />
        )
      })}
    </Routes>
  )
}

export default App
