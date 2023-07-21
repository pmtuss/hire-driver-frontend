import { Card, Ellipsis } from 'antd-mobile'
import { LocationFill, StarOutline } from 'antd-mobile-icons'
import classNames from 'classnames'
import React, { useState } from 'react'

export default function DriverHomePage() {
  const [activeTab, setActiveTab] = useState(1)

  const tabs = [
    {
      key: 1,
      title: 'Today'
    },
    {
      key: 2,
      title: 'Week'
    },
    {
      key: 3,
      title: 'Month'
    },
    {
      key: 4,
      title: 'All time'
    }
  ]
  return (
    <div className='flex flex-col h-screen'>
      <div className=' px-5 pt-24 pb-5 shadow-md'>
        <div className='flex justify-between'>
          {tabs.map((tab) => {
            return (
              <div
                key={tab.key}
                className={classNames('border border-solid border-slate-400 text-sm rounded-md px-4 shadow-sm', {
                  'bg-primary border-primary text-white': tab.key === activeTab
                })}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.title}
              </div>
            )
          })}
        </div>
      </div>
      <div className='flex-1 overflow-auto pt-1 pb-5 border-t border-slate-200'>
        <div className='h-full overflow-auto px-5 flex flex-col gap-2'>
          <Card className='border border-solid border-slate-200 shadow-md'>
            <div className='font-semibold'>
              <span className=''>20/01/2021</span>
              <span className='mx-1'>|</span>
              <span className=''>07:40</span>
            </div>
            <div className='flex items-center py-2'>
              <StarOutline color='blue' />
              <div className='ml-1'>
                <Ellipsis direction='end' content={'1 Ngõ 88 Kim Hoa, Phương Liên, Đống Đa, Hà Nội'} />
              </div>
            </div>
            <div className='flex items-center'>
              <LocationFill color='red' />
              <div className='ml-1'>
                <Ellipsis
                  direction='end'
                  content={
                    'Nhà D9 - Đại học Bách khoa Hà Nội, Đại học Bách khoa Hà Nội, Bách Khoa, Hai Bà Trưng, Hà Nội'
                  }
                />
              </div>
            </div>
          </Card>

          <Card className='border border-solid border-slate-200 shadow-md'>
            <div className='font-semibold'>
              <span className=''>20/01/2021</span>
              <span className='mx-1'>|</span>
              <span className=''>07:40</span>
            </div>
            <div className='flex items-center py-2'>
              <StarOutline color='blue' />
              <div className='ml-1'>
                <Ellipsis direction='end' content={'1 Ngõ 88 Kim Hoa, Phương Liên, Đống Đa, Hà Nội'} />
              </div>
            </div>
            <div className='flex items-center'>
              <LocationFill color='red' />
              <div className='ml-1'>
                <Ellipsis
                  direction='end'
                  content={
                    'Nhà D9 - Đại học Bách khoa Hà Nội, Đại học Bách khoa Hà Nội, Bách Khoa, Hai Bà Trưng, Hà Nội'
                  }
                />
              </div>
            </div>
          </Card>

          <Card className='border border-solid border-slate-200 shadow-md'>
            <div className='font-semibold'>
              <span className=''>20/01/2021</span>
              <span className='mx-1'>|</span>
              <span className=''>07:40</span>
            </div>
            <div className='flex items-center py-2'>
              <StarOutline color='blue' />
              <div className='ml-1'>
                <Ellipsis direction='end' content={'1 Ngõ 88 Kim Hoa, Phương Liên, Đống Đa, Hà Nội'} />
              </div>
            </div>
            <div className='flex items-center'>
              <LocationFill color='red' />
              <div className='ml-1'>
                <Ellipsis
                  direction='end'
                  content={
                    'Nhà D9 - Đại học Bách khoa Hà Nội, Đại học Bách khoa Hà Nội, Bách Khoa, Hai Bà Trưng, Hà Nội'
                  }
                />
              </div>
            </div>
          </Card>
          <Card className='border border-solid border-slate-200 shadow-md'>
            <div className='font-semibold'>
              <span className=''>20/01/2021</span>
              <span className='mx-1'>|</span>
              <span className=''>07:40</span>
            </div>
            <div className='flex items-center py-2'>
              <StarOutline color='blue' />
              <div className='ml-1'>
                <Ellipsis direction='end' content={'1 Ngõ 88 Kim Hoa, Phương Liên, Đống Đa, Hà Nội'} />
              </div>
            </div>
            <div className='flex items-center'>
              <LocationFill color='red' />
              <div className='ml-1'>
                <Ellipsis
                  direction='end'
                  content={
                    'Nhà D9 - Đại học Bách khoa Hà Nội, Đại học Bách khoa Hà Nội, Bách Khoa, Hai Bà Trưng, Hà Nội'
                  }
                />
              </div>
            </div>
          </Card>
          <Card className='border border-solid border-slate-200 shadow-md'>
            <div className='font-semibold'>
              <span className=''>20/01/2021</span>
              <span className='mx-1'>|</span>
              <span className=''>07:40</span>
            </div>
            <div className='flex items-center py-2'>
              <StarOutline color='blue' />
              <div className='ml-1'>
                <Ellipsis direction='end' content={'1 Ngõ 88 Kim Hoa, Phương Liên, Đống Đa, Hà Nội'} />
              </div>
            </div>
            <div className='flex items-center'>
              <LocationFill color='red' />
              <div className='ml-1'>
                <Ellipsis
                  direction='end'
                  content={
                    'Nhà D9 - Đại học Bách khoa Hà Nội, Đại học Bách khoa Hà Nội, Bách Khoa, Hai Bà Trưng, Hà Nội'
                  }
                />
              </div>
            </div>
          </Card>
          <Card className='border border-solid border-slate-200 shadow-md'>
            <div className='font-semibold'>
              <span className=''>20/01/2021</span>
              <span className='mx-1'>|</span>
              <span className=''>07:40</span>
            </div>
            <div className='flex items-center py-2'>
              <StarOutline color='blue' />
              <div className='ml-1'>
                <Ellipsis direction='end' content={'1 Ngõ 88 Kim Hoa, Phương Liên, Đống Đa, Hà Nội'} />
              </div>
            </div>
            <div className='flex items-center'>
              <LocationFill color='red' />
              <div className='ml-1'>
                <Ellipsis
                  direction='end'
                  content={
                    'Nhà D9 - Đại học Bách khoa Hà Nội, Đại học Bách khoa Hà Nội, Bách Khoa, Hai Bà Trưng, Hà Nội'
                  }
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
