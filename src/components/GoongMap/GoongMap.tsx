import { FC, useState } from 'react'
import GoongMapReact, { ViewportProps, GeolocateControl } from '@goongmaps/goong-map-react'
import { InteractiveMapProps } from '@goongmaps/goong-map-react/src/components/interactive-map'

import config from '~/configs/config'

interface GoongMapProps extends InteractiveMapProps {
  // onLoad: Function
}

const GoongMap: FC<GoongMapProps> = (props) => {
  const { onLoad, children } = props
  const { tileKey } = config.map

  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 21.026975,
    longitude: 105.85346,
    zoom: 15
  })

  const handleViewPortChange = (viewport: ViewportProps) => {
    setViewport((prev) => ({ ...prev, ...viewport }))
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
        auto={true}
        style={{ right: 10, bottom: 100 }}
        // className='w-10 h-10'
        positionOptions={{ enableHighAccuracy: true }}
        onGeolocate={(location: any) => {
          // console.log("location: ", location);
        }}
        onViewStateChange={(viewport: any) => {
          // console.log(viewport);
        }}
      />
      {children}
    </GoongMapReact>
  )
}

export default GoongMap
