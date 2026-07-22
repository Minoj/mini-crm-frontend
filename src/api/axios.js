import axios from 'axios'

axios.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem('accessToken')
  config.baseURL = import.meta.env.VITE_API_URL + '/api'

  if (config.method.toLowerCase() === 'patch') {
    config.headers['Content-Type'] = 'application/merge-patch+json'
  } else {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

export default axios
