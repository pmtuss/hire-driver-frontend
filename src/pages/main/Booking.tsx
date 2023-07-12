import { LocationFill, StarOutline } from 'antd-mobile-icons'
import { useCallback, useEffect, useState } from 'react'
import GoongMap from '~/components/GoongMap/GoongMap'
import SearchInput2 from '~/components/GoongMap/SearchInput2'
import { useMutation } from '@tanstack/react-query'
import { getDirection, getPlaceDetail } from '~/api/goong-map'
import { AddressPrediction } from '~/types/dto/goong-map.dto'
import { IAddress } from '~/types/dto/address.dto'
import { getBoundingOfRoute, polylineStringToGeoJson } from '~/utils/util'
import { Layer, Marker, Source } from '@goongmaps/goong-map-react'
import { Selector } from 'antd-mobile'

const layerStyle = {
  id: 'route',
  type: 'line' as const,
  source: 'route',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#1E293B',
    'line-width': 6
  }
}

export const options = [
  {
    label: 'Toyota A',
    description: '30B 99932',
    value: '1'
  },
  {
    label: 'Mazda Cx5',
    description: '78B 89282',
    value: '2'
  },
  {
    label: 'Huyndai',
    description: '12B 38492',
    value: '3'
  }
]
export default function BookingPage() {
  const [originText, setOriginText] = useState<string>('')
  const [destinationText, setDestinationText] = useState<string>('')

  const [origin, setOrigin] = useState<IAddress>()
  const [destination, setDestination] = useState<IAddress>()

  const [map, setMap] = useState<any>()
  const [sourceData, setSourceData] = useState<any>()

  const getPlaceDetailMutation = useMutation({
    mutationFn: getPlaceDetail
  })

  const handleOriginSelect = useCallback((address: AddressPrediction) => {
    setOriginText(address.description)
    getPlaceDetailMutation.mutateAsync(address.place_id, {
      onSuccess: (data) => {
        setOrigin(data)
      }
    })
  }, [])

  const handleDestinationSelect = useCallback((address: AddressPrediction) => {
    setDestinationText(address.description)
    getPlaceDetailMutation.mutateAsync(address.place_id, {
      onSuccess: (data) => {
        setDestination(data)
      }
    })
  }, [])

  const { mutate: directionMutate } = useMutation({
    mutationFn: getDirection,
    onSuccess: (data: any) => {
      console.log('routes', data)
      data = data.routes[0]
      const polylineEncoded = data.overview_polyline.points
      const geoJson = polylineStringToGeoJson(polylineEncoded)
      console.log(geoJson)

      setSourceData({
        type: 'Feature',
        geometry: {
          ...geoJson
        }
      })

      // map.fitBounds(getBoundingOfRoute(geoJson.coordinates as any))
    }
  })

  useEffect(() => {
    if (origin && destination && map) {
      directionMutate({ origin: origin.location, destination: destination.location })
    } else {
    }
  }, [origin, destination, map])

  return (
    <>
      <GoongMap
        onLoad={(map: any) => {
          setMap(map.target)
          console.log(map.target)
        }}
      >
        {sourceData && (
          <Source id='route' type='geojson' data={sourceData}>
            <Layer {...layerStyle} />
          </Source>
        )}
        {origin && (
          <Marker latitude={origin.location.lat} longitude={origin.location.lng} offsetLeft={-20} offsetTop={-40}>
            <LocationFill color='blue' fontSize={40} />
          </Marker>
        )}
        {destination && (
          <Marker
            latitude={destination.location.lat}
            longitude={destination.location.lng}
            offsetLeft={-20}
            offsetTop={-40}
          >
            <LocationFill color='red' fontSize={40} />
          </Marker>
        )}
      </GoongMap>
      <div className='absolute top-0 py-4 w-full bg-transparent'>
        <div className='px-8 mb-2'>
          <SearchInput2
            value={originText}
            onChange={(value) => {
              setOriginText(value)
            }}
            onSelect={handleOriginSelect}
            icon={<StarOutline color='blue' className='pl-2' />}
            placeholder='Start'
          />
        </div>
        <div className='px-8 '>
          <SearchInput2
            value={destinationText}
            onChange={(value) => {
              setDestinationText(value)
            }}
            onSelect={handleDestinationSelect}
            icon={<LocationFill color='red' className='pl-2' />}
            placeholder='Destination'
          />
        </div>
      </div>

      <div className='absolute bottom-0 h-28 w-full bg-yellow-50'>
        <div className='bg-white py-1 flex items-center'>
          <div className='px-5'>Car</div>
          <Selector options={options} defaultValue={['1']} onChange={(arr, extend) => console.log(arr, extend.items)} />
        </div>
        <div className=''></div>
      </div>
    </>
  )
}
