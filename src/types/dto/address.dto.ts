import { Compound, ICoordinate } from './goong-map.dto'

export interface IAddress {
  place_id: string
  name: string
  description: string
  compound: Compound
  location: ICoordinate
}
