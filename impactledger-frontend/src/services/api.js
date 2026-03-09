import axios from 'axios'
import { API_BASE_URL } from '@/utils/constants'

// Create axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Before every request, attach the JWT token (skip for public auth endpoints)
const PUBLIC_AUTH_ROUTES = ['/auth/register', '/auth/login', '/auth/verify-otp']

api.interceptors.request.use((config) => {
  const isPublicRoute = PUBLIC_AUTH_ROUTES.some((route) => config.url?.includes(route))
  if (!isPublicRoute) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// After every response, handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === 'ERR_CANCELED' || error.name === 'AbortError') {
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const data = error.response?.data
    const message = typeof data?.message === 'string'
      ? data.message
      : (typeof data === 'string' ? data : error.message)
    return Promise.reject({ ...data, message: String(message || 'Request failed') })
  }
)

// ============ AUTH APIs ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
}

// ============ NGO APIs ============
export const ngoAPI = {
  getProfile: (ngoId) => api.get(`/ngo/profile/${ngoId}`),
  updateProfile: (ngoId, data) => api.put(`/ngo/profile/${ngoId}`, data),
  getProjects: (ngoId) => api.get(`/ngo/${ngoId}/projects`),
  createProject: (data) => api.post('/ngo/projects', data),
}

// ============ RECEIPT APIs ============
// NOTE: For multipart/form-data, do NOT set Content-Type manually — let the browser set it
export const receiptAPI = {
  upload: (formData) => api.post('/compliance/upload-receipt', formData, {
    headers: { 'Content-Type': undefined },
  }),
  getStatus: (receiptId) => api.get(`/compliance/receipt/${receiptId}/status`),
  getAll: (ngoId, config) => api.get(`/compliance/receipts?ngoId=${ngoId}`, config || {}),
}

// ============ COMPLIANCE APIs ============
export const complianceAPI = {
  generateForm10BD: (data) => api.post('/compliance/generate-form-10bd', data),
  getForms: (ngoId, config) => api.get(`/compliance/forms?ngoId=${ngoId}`, config || {}),
  getFormPreview: (formId) => api.get(`/compliance/form/${formId}/preview`),
}

// ============ SEARCH APIs ============
export const searchAPI = {
  semantic: (data) => api.post('/search/semantic', data),
}

// ============ INVESTOR APIs ============
export const investorAPI = {
  getDashboard: () => api.get('/investor/dashboard'),
  expressInterest: (data) => api.post('/investor/express-interest', data),
}

// ============ VOICE APIs ============
// NOTE: For multipart/form-data, do NOT set Content-Type manually — let the browser set it
export const voiceAPI = {
  transcribe: (formData) => api.post('/voice/transcribe', formData, {
    headers: { 'Content-Type': undefined },
  }),
  synthesize: (data) => api.post('/voice/synthesize', data),
}

export default api