import { PropsWithChildren } from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import MTabBar from '~/components/TabBar'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <ScreenContainer>
      <div className='flex-1 overflow-x-auto'>{children}</div>
      <MTabBar className='bg-white' />
    </ScreenContainer>
  )
}
