export interface ICoordinate {
  lat: number
  lng: number
}

export interface AutoCompleteRequestDto {
  input: string
  limit?: number
}

export interface Compound {
  district: string
  commune: string
  province: string
}

interface MatchedSubString {
  length: number
  offset: number
}

interface Term {
  offset: number
  value: string
}

export interface AddressPrediction {
  compound: Compound
  description: string
  distance_meters: any
  has_children: boolean
  matched_substrings: MatchedSubString[]
  place_id: string
  plus_code: {
    compound_code: string
    global_code: string
  }
  reference: string
  structured_formatting: {
    main_text: string
    main_text_matched_substrings: MatchedSubString[]
    secondary_text: string
    secondary_text_matched_substrings: MatchedSubString[]
  }
  terms: Term[]
  types: string
}

// AutoComplete
export interface AutoCompleteResponseDto {
  status: string
  execution_time: string
  predictions: AddressPrediction[]
}

// Place Detail

export interface PlaceDetailResponseDto {
  status: string
  result: {
    compound: Compound
    formatted_address: string
    geometry: {
      location: ICoordinate
    }
    name: string
    place_id: string
    plus_code: {
      compound_code: string
      global_code: string
    }
    types: string[]
    url: string
  }
}

// Direction

export interface DirectionRequestDto {
  origin: ICoordinate
  destination: ICoordinate
}

export interface DirectionResponseDto {
  geocoded_waypoints: Array<{ geocoder_satus: string; place_id: string }>
  routes: Array<{
    overview_polyline: { points: string }
    legs: Array<{
      distance: { text: string; value: number }

      duration: { text: string; value: number }
      end_address: string
      end_location: ICoordinate
      start_address: string
      start_location: ICoordinate

      step: Array<{
        distance: { text: string; value: number }

        duration: { text: string; value: number }
        end_location: ICoordinate
        start_location: ICoordinate
        html_instructions: string
        maneuver: string
        travel_mode: string
        polyline: {
          points: string
        }
      }>
    }>
  }>
}
