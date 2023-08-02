import { useQuery } from '@tanstack/react-query'
import { Card, Empty, Skeleton } from 'antd-mobile'
import { getTrips } from '~/api/trip'

import TripItem from '~/components/TripItem'

export default function HistoryPage() {
  const { data: myTrips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips
  })

  return (
    <>
      <div className='p-3 flex flex-col gap-2'>
        {myTrips &&
          myTrips
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((item) => {
              return <TripItem key={item._id} item={item} />
            })}

        {myTrips && myTrips.length === 0 && <Empty className='bg-white' description={'Have not a trip'} />}

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
      </div>
    </>
  )
}
