import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button } from 'antd-mobile'
import { useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '~/api/auth'
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
        Already have an account?
        <Link to='/login' className='ml-1'>
          Login
        </Link>
      </div>
      <Button className='h-10' type='submit' color='primary' fill='solid' block>
        Register
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
      navigate('/')
    }
  })

  const handleSubmit = useCallback(
    (values: any) => {
      console.log(values)
      registerMutate(values)
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
      <h1 className='text-center'>Get's started</h1>
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
        <Form.Item name='name' label='Name' rules={[{ required: true, min: 3 }]}>
          <Input placeholder='John Smitch' clearable />
        </Form.Item>
        <Form.Header />
        <Form.Item name='email' label='Email' rules={[{ required: true, type: 'email' }]}>
          <Input placeholder='example@gmail.com' clearable />
        </Form.Item>
        <Form.Header />
        <Form.Item name='password' label='Password' rules={[{ required: true, min: 6 }]}>
          <Input placeholder='password' clearable type='password' />
        </Form.Item>
        <Form.Header />
        <Form.Item
          name='confirmPassword'
          label='Confirm password'
          rules={[
            {
              required: true
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('Passwords do not match')
              }
            })
          ]}
        >
          <Input placeholder='password' type='password' clearable />
        </Form.Item>
        <Form.Header />
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
        >
          <Input placeholder='0389722111' clearable type='text' />
        </Form.Item>
      </Form>
    </>
  )
}
