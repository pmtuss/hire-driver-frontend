import { del, get, post, put } from './axios'
import { CreateAddressRequestDto, IAddress } from '~/types/dto/address.dto'

export const getAddresses = () => {
  return get<IAddress[]>('addresses')
}

export const getAddress = (id: string) => {
  return get<IAddress>(`addresses/${id}`)
}

export const updateAddress = (id: string, body: CreateAddressRequestDto) => {
  return put(`addresses/${id}`, body)
}

export const createAddress = (body: CreateAddressRequestDto) => {
  return post<IAddress>('addresses', body)
}

export const deleteAddress = (id: string) => {
  return del(`addresses/${id}`)
}
