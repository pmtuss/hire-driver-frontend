export interface IVehicle {
  _id?: string
  color: string
  model: string
  plate: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVehicleRequest extends Pick<IVehicle, 'color' | 'model' | 'plate' | 'isDefault'> {}
