import { FloatingBubble, List, Popup } from 'antd-mobile'
import { AppstoreOutline } from 'antd-mobile-icons'
import React, { useState, PropsWithChildren } from 'react'

import './index.css'
import SideBar from './SideBar'
import { useDriverStore } from '~/stores/driver.store'

export default function DriverLayout({ children }: PropsWithChildren) {
  const { sibarShow, setSibarShow } = useDriverStore((state) => state)

  return (
    <div className='h-screen w-full'>
      <FloatingBubble
        axis='xy'
        magnetic='x'
        style={{
          '--initial-position-left': '20px',
          '--initial-position-top': '40px',
          '--edge-distance': '20px'
        }}
        onClick={() => setSibarShow(true)}
      >
        <AppstoreOutline fontSize={24} />
      </FloatingBubble>

      <SideBar visible={sibarShow} onMaskClick={() => setSibarShow(false)} />

      {children}
    </div>
  )
}
