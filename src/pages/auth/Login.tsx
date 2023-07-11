import { Form, Input, Button } from 'antd-mobile'
import { Link } from 'react-router-dom'

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
      <Button className='h-10' color='primary' fill='solid' block>
        Login
      </Button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <h1 className='text-center'>Welcome back</h1>
      <Form
        requiredMarkStyle='none'
        validateMessages={validateMessages}
        layout='vertical'
        mode='card'
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
