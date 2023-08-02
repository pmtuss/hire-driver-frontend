import { Button, Ellipsis, FloatingPanel, Switch, Toast } from 'antd-mobile'
import { useEffect, useState } from 'react'
import GoongMap from '~/components/GoongMap/GoongMap'
import { ExclamationShieldFill, LocationFill, StarOutline } from 'antd-mobile-icons'

import { Marker } from '@goongmaps/goong-map-react'
import { formatMoney } from '~/utils/util'
import DirectionRenderWithRoute from '~/components/GoongMap/DirectionRenderWithRoute'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getDirection } from '~/api/goong-map'
import useGeolocation from '~/hooks/useGeolocation'
import { ICoordinate } from '~/types/dto/goong-map.dto'
import DirectionRender from '~/components/GoongMap/DirectionRender'
import { useDriverStore } from '~/stores/driver.store'
import { useSocket } from '~/stores/socket.store'
import { TripStatus } from '~/constants/enum'
import { acceptTrip, getAcceptableTrips } from '~/api/trip'
import { getUserInfo } from '~/api/user'

const anchors = [200]

export default function RidesPage() {
  const { socket } = useSocket()

  const [currentLocation] = useGeolocation()
  // const [trip, setTrip] = useState<any>()
  const [trips, setTrips] = useState<any[]>([])

  const {
    trip,
    setTrip,

    isOnline,
    setIsOnline,

    tripStatus,
    setTripStatus
  } = useDriverStore((state) => state)

  const {
    mutate: mutateGetDirection,
    data: directionData,
    reset: resetDirection
  } = useMutation({
    mutationFn: getDirection,
    onSuccess: (data) => {
      socket?.emit('acceptTrip', {
        passenger: trip.passengerId,
        driverLocation: currentLocation,
        route: data.routes[0].overview_polyline.points
      })
    }
  })

  const getUserInfoQuery = useQuery({
    queryKey: ['users', trip?.passenger],
    queryFn: () => getUserInfo(trip?.passenger),
    enabled: !!trip
  })

  const acceptTripMutation = useMutation({
    mutationFn: () => acceptTrip(trip._id),
    onSuccess: () => {
      setTripStatus(TripStatus.ACCEPTED)
    },
    onError: (error: any) => {
      Toast.show({
        icon: 'fail',
        content: error.error
      })
      resetDirection()
      setTrip(undefined)
      setTrips([...trips.filter((item) => item._id != trip._id)])
    }
  })

  const { mutate: mutateGetAcceptableTrips } = useMutation({
    mutationFn: getAcceptableTrips,
    onSuccess: (data) => {
      setTrips(data)
    }
  })

  useEffect(() => {
    if (tripStatus === '') {
      mutateGetAcceptableTrips()
    }
  }, [tripStatus])

  const handleAccept = () => {
    acceptTripMutation.mutate()
  }

  const handleCancel = () => {
    resetDirection()
    setTrip(undefined)
  }

  useEffect(() => {
    if (socket) {
      socket?.on('new-ride-request', (data) => {
        setTrips([...trips, data])
      })
    }
  }, [socket])

  useEffect(() => {
    return () => {
      socket?.off('new-ride-request')
    }
  }, [])

  const handleToggleOnline = (online: boolean) => {
    setIsOnline(online)
    if (online) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket?.emit('driver-connect', { latitude: position.coords.latitude, longitude: position.coords.longitude })
        })
      }
    } else {
      socket?.emit('driver-disconnect', 'disconnect')
    }
  }

  useEffect(() => {
    if (tripStatus === TripStatus.ACCEPTED && currentLocation && trip) {
      mutateGetDirection({
        origin: currentLocation as ICoordinate,
        destination: trip.origin
      })
    }

    if (tripStatus !== TripStatus.ACCEPTED || !trip) return
    const timer = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket?.emit('updateDriverLocation', {
            passengerId: trip.passenger,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }, 1000)

    return () => {
      clearInterval(timer)
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
            {tripStatus !== TripStatus.ACCEPTED && (
              <>
                <DirectionRenderWithRoute sourceId='1111' polylineString={trip.route} />
                <Marker
                  longitude={trip.destination.lng}
                  latitude={trip.destination.lat}
                  offsetLeft={-15}
                  offsetTop={-30}
                >
                  <LocationFill fontSize={30} color='red' />
                </Marker>
              </>
            )}
            <Marker longitude={trip.origin.lng} latitude={trip.origin.lat} offsetLeft={-15} offsetTop={-30}>
              <LocationFill fontSize={30} color='blue' />
            </Marker>
          </>
        )}

        {trip && directionData && tripStatus === TripStatus.ACCEPTED && (
          <DirectionRender directions={directionData} color='#000000' />
        )}
      </GoongMap>

      <div className='absolute top-10 right-5 bg-white px-3 py-1 rounded-lg shadow-lg'>
        <span className='mr-2'>Online</span>
        <Switch
          checked={isOnline}
          onChange={handleToggleOnline}
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
                    // src='https://sm.ign.com/t/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.300.jpg'
                    src={getUserInfoQuery.data?.avatar}
                    alt=''
                    className='h-full w-full rounded-full object-cover'
                  />
                </div>
                <div className='font-bold'>{getUserInfoQuery.data?.name}</div>
                <div className=''>{getUserInfoQuery.data?.phone}</div>
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
                    Đóng
                  </Button>
                  <Button color='primary' className='text-sm px-5' onClick={handleAccept}>
                    Chấp nhận
                  </Button>
                </>
              )}

              {tripStatus == TripStatus.ACCEPTED && (
                <Button
                  color='primary'
                  className='text-sm px-5'
                  onClick={() => {
                    setTripStatus(TripStatus.ARRIVED_START)
                    socket?.emit('arriveStart', trip)
                  }}
                  block
                >
                  Đã đến vị trí bắt đầu
                </Button>
              )}

              {tripStatus == TripStatus.ARRIVED_START && (
                <Button
                  color='primary'
                  className='text-sm px-5'
                  onClick={() => {
                    setTripStatus(TripStatus.RUNNING)
                    socket?.emit('startTrip', trip)
                  }}
                  block
                >
                  Bắt đầu chuyến đi
                </Button>
              )}

              {tripStatus == TripStatus.RUNNING && (
                <Button
                  color='primary'
                  className='text-sm px-5'
                  onClick={() => {
                    setTripStatus(TripStatus.FINISHED)
                    socket?.emit('finishTrip', trip)
                    resetDirection()
                    setTrip(undefined)
                    setTripStatus('')

                    Toast.show({
                      icon: 'success',
                      content: 'Đã hoàn thành chuyến đi'
                    })
                  }}
                  block
                >
                  Đã đến vị trí kết thúc
                </Button>
              )}
            </div>
          </>
        </FloatingPanel>
      )}
    </>
  )
}
