import { HTMLOverlay } from '@goongmaps/goong-map-react'
import { Button } from 'antd-mobile'
import { FC, useState } from 'react'
import GoongMap from '~/components/GoongMap/GoongMap'
import classnames from 'classnames'

export default function HomePage() {
  const [show, setShow] = useState(false)

  return (
    <GoongMap>
      <Inner show={show}></Inner>
      <div className='absolute bottom-40'>
        <Button color='primary' onClick={() => setShow(!show)}>
          Add
        </Button>
      </div>
    </GoongMap>
  )
}

const Inner: FC<{ show: boolean }> = ({ show }) => {
  const redraw = () => {
    return (
      <div className={classnames('bg-red-100 cursor-default', { 'h-0 w-0': !show })}>
        {/* <div className=''>
          <input className='' />
        </div> */}
        <ul>
          <li>lakjsdf</li>
          <li>lakjsdf</li>
          <li>lakjsdf</li>
          <li>lakjsdf</li>
          <li>lakjsdf</li>
        </ul>
      </div>
    )
  }

  return (
    <HTMLOverlay
      captureClick={true}
      captureDoubleClick={true}
      captureDrag={true}
      capturePointerMove={true}
      redraw={redraw}
      style={{
        width: 'auto',
        height: 'auto'
      }}
    >
      <div className=''>aaaaaaaaa</div>
    </HTMLOverlay>
  )
}
