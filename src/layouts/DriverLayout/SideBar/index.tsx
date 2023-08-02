import { Popup, PopupProps } from 'antd-mobile'
import DefaultPicture from '~/assets/default.png'

import SideLink from '../SideLink'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '~/api/user'

interface IProps extends PopupProps {}
export default function SideBar(props: IProps) {
  const { position = 'left', ...rest } = props

  const { data: profile, isLoading } = useQuery({
    queryKey: ['users', 'profile'],
    queryFn: getProfile
  })

  return (
    <Popup position='left' {...rest}>
      <div className='w-[80vw] h-full'>
        <div className='w-full flex flex-col items-center text-white bg-primary pt-10 pb-5'>
          <div className='h-16 w-16 p-1 bg-white rounded-full'>
            <img src={profile?.avatar || DefaultPicture} alt='' className='w-full h-full object-cover rounded-full' />
          </div>
          <div className='text-base font-semibold py-1'>{profile?.name}</div>
          <div className=''>{profile?.phone}</div>
        </div>
        <SideLink />
      </div>
    </Popup>
  )
}
