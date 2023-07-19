import { Layer, MapContext, Source } from '@goongmaps/goong-map-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { DirectionResponseDto } from '~/types/dto/goong-map.dto'
import { getBoundingOfRoute, polylineStringToGeoJson } from '~/utils/util'

import { Position } from 'geojson'

interface DirectionRenderProps {
  directions: DirectionResponseDto
}

const DirectionRender: React.FC<DirectionRenderProps> = (props) => {
  const [coordinates, setCoordinates] = useState<Position[]>([])
  const { directions } = props

  const context = useContext(MapContext)

  const data = useMemo(() => {
    // console.log({ directions })
    const { overview_polyline } = directions.routes[0]

    // encoded polyline string
    const { points } = overview_polyline

    // geoJson from encoded polyline string
    const geoJson = polylineStringToGeoJson(points)

    setCoordinates(geoJson.coordinates)

    // source data for route line
    const sourceData = {
      type: 'Feature',
      geometry: {
        ...geoJson
      }
    }

    return sourceData
  }, [directions])

  // Line String layer style
  const layerStyle = useMemo(
    () => ({
      id: 'route',
      type: 'line' as const,
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#0384fc',
        'line-width': 6
      }
    }),
    []
  )

  useEffect(() => {
    let bounds = getBoundingOfRoute(coordinates)

    const { map, viewport, onViewportChange } = context

    // get camara info for bounds fit
    const newCameraTransform = map.cameraForBounds(bounds, {
      padding: { top: 150, bottom: 200, left: 30, right: 30 }
    })

    // change viewport fit bounds
    onViewportChange?.({
      ...viewport,
      longitude: newCameraTransform.center.lng,
      latitude: newCameraTransform.center.lat,
      zoom: newCameraTransform.zoom
      // transitionDuration: 2000
    })
  }, [coordinates])

  return (
    <Source id='route' type='geojson' data={data as any}>
      <Layer {...layerStyle} />
    </Source>
  )
}

export default DirectionRender
