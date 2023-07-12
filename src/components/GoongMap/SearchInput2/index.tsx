import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { DotLoading, Ellipsis, Input, List } from 'antd-mobile'
import classnames from 'classnames'

import './index.css'
import { debounce } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { getAutoComplete, getPlaceDetail } from '~/api/goong-map'
import { AddressPrediction } from '~/types/dto/goong-map.dto'

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

  const { mutate, data, isLoading } = useMutation({
    mutationFn: getAutoComplete,
    onSuccess: (data) => {
      console.log({ data })
    }
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
      if (value && value.length >= 3) searchAddress(value)
    },
    [onChange]
  )

  const handleSelect = useCallback(
    (value: AddressPrediction) => {
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
                      <div className='font-bold'>{item.structured_formatting.main_text}</div>
                      <Ellipsis direction='end' content={item.description} />
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
