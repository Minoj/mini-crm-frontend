import { defineStore } from 'pinia'
import { reactive } from 'vue'
import axios from '@/api/axios.js'

export const useUsers = defineStore('users', () => {
  const state = reactive({
    users: [],
    loading: false,
  })

  function usersGet() {
    state.loading = true
    return new Promise((resolve, reject) => {
      axios
        .get('/users')
        .then((response) => {
          state.users = response.data.member
          resolve(response.data)
        })
        .catch((error) => reject(error))
        .finally(() => {
          state.loading = false
        })
    })
  }

  function changeUserRole(id, role) {
    return new Promise((resolve, reject) => {
      axios
        .patch(`/users/${id}/role`, { role })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error))
    })
  }

  return { state, usersGet, changeUserRole }
})
