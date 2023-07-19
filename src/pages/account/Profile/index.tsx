import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, DatePicker, DatePickerRef, Form, Input, Selector, Slider, Stepper, Toast } from 'antd-mobile'
import { RefObject, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile } from '~/api/user'
import DefaultPicture from '~/assets/default.png'

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a email!'
  },
  string: {
    min: '${label} is at least ${min} characters!'
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()

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
        content: data.message,
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
        email: data.email,
        dob: data.dob ? new Date(data.dob) : new Date()
      }
      form.setFieldsValue(fields)
    }
  }, [getProfileQuery.isLoading, getProfileQuery.data])

  return (
    <>
      <div className='flex justify-center py-8'>
        <img src={DefaultPicture} alt='' className='h-14 w-14 rounded-full object-cover' />
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
            Update
          </Button>
        }
      >
        <Form.Item name='name' label='Name' rules={[{ required: true }]}>
          <Input placeholder='Name' />
        </Form.Item>
        <Form.Item name='email' label='Email' disabled>
          <Input placeholder='example@gmail.com' />
        </Form.Item>
        <Form.Item
          name='dob'
          label='Date of birth'
          trigger='onConfirm'
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            datePickerRef.current?.open()
          }}
        >
          <DatePicker confirmText='OK' cancelText='Cancel' max={new Date()} min={new Date('1930/01/01')}>
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
          label='Phone number'
          rules={[
            { required: true },
            {
              pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
              message: 'Invalid phone number'
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
