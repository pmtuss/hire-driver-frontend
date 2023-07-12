import axios, { AxiosError } from 'axios'
import { ICoordinate } from '~/types/dto/goong-map.dto'
import polyline from '@mapbox/polyline'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function coordinateToLocationText(location: ICoordinate) {
  return location.lat + ',' + location.lng
}

export function decodePolyline(encoded: string) {
  return polyline.decode(encoded)
}

export function polylineStringToGeoJson(encoded: string) {
  return polyline.toGeoJSON(encoded)
}

export function getBoundingOfRoute(coordinates: [number, number][]) {
  let bottomLeft = [
    Math.min(...coordinates.map((coordinate) => coordinate[0])),
    Math.min(...coordinates.map((coordinate) => coordinate[1]))
  ]
  let topRight = [
    Math.max(...coordinates.map((coordinate) => coordinate[0])),
    Math.max(...coordinates.map((coordinate) => coordinate[1]))
  ]
  return [bottomLeft, topRight]
}
