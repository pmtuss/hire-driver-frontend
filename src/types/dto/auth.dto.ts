export interface LoginRequestDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  token: string
}

export interface RegisterRequestDto {
  email: string
  password: string
  confirmPassword: string
  name: string
  phone: string
}

export interface RegisterResponseDto {
  token: string
  message: string
}
