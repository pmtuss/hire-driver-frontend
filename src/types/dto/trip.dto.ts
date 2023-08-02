import { TripStatus } from '~/constants/enum'
import { ICoordinate } from './goong-map.dto'

export interface ITrip {
  _id: string
  createdAt: Date
  updatedAt: Date

  passenger?: string
  driver?: string

  endAt?: Date
  startAt?: Date

  origin: ICoordinate
  originText: string
  destination: ICoordinate
  destinationText: string

  car: {
    model: string
    color: string
    plate: string
  }

  route: string

  cost: number
  rate?: number
  status?: TripStatus
}

export type CreateTripRequestDto = Pick<
  ITrip,
  'origin' | 'originText' | 'destination' | 'destinationText' | 'route' | 'cost' | 'car'
>

export type UpdateTripRequestDto = Partial<ITrip>
