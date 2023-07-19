import { UserProfileRequest, UserProfileResponse } from '~/types/dto/user.dto'
import { get, put } from './axios'

export const getProfile = () => {
  return get<UserProfileResponse>('users/profile')
}

export const updateProfile = (body: UserProfileRequest) => {
  return put('users/profile', body)
}
