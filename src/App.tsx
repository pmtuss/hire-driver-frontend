import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { privateRoutes, publicRoutes } from './routes'
import useLoggedIn from './hooks/useLoggedIn'

import '@goongmaps/goong-js/dist/goong-js.css'

function App() {
  // const routes = [...publicRoutes, ...privateRoutes]
  const [isLoggedIn] = useLoggedIn()

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
      {privateRoutes.map((route, index) => (
        <Route
          key={route.name}
          path={route.path}
          element={
            !isLoggedIn ? (
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
      ))}
    </Routes>
  )
}

export default App
