export interface UserProfileRequest {
  name?: string
  dob?: string
}

export interface UserProfileResponse {
  name: string
  email: string
  dob: string
  phone: string
  avatar: string
}

export interface UserInfo {
  name: string
  phone: string
  avatar: string
}
