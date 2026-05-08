import axios, { AxiosInstance } from 'axios'
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials,
  Course,
  Lesson,
  Enrollment,
  DashboardStats
} from '@/types'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials)
    return response.data
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', credentials)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile')
    return response.data
  },
}

// Courses API
export const coursesApi = {
  getAll: async (params?: { level?: string; search?: string }): Promise<Course[]> => {
    const response = await api.get<Course[]>('/api/courses', { params })
    return response.data
  },

  getById: async (id: string): Promise<Course> => {
    const response = await api.get<Course>(`/api/courses/${id}`)
    return response.data
  },
}

// Lessons API
export const lessonsApi = {
  getById: async (id: string): Promise<Lesson> => {
    const response = await api.get<Lesson>(`/api/lessons/${id}`)
    return response.data
  },

  complete: async (id: string): Promise<{ xp: number; message: string }> => {
    const response = await api.post(`/api/lessons/${id}/complete`)
    return response.data
  },
}

// Enrollments API
export const enrollmentsApi = {
  enroll: async (courseId: string): Promise<Enrollment> => {
    const response = await api.post<Enrollment>(`/api/enrollments/${courseId}`)
    return response.data
  },

  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await api.get<Enrollment[]>('/api/enrollments/my')
    return response.data
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/api/enrollments/stats')
    return response.data
  },
}

export default api
