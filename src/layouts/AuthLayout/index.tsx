import { PropsWithChildren } from 'react'
import ScreenContainer from '~/components/ScreenContainer'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <ScreenContainer>
      <div className='flex flex-col overflow-y-auto'>{children}</div>
    </ScreenContainer>
  )
}
