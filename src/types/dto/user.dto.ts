export interface UserProfileRequest {
  name?: string
  dob?: string
}

export interface UserProfileResponse {
  name: string
  email: string
  dob: string
  phone: string
}
