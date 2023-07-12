import { useEffect } from 'react'
import { userStore } from '~/stores'
import { isExpiredToken } from '~/utils/jwt'

type ReturnType = [boolean, (value: boolean) => void]

export default function useLoggedIn() {
  const { isLoggedIn, setIsLoggedIn } = userStore((state) => state)

  const accessToken = localStorage.getItem('token')

  useEffect(() => {
    if (!accessToken) setIsLoggedIn(false)
    else {
      const isExpired = isExpiredToken(accessToken)
      setIsLoggedIn(!isExpired)
    }
  }, [accessToken])

  return [isLoggedIn, setIsLoggedIn] as ReturnType
}
