<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useClients } from '@/stores/getClients.js'
import { useDeals } from '@/stores/getDeals.js'

const clientStore = useClients()
const dealStore = useDeals()

const route = useRoute()
const id = route.params.id

function extractId(iri) {
  return iri.split('/').pop()
}

const filteredDeals = computed(() =>
  dealStore.state.deals.filter((d) => extractId(d.client) === id),
)

onMounted(() => {
  clientStore.clientGetById(id)
  dealStore.dealsGet()
})
</script>

<template>
  <div class="client-detail-page">
    <!-- Orqaga qaytish havolasi — mijozlar ro'yxatiga -->
    <router-link to="/clients" class="back-link">
      <i class="pi pi-arrow-left"></i>
      Mijozlar ro'yxatiga qaytish
    </router-link>

    <!-- Mijoz ma'lumotlari kartochkasi — faqat clientStore.state.selectedClient
         yuklangandan keyin ko'rinadi (v-if orqali "flash" bo'lib ko'rinishning oldi olinadi) -->
    <div v-if="clientStore.state.selectedClient" class="client-card">
      <h1>{{ clientStore.state.selectedClient.name }}</h1>

      <!-- Ma'lumotlar grid ko'rinishida — har biri ikonka bilan -->
      <div class="client-info-grid">
        <div class="info-item">
          <i class="pi pi-phone"></i>
          <span>{{ clientStore.state.selectedClient.phone }}</span>
        </div>
        <div class="info-item">
          <i class="pi pi-envelope"></i>
          <span>{{ clientStore.state.selectedClient.email }}</span>
        </div>
        <div class="info-item">
          <i class="pi pi-building"></i>
          <span>{{ clientStore.state.selectedClient.company }}</span>
        </div>
      </div>
    </div>

    <!-- Shu mijozga tegishli bitimlar bo'limi -->
    <div class="deals-section">
      <h2>Bitimlar</h2>

      <DataTable :value="filteredDeals" stripedRows class="deals-table">
        <Column field="title" header="Nomi"></Column>
        <Column field="amount" header="Summa">
          <template #body="{ data }">
            {{ parseFloat(data.amount).toLocaleString() }} so'm
          </template>
        </Column>
        <Column header="Holati">
          <template #body="{ data }">
            <Tag :value="data.status" />
          </template>
        </Column>

        <!-- Bo'sh holat — agar bu mijozga hali bitim biriktirilmagan bo'lsa -->
        <template #empty> Bu mijoz uchun hozircha bitimlar mavjud emas. </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.client-detail-page {
  max-width: 900px;
}

.back-link {
  display: inline-flex; /* ikonka va matn bir chiziqda, lekin butun eni egallamaydi */
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.back-link:hover {
  color: #2563eb; /* hover'da rang o'zgarishi — bosilishi mumkinligini ko'rsatadi */
}

.client-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
}

.client-card h1 {
  margin: 0 0 1.25rem 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.client-info-grid {
  display: flex;
  flex-wrap: wrap; /* tor ekranlarda pastga tushib ketsin */
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.95rem;
}

.info-item i {
  color: #2563eb; /* ikonkalar aksent rang bilan ajralib tursin */
}

.deals-section h2 {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

.deals-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
</style>
