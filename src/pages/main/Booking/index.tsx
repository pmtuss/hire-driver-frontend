import { LocationFill, StarOutline } from 'antd-mobile-icons'
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react'
import GoongMap from '~/components/GoongMap/GoongMap'
import SearchInput2 from '~/components/GoongMap/SearchInput2'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getAddressByCoordinate, getDirection, getPlaceDetail } from '~/api/goong-map'
import { IAddress } from '~/types/dto/address.dto'
import { Layer, Marker, Source } from '@goongmaps/goong-map-react'
import { Button, Form, Loading, Picker, PickerRef, Selector, Toast } from 'antd-mobile'
import DirectionRender from '~/components/GoongMap/DirectionRender'
import { getAddresses } from '~/api/address'
import { getVehicles } from '~/api/vehicle'
import { calculateCost, formatMoney, locationEqual } from '~/utils/util'
import { PickerValue } from 'antd-mobile/es/components/picker'
import { createTrip } from '~/api/trip'
import { useNavigate } from 'react-router-dom'

export default function BookingPage() {
  const navigate = useNavigate()

  const [originText, setOriginText] = useState<string>('')
  const [destinationText, setDestinationText] = useState<string>('')

  const [origin, setOrigin] = useState<IAddress>()
  const [destination, setDestination] = useState<IAddress>()
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState(0)
  const [car, setCar] = useState<string[]>()

  const [form] = Form.useForm()

  const [map, setMap] = useState<any>()

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
    getPlaceDetailMutation.mutateAsync(address.place_id, {
      onSuccess: (data) => {
        setOrigin(data)
      }
    })
  }, [])

  const handleDestinationSelect = useCallback((address: any) => {
    setDestinationText(address.formatted_address)
    getPlaceDetailMutation.mutateAsync(address.place_id, {
      onSuccess: (data) => {
        setDestination(data)
      }
    })
  }, [])

  const {
    mutate: directionMutate,
    data: directionsData,
    reset: resetDirection
  } = useMutation({
    mutationFn: getDirection
  })

  useEffect(() => {
    if (origin && destination && map) {
      if (locationEqual(origin.location, destination.location)) {
        Toast.show({
          icon: 'fail',
          content: <div className='text-center'>Cannot direction between equal locations</div>
        })
        resetDirection()
      } else {
        directionMutate({ origin: origin.location, destination: destination.location })
      }
    } else {
    }
  }, [origin, destination, map])

  useEffect(() => {
    if (myAdds) {
      const defaultAdd = myAdds.find((item) => item.isDefault)
      if (defaultAdd) {
        setDestination(defaultAdd)
        setDestinationText(defaultAdd.formatted_address)
      }
    }
  }, [myAdds])

  const { mutateAsync: getAddByCoordMutate } = useMutation({
    mutationFn: getAddressByCoordinate
  })

  useEffect(() => {
    const showPosition = (position: any) => {
      const coord = position.coords
      getAddByCoordMutate({
        lat: coord.latitude,
        lng: coord.longitude
      }).then((res) => {
        const add = res[0]
        setOrigin({
          compound: add.compound,
          formatted_address: add.formatted_address,
          location: add.geometry.location,
          name: add.name,
          place_id: add.place_id
        })
        setOriginText(add.formatted_address)
      })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
    }
  }, [navigator.geolocation])

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
      Toast.clear()
      navigate(`/history`)
    }
  })

  const handleSubmit = (values: any) => {
    const sendData = {
      carId: values.car[0] as string,
      // origin,
      origin: origin?.location!,
      originText: origin?.formatted_address!,
      destination: destination?.location!,
      destinationText: destination?.formatted_address!,
      distance,
      duration,
      cost,
      route: directionsData?.routes[0].overview_polyline.points as string
    }
    mutateCreateTrip(sendData)
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

  if (isLoadingMyAdds || isLoadingCars) {
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
        {directionsData && <DirectionRender directions={directionsData} />}

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
              setOrigin(undefined)
              resetDirection()
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
              setDestination(undefined)
              resetDirection()
            }}
            onSelect={handleDestinationSelect}
            icon={<LocationFill color='red' className='pl-2' />}
            placeholder='Destination'
          />
        </div>
      </div>

      {directionsData && (
        <div className='absolute bottom-0  py-1 w-full  z-50 overflow-auto'>
          <div className='bg-white py-1 flex flex-col '>
            <Form
              validateMessages={{ required: '${label} is required!' }}
              requiredMarkStyle='none'
              layout='vertical'
              onFinish={handleSubmit}
              form={form}
            >
              <Form.Item
                name='car'
                label='Car'
                rules={[{ required: true }]}
                onClick={(e, pickerRef: RefObject<PickerRef>) => {
                  pickerRef.current?.open()
                }}
              >
                <Picker columns={columns} cancelText='Cancel' confirmText='OK' onConfirm={handleCarSelect}>
                  {(value) => {
                    return value.length !== 0 && value[0] ? (
                      <div className='text-base'>{value[0].label}</div>
                    ) : (
                      <div className='text-base text-gray-400'>Have not a car</div>
                    )
                  }}
                </Picker>
              </Form.Item>
              <div className='flex justify-between px-4 '>
                <div className='flex flex-col gap-2'>
                  <div className=''>
                    <span className='mr-2'>Distance</span>
                    <span>{distance}</span>
                  </div>
                  <div className=''>
                    <span className='mr-2'>Duration:</span>
                    <span>{duration}</span>
                  </div>
                  <div className=''>
                    <span className='mr-2'>Cost:</span>
                    <span>{formatMoney(cost)}</span>
                  </div>
                </div>

                <div className=''>
                  <Button type='submit' color='primary'>
                    Booking
                  </Button>
                </div>
              </div>
            </Form>
          </div>
          <div className=''></div>
        </div>
      )}
    </>
  )
}
