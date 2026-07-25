<script setup>
import { useDeals } from '@/stores/getDeals.js'
import { useClients } from '@/stores/getClients.js'
import { computed, onMounted } from 'vue'

const dealStore = useDeals()
const clientStore = useClients()

onMounted(() => {
  dealStore.dealsGet()
  clientStore.clientsGet()
})

const wonDealsCount = computed(() => dealStore.state.deals.filter((d) => d.status === 'won').length)

const totalWonAmount = computed(() => {
  const total = dealStore.state.deals
    .filter((d) => d.status === 'won')
    .reduce((sum, d) => sum + parseFloat(d.amount), 0)
  return total.toLocaleString() + " so'm"
})
</script>

<template>
  <div class="dashboard">
    <h1>Xush kelibsiz!</h1>
    <p class="subtitle">Bugungi umumiy ko'rsatkichlar</p>

    <!-- Statistika kartochkalari — har biri o'z rangi va ikonkasi bilan -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon clients-icon">
          <i class="pi pi-users"></i>
        </div>
        <div class="stat-content">
          <span class="stat-number">{{ clientStore.state.clients.length }}</span>
          <span class="stat-label">Mijozlar</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon deals-icon">
          <i class="pi pi-briefcase"></i>
        </div>
        <div class="stat-content">
          <span class="stat-number">{{ dealStore.state.deals.length }}</span>
          <span class="stat-label">Bitimlar</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon won-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-number">{{ wonDealsCount }}</span>
          <span class="stat-label">Yutilgan bitimlar</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon amount-icon">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="stat-content">
          <span class="stat-number">{{ totalWonAmount }}</span>
          <span class="stat-label">Umumiy summa (yutilgan)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #1e293b;
}

.subtitle {
  color: #64748b;
  margin-top: 0.25rem;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* avtomatik moslashuvchi ustunlar */
  gap: 1.25rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
  flex-shrink: 0; /* kartochka torayganda ikonka siqilib qolmasin */
}

.clients-icon {
  background: #3b82f6;
} /* ko'k — mijozlar */
.deals-icon {
  background: #8b5cf6;
} /* siyohrang — bitimlar */
.won-icon {
  background: #22c55e;
} /* yashil — muvaffaqiyat */
.amount-icon {
  background: #f59e0b;
} /* sariq — pul */

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
}
</style>
