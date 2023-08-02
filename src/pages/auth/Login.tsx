import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '~/api/auth'

const validateMessages = {
  required: '${label} chưa được điền!',
  types: {
    email: 'Không đúng định dạng email!'
  },
  string: {
    min: '${label} phải tối thiểu ${min} kí tự!'
  }
}

const FormFooter = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <div className=''>
      <div className='text-center py-2'>
        Bạn chưa có tài khoản?
        <Link to='/register' className='ml-1'>
          Đăng ký
        </Link>
      </div>
      <Button loading={isLoading} className='h-10' type='submit' color='primary' fill='solid' block>
        Đăng nhập
      </Button>
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const {
    mutate: loginMutate,
    error,
    isLoading,
    reset
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      Toast.clear()
      setTimeout(() => {
        navigate('/')
      }, 100)
    },
    onError: (error: any) => {
      console.log(error)
      Toast.clear()
    }
  })

  const handleSubmit = useCallback(
    (values: any) => {
      loginMutate(values)
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
      <h1 className='text-center'>Đăng nhập</h1>
      {errorForm && <div className='text-center text-red-500'>{errorForm}</div>}

      <Form
        requiredMarkStyle='none'
        validateMessages={validateMessages}
        layout='vertical'
        mode='card'
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        footer={<FormFooter isLoading={isLoading} />}
      >
        <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
          <Input placeholder='example@gmail.com' clearable />
        </Form.Item>
        <Form.Header />
        <Form.Item name='password' label='Mật khẩu' rules={[{ required: true, min: 6 }]}>
          <Input placeholder='password' clearable type='password' />
        </Form.Item>
      </Form>
    </>
  )
}
