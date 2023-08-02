import { Layer, MapContext, Source } from '@goongmaps/goong-map-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { getBoundingOfRoute, polylineStringToGeoJson } from '~/utils/util'

import { Position } from 'geojson'

interface IProps {
  polylineString: string
  sourceId?: string
  color?: string
}

const DirectionRenderWithRoute: React.FC<IProps> = (props) => {
  const [coordinates, setCoordinates] = useState<Position[]>([])
  const { polylineString, sourceId = 'route', color = '#0384fc' } = props

  const context = useContext(MapContext)

  const data = useMemo(() => {
    // geoJson from encoded polyline string
    const geoJson = polylineStringToGeoJson(polylineString)

    setCoordinates(geoJson.coordinates)

    // source data for route line
    const sourceData = {
      type: 'Feature',
      geometry: {
        ...geoJson
      }
    }

    return sourceData
  }, [polylineString])

  // Line String layer style
  const layerStyle = useMemo(
    () => ({
      id: sourceId,
      type: 'line' as const,
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': color,
        'line-width': 6
      }
    }),
    []
  )

  useEffect(() => {
    const bounds = getBoundingOfRoute(coordinates)

    const { map, viewport, onViewportChange } = context

    // get camara info for bounds fit
    const newCameraTransform = map.cameraForBounds(bounds, {
      padding: { top: 100, bottom: 250, left: 30, right: 30 }
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
    <Source id={sourceId} type='geojson' data={data as any}>
      <Layer {...layerStyle} />
    </Source>
  )
}

export default DirectionRenderWithRoute
