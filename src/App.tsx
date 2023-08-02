import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { driverPrivateRoutes, privateRoutes } from './routes'

import '@goongmaps/goong-js/dist/goong-js.css'
import { getUserRole } from './utils/jwt'
import { useEffect, useMemo } from 'react'
import { UserRoles } from './constants/enum'

import io from 'socket.io-client'
import { useSocket } from './stores/socket.store'
import config from './configs/config'

function App() {
  const navigate = useNavigate()

  const { setSocket } = useSocket()

  const accessToken = useMemo(() => {
    return localStorage.getItem('token')
  }, [navigate])

  const userRole = useMemo(() => {
    if (accessToken) return getUserRole(accessToken)
  }, [accessToken])

  useEffect(() => {
    const socket = io(config.serverUrl, {
      auth: { token: accessToken }
    })

    setSocket(socket)
    socket.on('connect', () => {
      console.log('Connected to socket server.', socket.id)
    })

    return () => {
      socket.disconnect()
      setSocket(null)
    }
  }, [])

  return (
    <>
      <Routes>
        {userRole &&
          userRole === UserRoles.DRIVER &&
          driverPrivateRoutes.map((route) => {
            return (
              <Route
                key={route.name}
                path={route.path}
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

        {userRole &&
          userRole === UserRoles.PASSENGER &&
          privateRoutes.map((route) => {
            return (
              <Route
                key={route.name}
                path={route.path}
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
      </Routes>
    </>
  )
}

export default App
