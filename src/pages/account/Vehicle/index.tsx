import { useQuery } from '@tanstack/react-query'
import { List, Tag, Toast } from 'antd-mobile'
import { AddCircleOutline, TruckOutline } from 'antd-mobile-icons'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVehicles } from '~/api/vehicle'

export default function VehiclePage() {
  const navigate = useNavigate()

  const { data: items, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles
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
          items?.map((item) => {
            return (
              <List.Item
                key={item._id}
                prefix={<TruckOutline fontSize={24} />}
                arrow={false}
                onClick={() => {
                  navigate(`${item._id}`)
                }}
              >
                <div className='font-semibold text-base'>{item.model}</div>
                <div className='text-sm flex'>
                  <span>{item.plate}</span>
                  <div className='ml-3 flex items-center'>
                    <div
                      className='h-2 w-2 border border-black border-solid '
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className='ml-1'>{item.color.toLocaleUpperCase()}</span>
                  </div>
                </div>

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
          Add new car
        </List.Item>
      </List>
    </>
  )
}
