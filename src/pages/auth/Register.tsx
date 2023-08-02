import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button, Toast, Radio } from 'antd-mobile'
import { useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '~/api/auth'
import { UserRoles } from '~/constants/enum'

const validateMessages = {
  required: '${label} chưa được điền!',
  types: {
    email: 'Không đúng định dạng email!'
  },
  string: {
    min: '${label} phải tối thiểu ${min} kí tự!'
  }
}

const FormFooter = () => {
  return (
    <div className=''>
      <div className='text-center py-2'>
        Bạn đã có tài khoản?
        <Link to='/login' className='ml-1'>
          Đăng nhập
        </Link>
      </div>
      <Button className='h-10' type='submit' color='primary' fill='solid' block>
        Đăng ký
      </Button>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const {
    mutate: registerMutate,
    error,
    reset
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate('/login')
      Toast.show({
        icon: 'success',
        content: 'Đăng ký thành công',
        duration: 2000
      })
    },
    onError: (error: any) => {
      console.log(error)
    }
  })

  const handleSubmit = useCallback(
    (values: any) => {
      registerMutate(values)
    },
    [form]
  )

  const errorForm = useMemo(() => {
    if (error) {
      return error.error || error.message
    }
    return null
  }, [error])

  const handleValuesChange = (_: any, __: any) => {
    if (errorForm) reset()
  }

  return (
    <>
      <h1 className='text-center'>Đăng ký</h1>
      {errorForm && <div className='text-center text-red-500'>{errorForm}</div>}

      <Form
        requiredMarkStyle='none'
        validateMessages={validateMessages}
        layout='vertical'
        mode='card'
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        footer={<FormFooter />}
        initialValues={{ role: UserRoles.PASSENGER }}
      >
        <Form.Item name='name' label='Tên' rules={[{ required: true, min: 3 }]}>
          <Input placeholder='John Smitch' clearable />
        </Form.Item>
        <Form.Header />
        <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
          <Input placeholder='example@gmail.com' clearable />
        </Form.Item>
        <Form.Header />
        <Form.Item name='password' label='Mật khẩu' rules={[{ required: true, min: 6 }]}>
          <Input placeholder='password' clearable type='password' />
        </Form.Item>
        <Form.Header />
        <Form.Item
          name='confirmPassword'
          label='Nhập lại mật khẩu'
          rules={[
            {
              required: true
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('Mật khẩu không trùng khớp')
              }
            })
          ]}
        >
          <Input placeholder='password' type='password' clearable />
        </Form.Item>
        <Form.Header />
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
        >
          <Input placeholder='0389722111' clearable type='text' />
        </Form.Item>
        <Form.Header />

        <Form.Item name='role'>
          <Radio.Group>
            <div className='flex flex-col gap-2'>
              <Radio value={UserRoles.PASSENGER}>Hành khách</Radio>
              <Radio value={UserRoles.DRIVER}>Tài xế </Radio>
            </div>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  )
}
