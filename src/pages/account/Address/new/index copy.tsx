import { MapContext, Marker, ViewportProps, WebMercatorViewport } from '@goongmaps/goong-map-react'
import { useMutation } from '@tanstack/react-query'
import { Button } from 'antd-mobile'
import { LocationFill } from 'antd-mobile-icons'
import { debounce } from 'lodash'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getAddressByCoordinate, getPlaceDetail } from '~/api/goong-map'
import GoongMap from '~/components/GoongMap/GoongMap'
import SearchInput2 from '~/components/GoongMap/SearchInput2'
import { IAddress } from '~/types/dto/address.dto'
import { AddressPrediction, ICoordinate } from '~/types/dto/goong-map.dto'

interface CenterMarkerProps {
  onViewportChange?: (viewport: WebMercatorViewport) => void
}

const CenterMarker = (props: CenterMarkerProps) => {
  const { onViewportChange } = props
  const { viewport } = useContext(MapContext)

  useEffect(() => {
    if (viewport) onViewportChange?.(viewport)
  }, [viewport])

  return (
    viewport && (
      <Marker longitude={viewport.longitude} latitude={viewport.latitude} offsetTop={-40} offsetLeft={-20}>
        <LocationFill color='red' fontSize={40} />
      </Marker>
    )
  )
}

export default function AddressNewPage() {
  const [input, setInput] = useState<string>('')
  const [address, setAddress] = useState<IAddress>()
  const [center, setCenter] = useState<number[]>([])
  const [viewport, setViewport] = useState()

  const [isLoading, setIsLoading] = useState(false)

  const [map, setMap] = useState<any>(null)

  const getPlaceDetailMutation = useMutation({
    mutationFn: getPlaceDetail
  })

  const handleOriginSelect = useCallback((address: AddressPrediction) => {
    setInput(address.description)
    getPlaceDetailMutation.mutateAsync(address.place_id, {
      onSuccess: (data) => {
        setAddress(data)
        map.panTo(data.location)
      }
    })
  }, [])

  const { mutate: mutateGetAddressByCoordinate } = useMutation({
    mutationFn: getAddressByCoordinate,
    onSuccess: () => {
      setIsLoading(false)
    }
  })

  const handleViewportChange = useCallback((viewport: WebMercatorViewport) => {
    // setViewport(viewport as any)
  }, [])

  return (
    <>
      <GoongMap onLoad={(map: any) => setMap(map.target)}>
        {map && <CenterMarker onViewportChange={handleViewportChange} />}
      </GoongMap>
      <div className='absolute top-0 py-4 w-full bg-transparent'>
        <div className='px-8'>
          <SearchInput2
            value={input}
            onChange={(value) => {
              setInput(value)
            }}
            onSelect={handleOriginSelect}
            icon={<LocationFill color='red' className='pl-2' />}
            placeholder='Start'
          />
        </div>
      </div>
      <div className='absolute bottom-10 w-full bg-yellow-300'>
        <Button block loading={isLoading}>
          Confirm
        </Button>
      </div>
    </>
  )
}
