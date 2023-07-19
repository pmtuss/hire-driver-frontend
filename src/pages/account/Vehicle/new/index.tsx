import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Dialog, Form, Input, Picker, PickerRef, SwipeAction, Switch, Toast } from 'antd-mobile'
import { FieldData } from 'antd-mobile/es/components/form'
import { PickerColumn, PickerColumnItem, PickerValue } from 'antd-mobile/es/components/picker'
import React, { RefObject, useEffect, useState } from 'react'
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
  required: '${label} is required!'
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
        content: 'Updated successfully',
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
        content: 'Delete successfully',
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
      content: 'Delete this car?',
      confirmText: <span className='text-danger'>Delete</span>,
      cancelText: 'Cancel',
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
            {isEditMode ? 'Update' : 'Add'}
          </Button>

          {isEditMode && (
            <Button block color='danger' fill='outline' className='mt-2 bg-white' onClick={handleDelete}>
              Delete
            </Button>
          )}
        </>
      }
      requiredMarkStyle='none'
      onFinish={handleSubmit}
    >
      <Form.Header>Car infomation</Form.Header>

      <Form.Item name='model' label='Model' rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name='plate'
        label='Plate'
        rules={[
          { required: true },
          {
            // pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
            pattern: /[1-9][0-9][a-zA-Z]\s*[0-9]{4,5}\b/,
            message: 'Invalid plate'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='color'
        label='Color'
        rules={[{ required: true }]}
        onClick={(e, pickerRef: RefObject<PickerRef>) => {
          pickerRef.current?.open()
        }}
      >
        <Picker columns={columns} cancelText='Cancel' confirmText='OK' onConfirm={handleColorSelect}>
          {(value) => {
            return value.length !== 0 && value[0] ? (
              <div className='text-base'>{value[0].label}</div>
            ) : (
              <div className='text-base text-gray-400'>Choose car's color</div>
            )
          }}
        </Picker>
      </Form.Item>

      <Form.Header>Set car is default</Form.Header>

      <Form.Item name='isDefault'>
        <div className='flex justify-between items-center py-2'>
          <div className='text-base text-secondary'>Default car</div>
          <Switch checked={isDefault} onChange={(checked) => setIsDefault(checked)} />
        </div>
      </Form.Item>
    </Form>
  )
}
