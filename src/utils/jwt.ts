import jwt_decode from 'jwt-decode'
import { UserRoles } from '~/constants/enum'

interface DecodedToken {
  exp: number
  userId: string
  userRole: UserRoles
}

export const getExpirationTime = (accessToken: string) => {
  const decodedToken: DecodedToken = jwt_decode(accessToken)

  if (!decodedToken) {
    return null
  }

  if (!decodedToken.exp) {
    return null
  }

  return decodedToken.exp
}

export const getUserRole = (accessToken: string) => {
  const decodedToken: DecodedToken = jwt_decode(accessToken)

  if (!decodedToken) {
    return null
  }

  if (!decodedToken.userRole) {
    return null
  }

  return decodedToken.userRole
}

export const isExpiredToken = (accessToken: string) => {
  const expirationTime = getExpirationTime(accessToken)

  const currentTime = Date.now() / 1000

  // console.log({ currentTime, expirationTime });

  return expirationTime == null || expirationTime < currentTime
}
