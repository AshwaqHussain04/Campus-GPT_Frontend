import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusgpt_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(error) {
  if (error.response?.data?.detail) return error.response.data.detail
  if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.'
  if (!error.response) return 'Cannot connect to the Campus-GPT backend. Make sure it is running.'
  return 'The backend could not process that request. Please try again.'
}

export async function askQuestion(question) {
  const response = await client.post('/query', { question })
  return response.data
}

export async function login(username, password) {
  const response = await client.post('/auth/login', { username, password })
  return response.data
}

export async function uploadDocument(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await client.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export default client
