import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { DotLoading, Ellipsis, Input, List } from 'antd-mobile'
import classnames from 'classnames'

import './index.css'
import { debounce } from 'lodash'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getAddressByCoordinate, getAutoComplete, getPlaceDetail } from '~/api/goong-map'
import { AddressPrediction } from '~/types/dto/goong-map.dto'
import { getAddresses } from '~/api/address'

interface SearchInput2Props {
  value?: string
  onChange?: (value: string) => void
  onSelect?: (value: any) => void
  icon?: ReactNode
  placeholder?: string
}

const SearchInput2: FC<SearchInput2Props> = (props) => {
  const { value, onChange, onSelect, icon, placeholder } = props

  const [isFocus, setIsFocus] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const {
    mutate,
    data,
    isLoading,
    reset: resetPredict
  } = useMutation({
    mutationFn: getAutoComplete,
    onSuccess: (data) => {
      console.log({ data })
    }
  })

  const { data: myAdds } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses
  })

  const {} = useMutation({
    mutationFn: getPlaceDetail,
    onSuccess: (data) => {
      console.log({ data })
    }
  })

  const searchAddress = useMemo(() => {
    return debounce((value: string) => {
      mutate({ input: value })
    }, 400)
  }, [])

  const handleChange = useCallback(
    (value: string) => {
      onChange?.(value)
      resetPredict()
      if (value && value.length >= 3) searchAddress(value)
    },
    [onChange]
  )

  const handleSelect = useCallback(
    (value: any) => {
      onSelect?.(value)
      setVisible(false)
    },
    [onSelect]
  )

  const handleFocus = useCallback(() => {
    // show select list
    setVisible(true)
    setIsFocus(true)
  }, [])

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      // hide select list
      setVisible(false)
      setIsFocus(false)
    }, 300)
  }, [])

  const { mutateAsync: getAddByCoord } = useMutation({
    mutationFn: getAddressByCoordinate
  })

  const getCurrentPosition = () => {
    const showPosition = (position: any) => {
      const coord = position.coords
      getAddByCoord({
        lat: coord.latitude,
        lng: coord.longitude
      }).then((res) => {
        const add = res[0]
        handleSelect({
          compound: add.compound,
          formatted_address: add.formatted_address,
          location: add.geometry.location,
          name: add.name,
          place_id: add.place_id
        })
      })
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition)
    }
  }

  return (
    <div
      className={classnames('bg-white rounded-md border border-solid ', {
        'border-blue-400': isFocus,
        'border-slate-400': !isFocus
      })}
    >
      {/* Input group*/}
      <div className='flex items-center'>
        {/* prefix icon */}
        {icon}

        {/* input  */}
        <div className='flex-1 pl-2 pr-1'>
          <Input
            value={value}
            clearable
            style={{ '--font-size': 'var(--adm-font-size-5)' }}
            className='py-1'
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Search results list */}
      {visible && (
        <div className='relative'>
          <div className='absolute top-1 bg-white w-full'>
            <List style={{ '--font-size': '13px' }}>
              {isLoading && (
                <List.Item arrow={false}>
                  <div className='text-center text-xl'>
                    <DotLoading color='primary' />
                  </div>
                </List.Item>
              )}

              {myAdds && !data && (
                <>
                  <List.Item
                    arrow={false}
                    onClick={() => {
                      getCurrentPosition()
                    }}
                  >
                    <div className='py-2'>Choose your location</div>
                  </List.Item>
                  {myAdds.map((item, index) => {
                    return (
                      <List.Item
                        key={item._id}
                        arrow={false}
                        onClick={() => {
                          handleSelect(item)
                        }}
                      >
                        <div className='font-bold'>{item.name}</div>
                        <Ellipsis className='' direction='end' content={item.formatted_address} />
                      </List.Item>
                    )
                  })}
                </>
              )}

              {!isLoading &&
                data &&
                data.map((item, index) => {
                  return (
                    <List.Item
                      key={index}
                      onClick={() => {
                        handleSelect(item)
                      }}
                      arrow={false}
                    >
                      {/* <div className='font-bold'>{item.structured_formatting.main_text}</div> */}
                      <Ellipsis className='py-2' direction='end' content={item.formatted_address} />
                      {/* <div className=''>{item.description}</div> */}
                    </List.Item>
                  )
                })}
            </List>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchInput2
