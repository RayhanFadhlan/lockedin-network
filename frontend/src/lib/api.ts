import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
})

// make response interceptors that redirect to login if there is 401 error

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)



// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )



export default api