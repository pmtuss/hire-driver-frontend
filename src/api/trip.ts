import { CreateTripRequestDto, ITrip, UpdateTripRequestDto } from '~/types/dto/trip.dto'
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

export const getAcceptableTrips = () => {
  return get<ITrip[]>(`trips/acceptable`)
}

// export const updateTrip = (id: string, body: UpdateTripRequestDto) => {
//   return put(`trips/${id}`, body)
// }

export const updateTrip = ({ id, body }: { id: string; body: UpdateTripRequestDto }) => {
  return put(`trips/${id}`, body)
}

export const createTrip = (body: CreateTripRequestDto) => {
  return post<ITrip>('trips', body)
}

export const deleteTrip = (id: string) => {
  return del(`trips/${id}`)
}

export const acceptTrip = (id: string) => {
  return get(`trips/${id}/acceptTrip`)
}

export const getCurrentTrip = () => {
  return get<ITrip>(`trips/currentTrip`)
}
