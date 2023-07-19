import { List, Space } from 'antd-mobile'
import { ContentOutline, StarFill, TruckOutline, EnvironmentOutline, CloseCircleOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import DefaultPicture from '~/assets/default.png'

import './index.css'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '~/api/user'

const items = [
  {
    path: '/profile',
    name: 'Profile',
    prefix: <ContentOutline fontSize={24} />
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    prefix: <TruckOutline fontSize={24} />
  },
  {
    path: '/addresses',
    name: 'Your Addresses',
    prefix: <EnvironmentOutline fontSize={24} />
  },
  {
    path: '/logout',
    name: 'Logout',
    prefix: <CloseCircleOutline fontSize={24} />
  }
]

export default function AccountPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['users', 'profile'],
    queryFn: getProfile
  })

  return (
    <Space direction='vertical' block>
      <Space direction='vertical' align='center' block className='bg-primary text-white py-4'>
        <div className='h-14 w-14  rounded-full '>
          <img src={DefaultPicture} alt='' className='h-full w-full object-cover rounded-full' />
        </div>
        <div className='flex flex-col gap-1 items-center'>
          <div className='text-base font-semibold'>{data?.name}</div>
          <div className=''>{data?.phone}</div>
          <div className='flex justify-center gap-0.5 text-yellow-300'>
            4.5
            <StarFill />
          </div>
        </div>
      </Space>

      <Space direction='vertical' block>
        <List>
          {items.map((item, index) => (
            <List.Item
              key={index}
              prefix={item.prefix}
              onClick={() => navigate(item.path)}
              // onClick={() => {}}
              className='last:text-red-400 account-item'
              arrow={index != items.length - 1}
            >
              <div className='text-base'>{item.name}</div>
            </List.Item>
          ))}
        </List>
      </Space>
    </Space>
  )
}
