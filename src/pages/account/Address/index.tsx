import { useQuery } from '@tanstack/react-query'
import { Button, List, Tag, Toast } from 'antd-mobile'
import { AddCircleOutline, EnvironmentOutline } from 'antd-mobile-icons'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAddresses } from '~/api/address'

export default function AddressPage() {
  const navigate = useNavigate()

  const { data: items, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses
  })

  useEffect(() => {
    if (isLoading) {
      Toast.show({
        icon: 'loading'
      })
    }
    if (!isLoading && items) {
      Toast.clear()
    }
  }, [isLoading, items])

  return (
    <>
      <List className='w-full mt-2'>
        {!isLoading &&
          items?.map((item, index) => {
            return (
              <List.Item
                key={item._id}
                prefix={<EnvironmentOutline fontSize={24} />}
                arrow={false}
                onClick={() => {
                  navigate(`${item._id}`)
                }}
              >
                <div className='font-semibold text-base'>{item.name}</div>
                <div className='text-sm flex'>{item.formatted_address}</div>

                {item.isDefault && (
                  <Tag color='danger' fill='outline'>
                    Mặc định
                  </Tag>
                )}
              </List.Item>
            )
          })}

        <List.Item
          arrow={false}
          prefix={<AddCircleOutline fontSize={24} />}
          className='text-base add-item'
          onClick={() => navigate('new')}
        >
          Add new address
        </List.Item>
      </List>
    </>
  )
}
