import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Unwrap { success: true, data: {...} } so every API call gets the inner data directly
apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data !== null &&
      typeof response.data === 'object' &&
      response.data.success === true &&
      'data' in response.data
    ) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export default apiClient
