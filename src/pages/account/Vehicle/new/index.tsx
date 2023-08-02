import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Dialog, Form, Input, Picker, PickerRef, Switch, Toast } from 'antd-mobile'
import { PickerValue } from 'antd-mobile/es/components/picker'
import { RefObject, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createVehicles, deleteVehicle, getVehicle, updateVehicle } from '~/api/vehicle'

const colors = ['black', 'white', 'red', 'orange', 'yellow', 'blue', 'green', 'gray']

const columns = [
  colors.map((color, index) => {
    const label = (
      <div className={`flex items-center text-sm`}>
        <div className={`h-3 w-3 border border-solid border-black mr-2`} style={{ backgroundColor: color }}></div>
        {color.toUpperCase()}
      </div>
    )
    return {
      label,
      value: color,
      key: index
    }
  })
]

const validateMessages = {
  required: '${label} chưa được điền!'
}

export default function NewVehiclePage() {
  const navigate = useNavigate()
  const [isDefault, setIsDefault] = useState<boolean>(false)
  const [color, setColor] = useState<string[]>()

  const { id } = useParams()
  const isEditMode = !!id

  const [form] = Form.useForm()

  const queryGetVehicle = useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => getVehicle(id as string),
    enabled: !!id
  })

  const { mutate: createVehiclesMutate } = useMutation({
    mutationFn: createVehicles,
    onSuccess: () => {
      Toast.show({
        icon: 'success'
      })
      navigate(-1)
    }
  })

  const { mutate: mutateUpdateVehicle } = useMutation({
    mutationFn: (body) => updateVehicle(id as string, body as any),
    onSuccess: (data: any) => {
      Toast.show({
        icon: 'success',
        duration: 1000,
        content: 'Cập nhật thành công',
        afterClose() {
          navigate(-1)
        }
      })
    }
  })

  const handleSubmit = (values: any) => {
    const formData = { ...values, color: values.color[0] }
    if (!isEditMode) {
      createVehiclesMutate(formData)
    } else {
      mutateUpdateVehicle(formData)
    }
  }

  const handleColorSelect = (value: PickerValue[]) => {
    setColor(value as string[])
  }

  useEffect(() => {
    form.setFieldsValue({
      color,
      isDefault
    })
  }, [color, isDefault])

  useEffect(() => {
    const data = queryGetVehicle.data
    if (data) {
      form.setFieldsValue({
        ...data,
        plate: data.plate.toUpperCase(),
        color: [data.color]
      })
      setIsDefault(data.isDefault)
      setColor([data.color])
    }
  }, [queryGetVehicle.data])

  const { mutate: mutateDelteVehicle } = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      Toast.show({
        icon: 'success',
        content: 'Xoá thành công',
        duration: 1000,
        afterClose: () => navigate(-1)
      })
    },
    onError: (error: any) => {
      console.log({ error })
      Toast.show({
        icon: 'fail',
        content: error.message || error.error
      })
    }
  })

  const handleDelete = () => {
    Dialog.confirm({
      content: 'Xoá phương tiện này?',
      confirmText: <span className='text-danger'>Xoá</span>,
      cancelText: 'Đóng',
      onConfirm: () => mutateDelteVehicle(id as string)
    })
  }

  return (
    <Form
      form={form}
      layout='vertical'
      className='w-full mt-2'
      validateMessages={validateMessages}
      footer={
        <>
          <Button type='submit' block color='primary' className='mt-2'>
            {isEditMode ? 'Cập nhật' : 'Thêm'}
          </Button>

          {isEditMode && (
            <Button block color='danger' className='!mt-2 bg-white' onClick={handleDelete}>
              Xoá
            </Button>
          )}
        </>
      }
      requiredMarkStyle='none'
      onFinish={handleSubmit}
    >
      <Form.Header>Thông tin xe</Form.Header>

      <Form.Item name='model' label='Mẫu xe' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name='plate'
        label='Biển số xe'
        rules={[
          { required: true },
          {
            pattern: /[1-9][0-9][a-zA-Z]\s*[0-9]{4,5}\b/,
            message: 'Biển số xe không hợp lệ'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='color'
        label='Màu sắc'
        rules={[{ required: true }]}
        onClick={(e, pickerRef: RefObject<PickerRef>) => {
          pickerRef.current?.open()
        }}
      >
        <Picker columns={columns} cancelText='Đóng' confirmText='OK' onConfirm={handleColorSelect}>
          {(value) => {
            return value.length !== 0 && value[0] ? (
              <div className='text-base'>{value[0].label}</div>
            ) : (
              <div className='text-base text-gray-400'>Hãy chọn màu xe của bạn</div>
            )
          }}
        </Picker>
      </Form.Item>

      <Form.Header>Đặt làm mặc định</Form.Header>

      <Form.Item name='isDefault'>
        <div className='flex justify-between items-center py-2'>
          <div className='text-base text-secondary'>Mặc định</div>
          <Switch
            checked={isDefault}
            onChange={(checked) => setIsDefault(checked)}
            disabled={queryGetVehicle.data?.isDefault}
          />
        </div>
      </Form.Item>
    </Form>
  )
}
