import { AppOutline, CloseCircleOutline, TruckOutline, UserOutline } from 'antd-mobile-icons'
import classNames from 'classnames'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDriverStore } from '~/stores/driver.store'

export default function SideLink() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { setSibarShow } = useDriverStore((state) => state)

  const tabs = [
    {
      path: '/',
      icon: <AppOutline fontSize={25} />,
      title: 'Home'
    },
    {
      path: '/rides',
      icon: <TruckOutline fontSize={25} />,
      title: 'Rides'
    },

    {
      path: '/profile',
      icon: <UserOutline fontSize={25} />,
      title: 'Profile'
    },

    {
      path: '/logout',
      icon: <CloseCircleOutline fontSize={25} />,
      title: 'Logout'
    }
  ]

  return (
    <div className=' w-full h-full '>
      <div className='px-3 py-5 flex flex-col gap-2'>
        {tabs.map((item) => {
          return (
            <div
              key={item.title}
              className={classNames(
                'flex items-center text-base px-5 py-2 bg-white rounded-lg last:text-danger active:bg-slate-200',
                {
                  'border border-solid border-blue-400 bg-blue-100': pathname == item.path
                }
              )}
              onClick={() => {
                navigate(item.path)
                setSibarShow(false)
              }}
            >
              {item.icon}
              <div className='ml-5'>{item.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
