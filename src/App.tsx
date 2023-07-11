import { Route, Routes } from 'react-router-dom'
import './App.css'
import { privateRoutes, publicRoutes } from './routes'

function App() {
  const routes = [...publicRoutes, ...privateRoutes]

  return (
    <Routes>
      {routes.map((route, index) => {
        return (
          <Route
            key={index}
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
  )
}

export default App
