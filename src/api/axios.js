import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.fixbhai.in/v1',
  timeout: 10000,
})

// Attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('fixbhai_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle errors
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fixbhai_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
