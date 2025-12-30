import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
})

export const getAllArticles = async () => {
    try {
        const response = await apiClient.get('/articles')
        if (response.data.success) {
            return response.data.data
        }
        throw new Error('Failed to fetch articles')
    } catch (error) {
        console.error('API Fetch Error:', error?.response || error)
        throw error
    }
}

export const getArticleById = async (id) => {
    try {
        const response = await apiClient.get(`/articles/${id}`)
        if (response.data.success) {
            return response.data.data
        }
        throw new Error('Failed to fetch article')
    } catch (error) {
        console.error('API Fetch Error:', error?.response || error)
        throw error
    }
}

export default apiClient
