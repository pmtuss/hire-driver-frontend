import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import config from '~/configs/config'
import { IAddress } from '~/types/dto/address.dto'
import {
  ICoordinate,
  AutoCompleteRequestDto,
  AutoCompleteResponseDto,
  PlaceDetailResponseDto,
  DirectionRequestDto,
  DirectionResponseDto
} from '~/types/dto/goong-map.dto'
import { coordinateToLocationText } from '~/utils/util'

const HOST = 'https://rsapi.goong.io/'
const API_KEY = config.map.apiKey

const baseConfig: AxiosRequestConfig = {
  baseURL: HOST,
  timeout: 5000,
  params: {
    api_key: API_KEY
  }
}

const http: AxiosInstance = axios.create(baseConfig)

enum FEATURES {
  AUTOCOMPETE = 'Place/AutoComplete',
  PLACE_DETAIL = 'Place/Detail',
  GEOCODE = 'Geocode',
  DIRECTION = 'Direction'
}

// GET base
export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return http.get(url, config).then((response) => response.data)
}

// Auto Complete
export const getAutoComplete = async (request: AutoCompleteRequestDto) => {
  const { input, limit } = request

  const data = await get<AutoCompleteResponseDto>(`${FEATURES.AUTOCOMPETE}`, {
    params: { input, limit }
  })

  const returnValue = data.predictions.map((add) => {
    return {
      compound: add.compound,
      formatted_address: add.description,
      place_id: add.place_id
    }
  })
  // return data.predictions
  return returnValue
}

// Get Place detail by place_id
export const getPlaceDetail = async (place_id: string) => {
  const data = await get<PlaceDetailResponseDto>(`${FEATURES.PLACE_DETAIL}`, {
    params: { place_id }
  })

  const result = data.result

  const address: IAddress = {
    place_id: result.place_id,
    location: result.geometry.location,
    formatted_address: result.formatted_address,
    compound: result.compound,
    name: ''
  }

  return address
}

// Get address by Coordinate
export const getAddressByCoordinate = async (coordinate: ICoordinate) => {
  const { lat, lng } = coordinate

  const data = await http.get(`${FEATURES.GEOCODE}`, {
    params: { latlng: `${lat},${lng}` }
  })
  // const result = data.data.results

  // return

  return data.data.results
}

// Direction
export const getDirection = async (request: DirectionRequestDto) => {
  const { origin, destination } = request

  const originText = coordinateToLocationText(origin)
  const destinationText = coordinateToLocationText(destination)

  const data = await get<DirectionResponseDto>(`${FEATURES.DIRECTION}`, {
    params: { origin: originText, destination: destinationText, alternatives: true }
  })

  return data
}
