import { useMutation } from '@tanstack/react-query'
import { Toast } from 'antd-mobile'
import { useState } from 'react'
import { updateAvatar } from '~/api/user'
import { convertImageToBase64 } from '~/utils/util'

interface IProps {
  src: string
}

export default function MAvatar(props: IProps) {
  const { src } = props

  const [imgSrc, setImgSrc] = useState(src)

  const { mutate: updateAvatarMutate } = useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      Toast.show({ icon: 'success', content: <div className='text-center'>Cập nhật ảnh đại diện thành công</div> })
    }
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const base64 = await convertImageToBase64(file!)
    console.log(base64)
    setImgSrc(base64)
    updateAvatarMutate({ avatar: base64 })
  }

  return (
    <label className='h-16 w-16 rounded-full p-1 bg-white relative'>
      <img src={imgSrc} alt='' className='h-full w-full rounded-full object-cover' />
      <input type='file' accept='.jpeg, .png, .jpg' onChange={handleFileUpload} className='hidden' />
    </label>
  )
}
