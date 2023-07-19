import axios, { AxiosError } from 'axios'
import { ICoordinate } from '~/types/dto/goong-map.dto'
import polyline from '@mapbox/polyline'

import * as GoongJS from '@goongmaps/goong-js'

import { Position } from 'geojson'

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

export function getBoundingOfRoute(coordinates: Position[]) {
  const bounds = coordinates.reduce(
    (bounds, coord) => {
      return bounds.extend(coord)
    },
    new GoongJS.LngLatBounds(coordinates[0], coordinates[0])
  )
  return bounds
}

export function calculateCost(distance: number) {
  let value = 0
  if (distance < 1) value = 9000
  else if (distance <= 30) value = distance * 11000
  else value = 11000 * 30 + 9500 * (distance - 30)

  return Math.ceil(value / 1000) * 1000 * 2
}

export function formatMoney(money: number) {
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(money)

  return formattedAmount
}

export function locationEqual(start: ICoordinate, end: ICoordinate) {
  return start.lat === end.lat && start.lng === end.lng
}
