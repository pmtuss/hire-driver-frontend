import { NavBar } from 'antd-mobile'
import { useCallback, useMemo } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { privateRoutes } from '~/routes'

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // route match with pathname
  const matchedRoute = useMemo(() => privateRoutes.find((route) => matchPath(route.path, pathname)), [pathname])

  // back function
  const handleBack = useCallback(() => {
    navigate(-1)
  }, [])

  return (
    <NavBar onBack={handleBack} className='shadow-md border-b-2 border-solid border-slate-200'>
      {matchedRoute?.name}
    </NavBar>
  )
}
