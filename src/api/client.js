import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const client = axios.create({
  baseURL: API_BASE_URL,
})

// Attach the JWT automatically if one is stored
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusgpt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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