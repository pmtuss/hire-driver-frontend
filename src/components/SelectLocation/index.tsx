import { useMutation, useQuery } from '@tanstack/react-query'
import { Input, List, Loading, Popup, PopupProps } from 'antd-mobile'
import { SearchOutline } from 'antd-mobile-icons'
import { debounce } from 'lodash'
import { useMemo, useState } from 'react'
import { getAddresses } from '~/api/address'
import { getAutoComplete } from '~/api/goong-map'

interface IProps extends PopupProps {
  defaultValue?: string
}

export default function SelectLocation(props: IProps) {
  const { showCloseButton = true, onClose, ...rest } = props

  const [input, setInput] = useState<string>('')

  const { data: myAdds } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses
  })

  const {
    mutate: mutatePredictAddresses,
    data: searchAdds,
    isLoading: isSearching,
    reset
  } = useMutation({
    mutationFn: getAutoComplete,
    onSuccess: () => {
      // console.log(data)
    }
  })

  const predictAddresses = useMemo(() => {
    return debounce((input: string) => {
      mutatePredictAddresses({ input: input })
    }, 400)
  }, [mutatePredictAddresses])

  const handleInputChange = (value: string) => {
    setInput(value)

    if (searchAdds) {
      reset()
    }
    if (value && value.length > 3) {
      predictAddresses(value)
    }
  }

  const handleClose = () => {
    setInput('')
    reset()
    onClose?.()
  }

  // const handleSelect = (item: any) => {}

  return (
    <div className=''>
      <Popup showCloseButton={showCloseButton} onClose={handleClose} {...rest}>
        <div className='w-screen'>
          <div className='px-3 py-10'>
            <div className='border border-solid border-blue-400 px-2 py-1.5 rounded-md flex items-center'>
              <SearchOutline className='mr-2' fontSize={16} />
              <Input style={{ '--font-size': '15px' }} clearable value={input} onChange={handleInputChange} />
            </div>
            <List className=''>
              {isSearching && (
                <List.Item>
                  <div className='text-xl py-2 text-center'>
                    <Loading />
                  </div>
                </List.Item>
              )}

              {searchAdds &&
                searchAdds.map((item, index) => {
                  return (
                    <List.Item key={index}>
                      <div className='text-sm py-2'>
                        <div className=''>{item.formatted_address}</div>
                      </div>
                    </List.Item>
                  )
                })}
              {!isSearching && !searchAdds && (
                <>
                  <List.Item>
                    <div className='text-sm py-2'>Choose your location</div>
                  </List.Item>
                  <List.Item>
                    <div className='text-sm py-2'>Choose on map</div>
                  </List.Item>
                </>
              )}

              {!isSearching &&
                !searchAdds &&
                myAdds &&
                myAdds.map((item) => {
                  return (
                    <List.Item key={item._id}>
                      <div className='text-sm py-2'>
                        <div className=''>{item.name}</div>
                      </div>
                    </List.Item>
                  )
                })}
            </List>
          </div>
        </div>
      </Popup>
    </div>
  )
}
