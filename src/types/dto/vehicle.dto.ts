export interface IVehicle {
  _id?: string
  color: string
  model: string
  plate: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type CreateVehicleRequest = Pick<IVehicle, 'color' | 'model' | 'plate' | 'isDefault'>
