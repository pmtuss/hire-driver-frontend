import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button } from 'antd-mobile'
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

const FormFooter = () => {
  return (
    <div className=''>
      <div className='text-center py-2'>
        Don't have an account?
        <Link to='/register' className='ml-1'>
          Sign up
        </Link>
      </div>
      <Button className='h-10' type='submit' color='primary' fill='solid' block>
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
    reset
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleSubmit = useCallback(
    (values: any) => {
      console.log(values)
      loginMutate(values)
    },
    [form]
  )

  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: string }>(error)) {
      return error.response?.data.error
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
        footer={<FormFooter />}
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
