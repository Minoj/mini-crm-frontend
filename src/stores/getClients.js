import { defineStore } from 'pinia'
import { reactive } from 'vue'
import axios from '@/api/axios.js'

export const useClients = defineStore('client', () => {
  const state = reactive({
    clients: [],
    totalItems: 0,
    selectedClient: null,
    status: null,
    loading: false,
  })

  function clientsGet() {
    state.loading = true

    return new Promise((resolve, reject) => {
      axios
        .get('/clients')
        .then((response) => {
          state.clients = response.data.member
          state.totalItems = response.data.totalItems
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          state.loading = false
        })
    })
  }

  function clientGetById(id) {
    return new Promise((resolve, reject) => {
      axios
        .get('/clients/' + id)
        .then((response) => {
          state.selectedClient = response.data
          resolve(response.data)
        })
        .catch((error) => {
          state.status = error.response.data.detail
          reject(error.response)
        })
    })
  }

  function createClient(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('/client', data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          state.loading = false
        })
    })
  }

  function deleteClient(id) {
    return new Promise((resolve, reject) => {
      axios
        .delete('/clients/'+ id)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  return { clientsGet, clientGetById, createClient, deleteClient, state }
})
