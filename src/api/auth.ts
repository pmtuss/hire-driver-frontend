import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, RegisterResponseDto } from '~/types/dto/auth.dto'
import { post } from './axios'

export const login = (body: LoginRequestDto) => {
  return post<LoginResponseDto>('auth/login', body)
}

export const register = (body: RegisterRequestDto) => {
  return post<RegisterResponseDto>('auth/register', body)
}
