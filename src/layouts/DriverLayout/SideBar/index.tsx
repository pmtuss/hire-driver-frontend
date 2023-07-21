import { Popup, PopupProps } from 'antd-mobile'
import DefaultPicture from '~/assets/default.png'

import SideLink from '../SideLink'

interface IProps extends PopupProps {}
export default function SideBar(props: IProps) {
  const { position = 'left', ...rest } = props

  return (
    <Popup position='left' {...rest}>
      <div className='w-[80vw] h-full'>
        <div className='w-full flex flex-col items-center text-white bg-primary pt-10 pb-5'>
          <div className='h-16 w-16 p-1 bg-white rounded-full'>
            <img src={DefaultPicture} alt='' className='w-full h-full object-cover rounded-full' />
          </div>
          <div className='text-base font-semibold py-1'>John</div>
          <div className=''>0389777888</div>
        </div>

        <SideLink />
      </div>
    </Popup>
  )
}
