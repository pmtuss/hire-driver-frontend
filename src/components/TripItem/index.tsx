import { Card, Ellipsis } from 'antd-mobile'
import { LocationFill, StarOutline } from 'antd-mobile-icons'
import { ITrip } from '~/types/dto/trip.dto'

interface IProps {
  item: ITrip
}
export default function TripItem(props: IProps) {
  const { item } = props

  return (
    <Card className='border border-solid border-slate-200'>
      <div className='font-semibold'>
        <span className=''>
          {item.createdAt.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
        <span className='mx-1'>|</span>
        <span className=''>
          {item.createdAt.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      <div className='flex items-center py-2'>
        <StarOutline color='blue' />
        <div className='ml-1'>
          <Ellipsis direction='end' content={item.originText} />
        </div>
      </div>
      <div className='flex items-center'>
        <LocationFill color='red' />
        <div className='ml-1'>
          <Ellipsis direction='end' content={item.destinationText} />
        </div>
      </div>
    </Card>
  )
}
