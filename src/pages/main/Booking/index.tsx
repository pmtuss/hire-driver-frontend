import { LocationFill, StarOutline, UserCircleOutline } from 'antd-mobile-icons'
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react'
import GoongMap from '~/components/GoongMap/GoongMap'
import SearchInput2 from '~/components/GoongMap/SearchInput2'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getAddressByCoordinate, getDirection, getPlaceDetail } from '~/api/goong-map'
import { Marker } from '@goongmaps/goong-map-react'
import { Button, Form, Loading, Picker, PickerRef, Toast } from 'antd-mobile'
import DirectionRender from '~/components/GoongMap/DirectionRender'
import { getAddresses } from '~/api/address'
import { getVehicles } from '~/api/vehicle'
import { calculateCost, formatMoney, locationEqual } from '~/utils/util'
import { PickerValue } from 'antd-mobile/es/components/picker'
import { createTrip, getCurrentTrip, updateTrip } from '~/api/trip'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '~/stores/socket.store'

import './index.css'
import classNames from 'classnames'
import { usePassengerStore } from '~/stores/passenger.store'
import { TripStatus } from '~/constants/enum'
import DirectionRenderWithRoute from '~/components/GoongMap/DirectionRenderWithRoute'
import { getUserInfo } from '~/api/user'
import { ICoordinate } from '~/types/dto/goong-map.dto'

export default function BookingPage() {
  const { socket } = useSocket()

  const navigate = useNavigate()

  const {
    originText,
    setOriginText,
    destinationText,
    setDestinationText,

    origin,
    setOrigin,
    destination,
    setDestination,
    status,
    setStatus,

    directionsData,
    setDirectionsData,

    driver,
    setDriver,

    trip,
    setTrip
  } = usePassengerStore((state) => state)

  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState(0)
  const [car, setCar] = useState<string[]>()
  const [driverLocation, setDriverLocation] = useState<ICoordinate>()
  const [route, setRoute] = useState('')

  const [form] = Form.useForm()

  const [map, setMap] = useState<any>()

  const { data: currentTrip, isLoading: getCurrentTripLoading } = useQuery({
    queryKey: ['trips', 'current'],
    queryFn: getCurrentTrip,
    retry: false
  })

  useEffect(() => {
    if (currentTrip) {
      setOrigin(currentTrip.origin)
      setDestination(currentTrip.destination)
      setOriginText(currentTrip.originText)
      setDestinationText(currentTrip.destinationText)
      setStatus(currentTrip.status!)
      setTrip(currentTrip)
    }
  }, [currentTrip])

  const getPlaceDetailMutation = useMutation({
    mutationFn: getPlaceDetail
  })

  const { data: myAdds, isLoading: isLoadingMyAdds } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses
  })

  const { data: myCars, isLoading: isLoadingCars } = useQuery({
    queryKey: ['vehices'],
    queryFn: getVehicles
  })

  const handleOriginSelect = useCallback((address: any) => {
    setOriginText(address.formatted_address)
    if (address.location) {
      setOrigin(address.location)
    } else {
      getPlaceDetailMutation.mutateAsync(address.place_id, {
        onSuccess: (data) => {
          // setOrigin(data)
          setOrigin(data.location)
        }
      })
    }
  }, [])

  const handleDestinationSelect = useCallback((address: any) => {
    setDestinationText(address.formatted_address)
    if (address.location) {
      setDestination(address.location)
    } else {
      getPlaceDetailMutation.mutateAsync(address.place_id, {
        onSuccess: (data) => {
          // setDestination(data)
          setDestination(data.location)
        }
      })
    }
  }, [])

  const {
    mutate: directionMutate,
    // data: directionsData,
    reset: resetDirection
  } = useMutation({
    mutationFn: getDirection,
    onSuccess: (data) => {
      setDirectionsData(data)
    }
  })

  useEffect(() => {
    if (origin && destination && map) {
      if (locationEqual(origin, destination)) {
        Toast.show({
          icon: 'fail',
          content: <div className='text-center'>Cannot direction between equal locations</div>
        })
        // resetDirection()
        setDirectionsData(undefined)
      } else {
        directionMutate({ origin, destination })
      }
    } else {
    }
  }, [origin, destination, map])

  useEffect(() => {
    if (myAdds) {
      const defaultAdd = myAdds.find((item) => item.isDefault)
      if (defaultAdd) {
        // setDestination(defaultAdd)
        setDestination(defaultAdd.location)
        setDestinationText(defaultAdd.formatted_address)
      }
    }
  }, [myAdds])

  const { mutateAsync: getAddByCoordMutate } = useMutation({
    mutationFn: getAddressByCoordinate
  })

  useEffect(() => {
    if (status !== '') return
    const showPosition = (position: any) => {
      const coord = position.coords
      getAddByCoordMutate({
        lat: coord.latitude,
        lng: coord.longitude
      }).then((res) => {
        const add = res[0]
        setOrigin(add.geometry.location)
        setOriginText(add.formatted_address)
      })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
    }
  }, [navigator.geolocation])

  const getUserInfoMutation = useMutation({
    mutationFn: (id: string) => getUserInfo(id)
  })

  useEffect(() => {
    if (!socket) return
    socket.on('tripAccepted', (data) => {
      console.log(data)
      setStatus(TripStatus.ACCEPTED)
      // setDriver({ ...driver, route: data.route, location: data.driverLocation })
      setRoute(data.route)
      setDriverLocation(data.driverLocation)
      getUserInfoMutation.mutate(data.driver)
    })
    socket.on('driverArrived', (data) => {
      console.log(data)
      setStatus(TripStatus.ARRIVED_START)
    })
    socket.on('tripStart', (data) => {
      console.log(data)
      setStatus(TripStatus.RUNNING)
    })
    socket.on('tripFinished', (data) => {
      console.log(data)

      Toast.show({
        icon: 'success',
        content: <div className='text-center'>Bạn đã hoàn thành chuyến đi</div>
      })
      setStatus(TripStatus.FINISHED)

      setOrigin(undefined)
      setDestination(undefined)
      setDirectionsData(undefined)
      setStatus('')
      setDriverLocation(undefined)
      setRoute('')
    })

    socket.on('driverLocation', (data) => {
      setDriverLocation(data)
    })
  }, [socket])

  useEffect(() => {
    return () => {
      socket?.off('tripAccepted')
      socket?.off('driverArrived')
      socket?.off('tripStart')
      socket?.off('tripFinished')
      socket?.off('driverLocation')
    }
  }, [])

  const columns = useMemo(() => {
    if (!myCars) return [['']]

    return [
      myCars.map((car, index) => {
        return {
          label: (
            <div className={`flex items-center text-sm gap-2`}>
              <div className={`h-3 w-3 border border-solid border-black`} style={{ backgroundColor: car.color }}></div>
              {car.model}
              <span>{car.plate}</span>
            </div>
          ),
          value: car._id!,
          key: car._id!
        }
      })
    ]
  }, [myCars])

  const { mutate: mutateCreateTrip } = useMutation({
    mutationFn: createTrip,
    onSuccess: (data) => {
      // navigate(`/history`)
      setTrip(data)
      socket?.emit('requestTrip', data)
    }
  })

  const handleSubmit = (values: any) => {
    const currentCar = myCars?.find((car) => car._id === values.car[0])
    const sendData = {
      car: {
        color: currentCar?.color!,
        plate: currentCar?.plate!,
        model: currentCar?.model!
      },
      origin: origin!,
      originText: originText!,
      destination: destination!,
      destinationText: destinationText!,
      distance,
      duration,
      cost,
      route: directionsData?.routes[0].overview_polyline.points as string,
      status: TripStatus.CREATED
    }

    mutateCreateTrip(sendData)
    setStatus(TripStatus.CREATED)
  }

  useEffect(() => {
    if (directionsData) {
      const routeInfo = directionsData.routes[0].legs[0]
      setDistance(routeInfo.distance.text)
      setDuration(routeInfo.duration.text)
      setCost(calculateCost(routeInfo.distance.value / 1000))
    }
  }, [directionsData])

  useEffect(() => {
    if (myCars) {
      const defaultCars = myCars.filter((car) => car.isDefault).map((car) => car._id!)
      setCar(defaultCars)
    }
  }, [myCars])

  useEffect(() => {
    if (car) {
      form.setFieldsValue({ car })
    }
  }, [car])

  const handleCarSelect = (value: PickerValue[]) => {
    setCar(value as string[])
  }

  const { mutate: updateTripMutate } = useMutation({
    mutationFn: (variable: any) => updateTrip(variable),
    onSuccess: (body, variables) => {
      if (variables.body.status === TripStatus.CANCELED) {
        Toast.show({
          icon: 'success',
          content: 'Huỷ chuyến đi thành công'
        })
        setOrigin(undefined)
        setDestination(undefined)
        setDirectionsData(undefined)
        setDestinationText('')
        setOriginText('')
        setStatus('')

        socket?.emit('tripCanceled')
      }
    },
    onError: () => {
      Toast.show({})
    }
  })

  const handleCancel = () => {
    updateTripMutate({ id: trip._id, body: { status: TripStatus.CANCELED } })
  }

  if (isLoadingMyAdds || isLoadingCars || getCurrentTripLoading) {
    return (
      <div className='h-full flex justify-center items-center text-xl'>
        <Loading color='primary' />
      </div>
    )
  }

  return (
    <>
      <GoongMap
        onLoad={(map: any) => {
          setMap(map.target)
        }}
        autoGeolocate={false}
      >
        {map && directionsData && status !== TripStatus.ACCEPTED && origin && destination && (
          <DirectionRender directions={directionsData} />
        )}

        {map && route && status === TripStatus.ACCEPTED && (
          <DirectionRenderWithRoute polylineString={route} color='#000000' sourceId='driverRoute' />
        )}

        {/* {driver.location && (
          <Marker latitude={driver.location.lat} longitude={driver.location.lng} offsetLeft={-20} offsetTop={-40}>
            <UserCircleOutline color='orange' fontSize={40} />
          </Marker>
        )} */}
        {driverLocation && (
          <Marker latitude={driverLocation.lat} longitude={driverLocation.lng} offsetLeft={-20} offsetTop={-40}>
            <UserCircleOutline color='orange' fontSize={40} />
          </Marker>
        )}

        {origin && (
          <Marker latitude={origin.lat} longitude={origin.lng} offsetLeft={-20} offsetTop={-40}>
            <LocationFill color='blue' fontSize={40} />
          </Marker>
        )}

        {destination && (
          <Marker latitude={destination.lat} longitude={destination.lng} offsetLeft={-20} offsetTop={-40}>
            <LocationFill color='red' fontSize={40} />
          </Marker>
        )}
      </GoongMap>

      {/* Create trip input: origin, destination */}
      {true && (
        <div
          className={classNames('absolute top-0 py-4 w-full bg-transparent', {
            'bg-white shadow-md': status !== ''
          })}
        >
          <div className='px-8 mb-2'>
            <SearchInput2
              value={originText}
              onChange={(value) => {
                setOriginText(value)
                setOrigin(undefined)
                resetDirection()
              }}
              disabled={status !== ''}
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
                setDestination(undefined)
                resetDirection()
              }}
              disabled={status !== ''}
              onSelect={handleDestinationSelect}
              icon={<LocationFill color='red' className='pl-2' />}
              placeholder='Destination'
            />
          </div>

          {status !== '' && (
            <>
              <div className='flex justify-between text-sm mt-2 px-8 '>
                <div className=''>
                  Khoảng cách:
                  <span> {distance}</span>
                </div>
                <div className=''>
                  Thời gian:
                  <span> {duration}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {/* Create trip form info */}
      {directionsData && (
        <div className='absolute bottom-0  py-1 w-full  z-50 overflow-auto'>
          <div className='bg-white py-1 flex flex-col '>
            {status === '' && (
              <Form
                validateMessages={{ required: '${label} chưa được điền!' }}
                requiredMarkStyle='none'
                layout='vertical'
                onFinish={handleSubmit}
                form={form}
                className='no-border'
              >
                <Form.Item
                  name='car'
                  label='Phương tiện'
                  rules={[{ required: true }]}
                  onClick={(e, pickerRef: RefObject<PickerRef>) => {
                    if (columns[0].length == 0) {
                      navigate('/vehicles/new')
                    } else {
                      pickerRef.current?.open()
                    }
                  }}
                >
                  <Picker columns={columns} cancelText='Đóng' confirmText='OK' onConfirm={handleCarSelect}>
                    {(value) => {
                      return value.length !== 0 && value[0] ? (
                        <div className='text-base'>{value[0].label}</div>
                      ) : (
                        <div className='text-base text-gray-400'>Bạn chưa có phương tiện nào! Bấm để thêm!</div>
                      )
                    }}
                  </Picker>
                </Form.Item>
                <div className='flex justify-between px-4 '>
                  <div className='flex flex-col gap-2'>
                    <div className=''>
                      <span className='mr-2'>Khoảng cách:</span>
                      <span>{distance}</span>
                    </div>
                    <div className=''>
                      <span className='mr-2'>Thời gian:</span>
                      <span>{duration}</span>
                    </div>
                    <div className=''>
                      <span className='mr-2'>Giá:</span>
                      <span>{formatMoney(cost)}</span>
                    </div>
                  </div>

                  <div className=''>
                    <Button type='submit' color='primary'>
                      Đặt chuyến đi
                    </Button>
                  </div>
                </div>
              </Form>
            )}

            {status === TripStatus.CREATED && (
              <div className='h-32 flex flex-col justify-center items-center text-lg'>
                <div className=''>Đang tìm tài xế</div>
                <Loading color='primary' />
                <Button color='danger' onClick={handleCancel}>
                  Huỷ chuyến đi
                </Button>
              </div>
            )}

            {status !== '' && status !== TripStatus.CREATED && (
              <div className='h-32 text-base'>
                <div className='text-center  text-base font-bold'>
                  {status === TripStatus.ACCEPTED
                    ? 'Tài xế đang đến chỗ bạn'
                    : status === TripStatus.ARRIVED_START
                    ? 'Tài xế đã đến chỗ bạn'
                    : status === TripStatus.RUNNING
                    ? 'Đang đưa bạn tới điểm đến'
                    : ''}
                </div>
                <div className='flex px-8 py-4 gap-10 items-center'>
                  <div className='h-[72px] w-[72px] rounded-full'>
                    <img
                      // src='https://img.freepik.com/premium-photo/portrait-beautiful-anime-girl-avatar-computer-graphic-background-2d-illustration_67092-2017.jpg?w=740'
                      src={getUserInfoMutation.data?.avatar}
                      alt=''
                      className='h-full w-full rounded-full object-cover'
                    />
                  </div>
                  <div className=''>
                    <div className='font-bold '>{getUserInfoMutation.data?.name}</div>
                    <div className='text-sm'>{getUserInfoMutation.data?.phone}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
