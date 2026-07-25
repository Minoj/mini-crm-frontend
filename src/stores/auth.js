import { defineStore } from 'pinia'
import axios from '@/api/axios.js'
import router from '@/router/index.js'
import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const useAuthorization = defineStore('authorization', () => {
  const user = ref(null)
  function userAuth(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('/users/auth', data)
        .then((response) => {
          const token = response.data.token
          console.log(jwtDecode(response.data.token))
          localStorage.setItem('accessToken', response.data.token)
          user.value = jwtDecode(token)
          resolve()
        })
        .catch((error) => {
          console.log('LOGIN ERROR:', error)
          reject()
        })
    })
  }

  function userRegister(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('/users/my', data)
        .then((response) => {
          console.log("User yaratildi")
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  }

  function loadUser() {
    const token  = localStorage.getItem('accessToken')

    if (token){
      user.value = jwtDecode(token)
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    user.value = null
  }

  return { userAuth, userRegister, loadUser, logout }
})
