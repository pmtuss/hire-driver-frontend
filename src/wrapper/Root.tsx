import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { driverPrivateRoutes, privateRoutes, publicRoutes } from '~/routes'

import '@goongmaps/goong-js/dist/goong-js.css'
import { getUserRole, isExpiredToken } from '~/utils/jwt'
import { useEffect, useMemo } from 'react'

import App from '~/App'

export default function Root() {
  const navigate = useNavigate()

  const isValidAccessToken = (token: string | null) => {
    return token && !isExpiredToken(token)
  }

  const accessToken = useMemo(() => {
    return localStorage.getItem('token')
  }, [navigate])

  const userRole = useMemo(() => {
    if (accessToken) return getUserRole(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken || !isValidAccessToken(accessToken)) navigate('/login')
  }, [accessToken])

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

      <Route path='/*' element={isValidAccessToken(accessToken) ? <App /> : <Navigate to={'/login'} />} />
      {/* {userRole &&
        userRole === UserRoles.DRIVER &&
        driverPrivateRoutes.map((route) => {
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

      {userRole &&
        userRole === UserRoles.PASSENGER &&
        privateRoutes.map((route) => {
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
        })} */}
    </Routes>
  )
}
