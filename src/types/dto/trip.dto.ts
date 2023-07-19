import { TripStatus } from '~/constants/enum'
import { ICoordinate } from './goong-map.dto'

export interface ITrip {
  _id: string
  createdAt: Date
  updatedAt: Date

  user?: string
  driver?: string

  endAt?: Date
  startAt?: Date

  origin: ICoordinate
  originText: string
  destination: ICoordinate
  destinationText: string

  carId: string
  route: string

  cost: number
  rate?: number
  status?: TripStatus
}

export interface CreateTripRequestDto
  extends Pick<ITrip, 'origin' | 'originText' | 'destination' | 'destinationText' | 'route' | 'cost' | 'carId'> {}
