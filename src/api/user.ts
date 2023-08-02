import { UserInfo, UserProfileRequest, UserProfileResponse } from '~/types/dto/user.dto'
import { get, put, post } from './axios'

export const getProfile = () => {
  return get<UserProfileResponse>('users/profile')
}

export const updateProfile = (body: UserProfileRequest) => {
  return put('users/profile', body)
}

export const updateAvatar = (body: { avatar: string }) => {
  return post('users/update-avatar', body)
}

export const getUserInfo = (userId: string) => {
  return get<UserInfo>(`users/${userId}`)
}
