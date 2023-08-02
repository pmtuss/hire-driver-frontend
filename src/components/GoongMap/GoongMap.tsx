import { FC, useState } from 'react'
import GoongMapReact, { ViewportProps, GeolocateControl } from '@goongmaps/goong-map-react'
import { InteractiveMapProps } from '@goongmaps/goong-map-react/src/components/interactive-map'

import config from '~/configs/config'

const inititalViewport = {
  latitude: 21.026975,
  longitude: 105.85346,
  zoom: 15,
  maxZoom: 20
}

interface GoongMapProps extends InteractiveMapProps {
  // onLoad: Function
  autoGeolocate?: boolean
  initViewport?: ViewportProps
  geolocateStyle?: React.CSSProperties
}

const GoongMap: FC<GoongMapProps> = (props) => {
  const {
    onLoad,
    children,
    onViewportChange,
    geolocateStyle,
    initViewport = inititalViewport,
    autoGeolocate = true
  } = props
  const { tileKey } = config.map

  const [viewport, setViewport] = useState<ViewportProps>(initViewport)

  const handleViewPortChange = (viewport: ViewportProps) => {
    setViewport((prev) => ({ ...prev, ...viewport }))

    onViewportChange?.(viewport)
  }

  return (
    <GoongMapReact
      {...viewport}
      width={'100%'}
      height={'100%'}
      onViewportChange={handleViewPortChange}
      goongApiAccessToken={tileKey}
      onLoad={onLoad}
    >
      <GeolocateControl
        auto={autoGeolocate}
        style={{ right: 10, bottom: 150, ...geolocateStyle }}
        // className='w-10 h-10'
        positionOptions={{ enableHighAccuracy: true }}
        // onGeolocate={(location: any) => {
        //   // console.log("location: ", location);
        // }}
        // onViewStateChange={(viewport: any) => {
        //   // console.log(viewport);
        // }}
        className='h-10 w-10 rounded-full'
      />
      {children}
    </GoongMapReact>
  )
}

export default GoongMap
