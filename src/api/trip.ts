import { CreateTripRequestDto, ITrip } from '~/types/dto/trip.dto'
import { del, get, post, put } from './axios'

export const getTrips = async () => {
  const data = await get<ITrip[]>('trips')
  return data.map((item) => {
    return {
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }
  })
}

export const getTrip = (id: string) => {
  return get<ITrip>(`trips/${id}`)
}

export const updateTrip = (id: string, body: CreateTripRequestDto) => {
  return put(`trips/${id}`, body)
}

export const createTrip = (body: CreateTripRequestDto) => {
  return post<ITrip>('trips', body)
}

export const deleteTrip = (id: string) => {
  return del(`trips/${id}`)
}
