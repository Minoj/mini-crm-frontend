import { defineStore } from 'pinia'
import { reactive } from 'vue'
import axios from '@/api/axios.js'

export const useDeals = defineStore('deals', () => {
  const state = reactive({
    deals: [],
    loading: false,
    selectedDeal: null,
    status: null,
  })

  function dealsGet() {
    state.loading = true
    return new Promise((resolve, reject) => {
      axios
        .get('/deals')
        .then((response) => {
          state.deals = response.data.member
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

  function dealGetById(id) {
    return new Promise((resolve, reject) => {
      axios
        .get('/deals/' + id)
        .then((response) => {
          state.selectedDeal = response.data
          resolve(response.data)
        })
        .catch((error) => {
          state.status = error.response.data.detail
          reject(error.response)
        })
    })
  }

  function createDeal(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('/deals/my', data)
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

  function deleteDeal(id) {
    return new Promise((resolve, reject) => {
      axios
        .delete('/deals/' + id)
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

  function updateDealStatus(id, status) {
    return new Promise((resolve, reject) => {
      axios
        .patch('/deals/' + id, { status: status })
        .then((response) => {
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

  return { dealsGet, dealGetById, createDeal, updateDealStatus, deleteDeal, state }
})
