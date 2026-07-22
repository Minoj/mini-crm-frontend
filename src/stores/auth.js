import { defineStore } from 'pinia'
import axios from '@/api/axios.js'
import router from '@/router/index.js'

export const useAuthorization = defineStore('authorization', () => {
  function userAuth(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('/users/auth', data)
        .then((response) => {
          console.log('RESPONSE DATA:', response.data)
          localStorage.setItem('accessToken', response.data.token)
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

  function userLogOut() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  return { userAuth, userRegister, userLogOut }
})
