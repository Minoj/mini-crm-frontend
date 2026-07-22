import axios from 'axios'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = 'Bearer ' + token
  }

  config.baseURL = import.meta.env.VITE_API_URL + '/api'
  if (config.method.toLowerCase() === 'patch') {
    config.headers['Content-Type'] = 'application/merge-patch+json'
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

export default axios
