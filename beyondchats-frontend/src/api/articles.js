import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // Increased timeout for cold starts on Render
    withCredentials: false, // Set to false since we're using origin: true on backend
})

// Request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
        return config
    },
    (error) => {
        console.error('📤 Request Error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor for logging
apiClient.interceptors.response.use(
    (response) => {
        console.log(`📥 API Response: ${response.status} from ${response.config.url}`)
        return response
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error(`📥 API Error ${error.response.status}:`, error.response.data)
        } else if (error.request) {
            // No response received (network error, CORS, etc.)
            console.error('📥 Network Error - No response received:', error.message)
        } else {
            // Request setup error
            console.error('📥 Request Setup Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export const getAllArticles = async () => {
    try {
        const response = await apiClient.get('/articles')
        if (response.data.success) {
            return response.data.data
        }
        throw new Error(response.data.message || 'Failed to fetch articles')
    } catch (error) {
        // Re-throw with more context
        const errorMessage = error.response?.data?.message
            || error.message
            || 'Unknown error occurred'
        console.error('🔴 getAllArticles failed:', errorMessage)
        throw error
    }
}

export const getArticleById = async (id) => {
    try {
        const response = await apiClient.get(`/articles/${id}`)
        if (response.data.success) {
            return response.data.data
        }
        throw new Error(response.data.message || 'Failed to fetch article')
    } catch (error) {
        const errorMessage = error.response?.data?.message
            || error.message
            || 'Unknown error occurred'
        console.error(`🔴 getArticleById(${id}) failed:`, errorMessage)
        throw error
    }
}

export default apiClient

