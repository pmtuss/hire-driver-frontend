import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import config from '~/configs/config'

// Base config

const baseConfig: AxiosRequestConfig = {
  baseURL: config.serverUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
}

const http: AxiosInstance = axios.create(baseConfig)

http.interceptors.request.use(
  (configs) => {
    const token = localStorage.getItem('token')
    if (token) {
      configs.headers.Authorization = `Bearer ${token}`
    }
    return configs
  },
  (err) => {
    return Promise.reject(err)
  }
)

const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.clear()
  window.location.href = '/login'
}

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response.status === 401) {
      logout()
    }
    return Promise.reject(error)
  }
)

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return http.get(url, config).then((response) => response.data)
}

export const post = <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.post(url, data, config).then((response) => response.data)
}

export const put = <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.put(url, data, config).then((response) => response.data)
}

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return http.delete(url, config).then((response) => response.data)
}
