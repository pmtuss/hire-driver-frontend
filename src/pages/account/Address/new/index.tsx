import { HTMLOverlay, MapContext, Marker } from '@goongmaps/goong-map-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, ButtonProps, Dialog, Input, InputRef, Loading, Mask, Switch, Toast } from 'antd-mobile'
import { LocationFill } from 'antd-mobile-icons'
import { debounce } from 'lodash'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createAddress, deleteAddress, getAddress, updateAddress } from '~/api/address'
import { getAddressByCoordinate, getPlaceDetail } from '~/api/goong-map'
import GoongMap from '~/components/GoongMap/GoongMap'
import SearchInput2 from '~/components/GoongMap/SearchInput2'
import { CreateAddressRequestDto } from '~/types/dto/address.dto'
import { ICoordinate } from '~/types/dto/goong-map.dto'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: any) => void
}

const SearchInput = (props: SearchInputProps) => {
  const { value, onChange, onSelect } = props

  const { viewport, onViewportChange } = useContext(MapContext)
  // const [input, setInput] = useState<string>('')

  const getPlaceDetailMutation = useMutation({
    mutationFn: getPlaceDetail,
    onSuccess: (data: any) => {
      // console.log(data)
      const location = data.location
      onViewportChange?.({ ...viewport, longitude: location.lng, latitude: location.lat, transitionDuration: 1000 })
    }
  })

  const handleSelect = (value: any) => {
    getPlaceDetailMutation.mutate(value.place_id)
    onSelect(value)
  }
  const handleInputChange = (value: string) => {
    onChange(value)
  }

  const redraw = () => {
    return (
      <div className='px-8'>
        <SearchInput2
          value={value}
          onChange={handleInputChange}
          onSelect={handleSelect}
          icon={<LocationFill color='red' className='pl-2' />}
          placeholder='Address'
        />
      </div>
    )
  }
  return <HTMLOverlay redraw={redraw} captureDoubleClick style={{ top: 10, height: 'auto' }} />
}

interface ConfirmButtonProps {
  // loading?: boolean
  // onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  buttonProps?: ButtonProps
  overLayStyle?: Object
  children: React.ReactNode
}
// const ConfirmButton = ({ loading, onClick }: ConfirmButtonProps) => {
//   const {buttonProps, overLayProps}  = props

const OverLayButton = (props: ConfirmButtonProps) => {
  const { buttonProps, overLayStyle, children } = props
  const { children: buttonChild, ...restButtonProps } = buttonProps!
  const redraw = () => {
    return (
      <div className='px-8 '>
        <Button loading={buttonProps?.loading} onClick={buttonProps?.onClick} {...restButtonProps}>
          {children}
        </Button>
      </div>
    )
  }

  return <HTMLOverlay redraw={redraw} style={overLayStyle} captureDoubleClick captureClick />
}

export default function AddressNewPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEditMode = !!id

  const [visible, setVisible] = useState(false)
  const [isDefault, setIsDefault] = useState(false)
  const [address, setAddress] = useState<CreateAddressRequestDto>()

  const [name, setName] = useState<string>('')

  const [map, setMap] = useState<any>(null)
  const [input, setInput] = useState<string>('')

  const [isSearching, setIsSearching] = useState<boolean>(false)

  const [center, setCenter] = useState<ICoordinate>()

  const { data: queryData, isLoading: getAddressLoading } = useQuery({
    queryKey: ['Addresses', id],
    queryFn: () => getAddress(id as string),
    enabled: !!id
  })

  const handleViewportChange = (viewport: any) => {
    setCenter({ lat: viewport.latitude, lng: viewport.longitude })
    setIsSearching(true)
  }

  const handleAddressChange = (value: any) => {
    setInput(value.description)
  }

  const searchDebounce = useCallback(
    debounce((center: ICoordinate) => {
      mutateGetAddressByCoord(center)
    }, 400),
    []
  )

  const { mutate: mutateGetAddressByCoord } = useMutation({
    mutationFn: getAddressByCoordinate,
    onSuccess: (data) => {
      // console.log(data)
      const first = data[0]
      // console.log(first)

      setAddress({
        formatted_address: first.formatted_address,
        // place_id: first.place_id,
        // compound: first.compound,
        location: first.geometry.location,
        name: name,
        isDefault: isDefault
      })

      setInput(first.formatted_address)
      setIsSearching(false)
    }
  })

  useEffect(() => {
    if (center) searchDebounce(center)
  }, [center])

  const { mutate: mutationCreateAddress } = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      console.log('create')
      Toast.show({
        icon: 'success',
        duration: 1000,
        content: 'Thêm mới thành công',
        afterClose() {
          navigate(-1)
        }
      })
    }
  })

  const { mutate: mutateUpdateAddress } = useMutation({
    mutationFn: (body: CreateAddressRequestDto) => updateAddress(id as string, body),
    onSuccess: () => {
      Toast.show({
        icon: 'success',
        duration: 1000,
        content: 'Cập nhật thành công',
        afterClose() {
          navigate(-1)
        }
      })
    },
    onError: (error: any) => {
      Toast.show({
        icon: 'fail',
        duration: 1000,
        content: error.message || error.error
      })
    }
  })

  const handleAdd = () => {
    setVisible(false)
    if (address) {
      const sendData = {
        ...address,
        name,
        isDefault
      }
      if (!isEditMode) {
        mutationCreateAddress(sendData)
      } else {
        mutateUpdateAddress(sendData)
      }
    }
  }

  const { mutate: mutateDeleteAddress } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      Toast.show({
        icon: 'success',
        content: 'Xoá thành công',
        duration: 1000,
        afterClose: () => navigate(-1)
      })
    },
    onError: (error: any) => {
      console.log({ error })
      Toast.show({
        icon: 'fail',
        content: error.message || error.error
      })
    }
  })

  useEffect(() => {
    if (queryData) {
      setCenter(queryData.location)
      setName(queryData.name)
      setIsDefault(!!queryData.isDefault)
    }
  }, [queryData])

  if (isEditMode && getAddressLoading) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <Loading color='primary' className='text-2xl' />
      </div>
    )
  }

  return (
    <>
      <GoongMap
        autoGeolocate={!isEditMode}
        onLoad={(map: any) => setMap(map.target)}
        onViewportChange={handleViewportChange}
        initViewport={{
          latitude: queryData ? queryData?.location.lat : 21.026975,
          longitude: queryData ? queryData?.location.lng : 105.85346,
          zoom: 15
        }}
      >
        {/* Center marker */}
        {map && center && (
          <Marker longitude={center.lng} latitude={center.lat} offsetTop={-40} offsetLeft={-20}>
            <LocationFill color='red' fontSize={40} />
          </Marker>
        )}

        <SearchInput value={input} onChange={(value) => setInput(value)} onSelect={handleAddressChange} />

        <OverLayButton
          buttonProps={{
            loading: isSearching,
            onClick: () => {
              setVisible(true)
            },
            color: 'primary',
            block: true
          }}
          overLayStyle={{ width: '100%', height: 'auto', bottom: 40, top: 'auto' }}
        >
          Xác nhận
        </OverLayButton>

        {isEditMode && (
          <OverLayButton
            buttonProps={{
              color: 'danger',
              block: true,
              className: 'bg-white',
              onClick: () => {
                Dialog.confirm({
                  content: 'Xoá địa chỉ này?',
                  confirmText: <span className='text-danger'>Xoá</span>,
                  cancelText: 'Đóng',
                  onConfirm: () => mutateDeleteAddress(id as string)
                })
              }
            }}
            overLayStyle={{ width: '100%', height: 'auto', bottom: 90, top: 'auto' }}
          >
            Xoá địa chỉ
          </OverLayButton>
        )}
      </GoongMap>
      <Mask visible={visible} onMaskClick={() => setVisible(false)}>
        <div
          className='absolute top-1/4 left-1/2 -translate-x-1/2  bg-white rounded-md
          w-4/6 py-4 px-4 text-sm
        '
        >
          <div>Tên</div>
          <div className='px-3 border border-solid rounded-md py-1 my-2'>
            <Input value={name} onChange={(val) => setName(val)} style={{ '--font-size': '15px' }} clearable />
          </div>

          <div className='flex justify-between items-center mb-2'>
            <div className=''>Đặt làm mặc định</div>
            <Switch
              checked={isDefault}
              onChange={(checked) => setIsDefault(checked)}
              style={{ '--height': '28px', '--width': '48px' }}
              disabled={queryData?.isDefault}
            />
          </div>
          <div className=''>
            <Button block color='primary' size='small' onClick={handleAdd}>
              {isEditMode ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </div>
      </Mask>
    </>
  )
}
