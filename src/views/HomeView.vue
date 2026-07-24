<script setup>
import { useDeals } from '@/stores/getDeals.js'
import { useClients } from '@/stores/getClients.js'
import { onMounted } from 'vue'

const dealStore = useDeals()
const clientStore = useClients()

onMounted(() => {
  dealStore.dealsGet()
  clientStore.clientsGet()
})
</script>

<template>
  <div class="dashboard">
    <h1>Bosh sahifa</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-number">{{ clientStore.state.clients.length }}</span>
        <span class="stat-label">Mijozlar</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ dealStore.state.deals.length }}</span>
        <span class="stat-label">Bitimlar</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.stat-card {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
}
.stat-label {
  color: #64748b;
  font-size: 0.9rem;
}
</style>
