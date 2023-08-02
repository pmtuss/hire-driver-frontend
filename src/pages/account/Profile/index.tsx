import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, DatePicker, DatePickerRef, Form, Input, Toast } from 'antd-mobile'
import { RefObject, useEffect } from 'react'
import { getProfile, updateProfile } from '~/api/user'
import DefaultPicture from '~/assets/default.png'
import MAvatar from '~/components/Avatar'

const validateMessages = {
  required: '${label} chưa được điền!',
  types: {
    email: 'Không đúng định dạng email!'
  },
  string: {
    min: '${label} phải tối thiểu ${min} kí tự!'
  }
}

export default function ProfilePage() {
  // const navigate = useNavigate()

  const [form] = Form.useForm()

  const getProfileQuery = useQuery({
    queryKey: ['users', 'profile'],
    queryFn: getProfile
  })

  const { mutate: updateProfileMutate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data: any) => {
      console.log({ data })
      Toast.show({
        icon: 'success',
        content: 'Cập nhật thành công',
        duration: 1000
      })
    }
  })

  const handleSubmit = (values: any) => {
    console.log(values)
    Toast.show({
      icon: 'loading'
    })
    updateProfileMutate({
      name: values.name,
      dob: values.dob
    })
  }

  useEffect(() => {
    if (getProfileQuery.isLoading) {
      Toast.show({
        icon: 'loading'
      })
    }
    if (!getProfileQuery.isLoading && getProfileQuery.data) {
      Toast.clear()
      const data = getProfileQuery.data
      const fields = {
        name: data.name,
        phone: data.phone,
        email: data.email
      }
      form.setFieldsValue(fields)
      if (data.dob) {
        form.setFieldsValue({
          dob: new Date(data.dob)
        })
      }
    }
  }, [getProfileQuery.isLoading, getProfileQuery.data])

  return (
    <>
      <div className='flex justify-center py-8'>
        {/* <img src={DefaultPicture} alt='' className='h-14 w-14 rounded-full object-cover' /> */}
        <MAvatar src={getProfileQuery.data?.avatar || DefaultPicture} />
      </div>

      <Form
        form={form}
        validateMessages={validateMessages}
        className='w-full'
        name='form'
        onFinish={handleSubmit}
        requiredMarkStyle={'none'}
        footer={
          <Button className='mt-2' block type='submit' color='primary'>
            Cập nhật
          </Button>
        }
      >
        <Form.Item name='name' label='Tên' rules={[{ required: true }]}>
          <Input placeholder='Name' />
        </Form.Item>
        <Form.Item name='email' label='Email' disabled>
          <Input placeholder='example@gmail.com' />
        </Form.Item>
        <Form.Item
          name='dob'
          label='Ngày sinh'
          trigger='onConfirm'
          onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
            datePickerRef.current?.open()
          }}
        >
          <DatePicker confirmText='OK' cancelText='Đóng' max={new Date()} min={new Date('1930/01/01')}>
            {(value) =>
              value
                ? value.toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })
                : 'dd/mm/yyyy'
            }
          </DatePicker>
        </Form.Item>

        <Form.Item
          name='phone'
          label='Số điện thoại'
          rules={[
            { required: true },
            {
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
              message: 'Số điện thoại không hợp lệ'
            }
          ]}
          disabled
        >
          <Input placeholder='0389 xxx xxx' clearable type='text' />
        </Form.Item>
      </Form>
    </>
  )
}
