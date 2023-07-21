import { Button, Ellipsis, FloatingPanel, Switch, Toast } from 'antd-mobile'
import React, { useEffect, useState } from 'react'
import GoongMap from '~/components/GoongMap/GoongMap'
import DefaultPicture from '~/assets/default.png'
import { ExclamationShieldFill, LocationFill, StarOutline } from 'antd-mobile-icons'

import { trips } from './data'
import { Marker, Popup } from '@goongmaps/goong-map-react'
import { formatMoney } from '~/utils/util'
import DirectionRenderWithRoute from '~/components/GoongMap/DirectionRenderWithRoute'
import { useMutation } from '@tanstack/react-query'
import { getDirection } from '~/api/goong-map'
import useGeolocation from '~/hooks/useGeolocation'
import { ICoordinate } from '~/types/dto/goong-map.dto'
import DirectionRender from '~/components/GoongMap/DirectionRender'
import { useDriverStore } from '~/stores/driver.store'

const anchors = [150, window.innerHeight * 0.3]

export default function RidesPage() {
  const [currentLocation] = useGeolocation()
  // const [trip, setTrip] = useState<any>()
  const { trip, setTrip } = useDriverStore((state) => state)
  const { isOnline, setIsOnline } = useDriverStore((state) => state)
  const { tripStatus, setTripStatus } = useDriverStore((state) => state)
  // const [isOnline, setIsOnline] = useState(false)
  // const [status, setStatus] = useState('')

  const {
    mutate: mutateGetDirection,
    data: directionData,
    reset: resetDirection
  } = useMutation({
    mutationFn: getDirection,
    onSuccess: (data) => {
      console.log(data)
    }
  })

  const handleAccept = () => {
    setTripStatus('started')

    // if (currentLocation && trip) {
    //   mutateGetDirection({
    //     origin: currentLocation as ICoordinate,
    //     destination: trip.origin
    //   })
    // }
  }

  const handleCancel = () => {
    resetDirection()
    setTrip(undefined)
  }

  useEffect(() => {
    if (tripStatus === 'started' && currentLocation && trip) {
      mutateGetDirection({
        origin: currentLocation as ICoordinate,
        destination: trip.origin
      })
    }
  }, [tripStatus, currentLocation, trip])

  return (
    <>
      <GoongMap autoGeolocate geolocateStyle={{ bottom: 210 }}>
        {isOnline &&
          !trip &&
          trips.map((trip, index) => {
            const start = trip.origin
            return (
              <Marker key={index} longitude={start.lng} latitude={start.lat} offsetLeft={-15} offsetTop={-30}>
                <ExclamationShieldFill fontSize={30} color='orange' onClick={() => setTrip(trip)} />
              </Marker>
            )
          })}

        {trip && (
          <>
            <DirectionRenderWithRoute sourceId='1111' polylineString={trip.route} />
            <Marker longitude={trip.origin.lng} latitude={trip.origin.lat} offsetLeft={-15} offsetTop={-30}>
              <LocationFill fontSize={30} color='blue' />
            </Marker>
            <Marker longitude={trip.destination.lng} latitude={trip.destination.lat} offsetLeft={-15} offsetTop={-30}>
              <LocationFill fontSize={30} color='red' />
            </Marker>
          </>
        )}

        {trip && directionData && <DirectionRender directions={directionData} color='#f0f060' />}
      </GoongMap>

      <div className='absolute top-10 right-5 bg-white px-3 py-1 rounded-lg shadow-lg'>
        <span className='mr-2'>Online</span>
        <Switch
          checked={isOnline}
          onChange={(checked) => setIsOnline(checked)}
          style={{ '--height': '25px', '--width': '35px' }}
          disabled={!!trip}
        />
      </div>

      {isOnline && trip && (
        <FloatingPanel anchors={anchors}>
          <>
            <div className='px-5 flex items-center'>
              <div className='text-center'>
                <div className='h-16 w-16 rounded-full'>
                  <img
                    src='https://sm.ign.com/t/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.300.jpg'
                    alt=''
                    className='h-full w-full rounded-full object-cover'
                  />
                </div>
                <div className='font-bold'>Alex</div>
                <div className=''>0389777546</div>
              </div>
              <div className='flex-1'>
                <div className='ml-6 flex flex-col gap-1 '>
                  <div className=' font-bold text-base'>
                    <span className='mr-10'>{formatMoney(trip.cost)}</span>
                    <span>{trip.distance}</span>
                  </div>
                  <div className='flex items-center'>
                    <StarOutline color='blue' fontSize={16} />
                    <div className='flex-1 ml-1'>
                      <Ellipsis direction='end' content={trip.originText} />
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <LocationFill color='red' fontSize={16} />
                    <div className='flex-1 ml-1'>
                      <Ellipsis direction='end' content={trip.destinationText} />
                    </div>
                  </div>
                  <div className='flex gap-2 items-center mt-1'>
                    <div
                      className='h-2.5 w-2.5 border border-solid border-black'
                      style={{ backgroundColor: trip.car.color }}
                    ></div>
                    <div className=''>{trip.car.model}</div>
                    <span>{trip.car.plate}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex px-10 mt-4 justify-evenly'>
              {!tripStatus && (
                <>
                  <Button color='danger' fill='outline' className='text-sm px-5' onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button color='primary' className='text-sm px-5' onClick={handleAccept}>
                    Accept
                  </Button>
                </>
              )}

              {tripStatus == 'started' && (
                <Button
                  color='primary'
                  className='text-sm px-5'
                  onClick={() => {
                    setTripStatus('arrivedPickupLocation')
                  }}
                  block
                >
                  Arrived pickup location
                </Button>
              )}

              {tripStatus == 'arrivedPickupLocation' && (
                <Button
                  color='primary'
                  className='text-sm px-5'
                  onClick={() => {
                    setTripStatus('arrived')

                    resetDirection()
                    setTrip(undefined)
                    setTripStatus('')

                    Toast.show({
                      icon: 'success',
                      content: 'Trip finished'
                    })
                  }}
                  block
                >
                  Arrived
                </Button>
              )}
            </div>
          </>
        </FloatingPanel>
      )}
    </>
  )
}
