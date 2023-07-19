import { useQuery } from '@tanstack/react-query'
import { Empty, List } from 'antd-mobile'
import { getTrips } from '~/api/trip'

import TripItem from '~/components/TripItem'

export default function HistoryPage() {
  const { data: myTrips } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips
  })

  return (
    <>
      <div className='p-3 flex flex-col gap-2'>
        {myTrips &&
          myTrips.map((item, index) => {
            return <TripItem key={item._id} item={item} />
          })}

        {myTrips && myTrips.length === 0 && <Empty className='bg-white' description={'Have not a trip'} />}
      </div>
    </>
  )
}
