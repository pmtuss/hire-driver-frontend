import { CreateVehicleRequest, IVehicle } from '~/types/dto/vehicle.dto'
import { del, get, post, put } from './axios'

export const getVehicles = () => {
  return get<IVehicle[]>('cars')
}

export const createVehicles = (body: CreateVehicleRequest) => {
  return post('cars', body)
}

export const getVehicle = (id: string) => {
  return get<IVehicle>(`cars/${id}`)
}

export const updateVehicle = (id: string, body: CreateVehicleRequest) => {
  return put(`cars/${id}`, body)
}

export const deleteVehicle = (id: string) => {
  return del(`cars/${id}`)
}
