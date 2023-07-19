import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button, Toast } from 'antd-mobile'
import { useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '~/api/auth'
import { isAxiosError } from '~/utils/util'

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a email!'
  },
  string: {
    min: '${label} is at least ${min} characters!'
  }
}

const FormFooter = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <div className=''>
      <div className='text-center py-2'>
        Don't have an account?
        <Link to='/register' className='ml-1'>
          Sign up
        </Link>
      </div>
      <Button loading={isLoading} className='h-10' type='submit' color='primary' fill='solid' block>
        Login
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
      <h1 className='text-center'>Welcome back</h1>
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
        <Form.Item name='password' label='Password' rules={[{ required: true, min: 6 }]}>
          <Input placeholder='password' clearable type='password' />
        </Form.Item>
      </Form>
    </>
  )
}
