import { useQuery } from '@tanstack/react-query'
import { Card, Ellipsis, Empty, Skeleton } from 'antd-mobile'
import { LocationFill, StarOutline } from 'antd-mobile-icons'
import classNames from 'classnames'
import { useState, useEffect } from 'react'
import { getTrips } from '~/api/trip'
import { ITrip } from '~/types/dto/trip.dto'
import { formatMoney } from '~/utils/util'
import dayjs from 'dayjs'

export default function DriverHomePage() {
  const [activeTab, setActiveTab] = useState(1)
  const [trips, setTrips] = useState<ITrip[]>()

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

  const { data, isLoading } = useQuery({
    queryKey: ['trips', activeTab],
    queryFn: getTrips
  })

  useEffect(() => {
    if (data) {
      const t = data
        .filter((item) => {
          switch (activeTab) {
            case 1:
              return dayjs().isSame(item.createdAt, 'date')
            case 2:
              return dayjs().isSame(item.createdAt, 'week')
            case 3:
              return dayjs().isSame(item.createdAt, 'month')
            default:
              return true
          }
        })
        .sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime()
        })

      setTrips(t)
    }
  }, [data, activeTab])

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
          {isLoading && (
            <>
              <Card className='border border-solid border-slate-200 shadow-md'>
                <Skeleton.Paragraph animated lineCount={3} />
              </Card>
              <Card className='border border-solid border-slate-200 shadow-md'>
                <Skeleton.Paragraph animated lineCount={3} />
              </Card>
            </>
          )}

          {!isLoading && trips && trips.length === 0 && (
            <Card className='border border-solid border-slate-200 shadow-md'>
              <Empty description={'Không có chuyến đi nào'} />
            </Card>
          )}

          {!isLoading &&
            trips &&
            trips.length > 0 &&
            trips.map((trip) => (
              <Card className='border border-solid border-slate-200 shadow-md'>
                <div className='font-semibold flex justify-between'>
                  <div className=''>
                    <span className=''>
                      {trip.createdAt.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <span className='mx-1'>|</span>
                    <span className=''>
                      {trip.createdAt.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className=''>{formatMoney(trip.cost)}</div>
                </div>
                <div className='flex items-center py-2'>
                  <StarOutline color='blue' />
                  <div className='ml-1'>
                    <Ellipsis direction='end' content={trip.originText} />
                  </div>
                </div>
                <div className='flex items-center'>
                  <LocationFill color='red' />
                  <div className='ml-1'>
                    <Ellipsis direction='end' content={trip.destinationText} />
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
