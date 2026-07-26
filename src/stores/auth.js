import { defineStore } from 'pinia'
import axios from '@/api/axios.js'
import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const useAuthorization = defineStore('authorization', () => {
  const user = ref(null)

  function userAuth(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('/users/auth', data)
        .then((response) => {
          localStorage.setItem('accessToken', response.data.token)
          return fetchCurrentUser()
        })
        .then(() => resolve())
        .catch(() => reject())
    })
  }

  function userRegister(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('/users/my', data)
        .then((response) => {
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  }

  function loadUser() {
    const token = localStorage.getItem('accessToken')

    if (token) {
      user.value = jwtDecode(token)
    }
  }

  function fetchCurrentUser() {
    return new Promise((resolve, reject) => {
      axios
        .get('/users/me')
        .then((response) => {
          localStorage.setItem('userInfo', JSON.stringify(response.data))
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    user.value = null
  }

  return { userAuth, userRegister, loadUser, logout}
})
