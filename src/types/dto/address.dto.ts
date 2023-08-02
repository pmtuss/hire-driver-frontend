import { Compound, ICoordinate } from './goong-map.dto'

export interface IAddress {
  _id?: string
  place_id: string
  name: string
  formatted_address: string
  compound: Compound
  location: ICoordinate
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateAddressRequestDto
  extends Pick<IAddress, 'formatted_address' | 'isDefault' | 'location' | 'name'> {}
