import ScreenContainer from '~/components/ScreenContainer'
import Header from './Header'
import { PropsWithChildren } from 'react'

export default function BackLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-col h-screen'>
      <Header />

      <div className='flex-1 w-full relative bg-gray-light'>{children}</div>
    </div>
  )
}
