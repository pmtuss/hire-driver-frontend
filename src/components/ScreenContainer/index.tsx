import { PropsWithChildren } from 'react'

export default function ScreenContainer({ children }: PropsWithChildren) {
  return <div className='w-full bg-gray-light h-screen flex flex-col'>{children}</div>
}
