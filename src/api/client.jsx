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
  const status = error.response?.status
  if (status === 401) return 'Invalid email or password.'
  if (status === 403) return "You don't have permission to access this area."
  if (status === 409) return 'An account with these details already exists.'
  if (status === 422) return 'Please check the information you entered and try again.'
  if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.'
  if (!error.response) return 'Unable to connect to Campus-GPT. Please try again.'
  if (error.response?.data?.detail && typeof error.response.data.detail === 'string') {
    return error.response.data.detail
  }
  return 'The backend could not process that request. Please try again.'
}

export function getTokenRole() {
  const token = localStorage.getItem('campusgpt_token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

export function getStoredUserName() {
  return localStorage.getItem('campusgpt_user_name') || 'User'
}

export function saveAuthSession(accessToken, userName, role) {
  localStorage.setItem('campusgpt_token', accessToken)
  if (userName) localStorage.setItem('campusgpt_user_name', userName)
  if (role) localStorage.setItem('campusgpt_user_role', role)
  window.dispatchEvent(new Event('campusgpt-auth-change'))
}

export function logoutUser() {
  localStorage.removeItem('campusgpt_token')
  localStorage.removeItem('campusgpt_user_name')
  localStorage.removeItem('campusgpt_user_role')
  window.dispatchEvent(new Event('campusgpt-auth-change'))
}

export async function askQuestion(question) {
  const response = await client.post('/query', { question })
  return response.data
}

export async function getStudentChatHistory(limit = 50) {
  const response = await client.get('/chat/history', { params: { limit } })
  return response.data.items
}

export async function deleteStudentChatHistoryItem(chatId) {
  const response = await client.delete(`/chat/history/${encodeURIComponent(chatId)}`)
  return response.data
}

export async function loginStudent(email, password) {
  const response = await client.post('/auth/loginStudent', { email, password })
  return response.data
}

export async function signupStudent({ regNo, email, password, name }) {
  const response = await client.post('/auth/signupStudent', {
    regNo: Number(regNo),
    email,
    password,
    name,
  })
  return response.data
}

export async function loginAdmin(username, password) {
  const response = await client.post('/auth/loginAdmin', { username, password })
  return response.data
}

export async function signupAdmin({ name, email, password }) {
  const response = await client.post('/auth/signupAdmin', { name, email, password })
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

export async function getAdminDocuments() {
  const response = await client.get('/admin/documents')
  return response.data
}

export async function getAdminDocumentStats() {
  const response = await client.get('/admin/documents/stats')
  return response.data
}

export async function deleteAdminDocument(documentId) {
  const response = await client.delete('/admin/documents', {
    params: { document_id: documentId },
  })
  return response.data
}

export default client
