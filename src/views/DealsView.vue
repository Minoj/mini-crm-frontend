<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'
import { useClients } from '@/stores/getClients.js'
import { onMounted, reactive, ref } from 'vue'
import { useDeals } from '@/stores/getDeals.js'

const clientStore = useClients()
const dealStore = useDeals()
const showDialog = ref(false)
const submitting = ref(false)
const loading = ref(false)

function extractClientName(clientIri) {
  const id = clientIri.split('/').pop()
  const client = clientStore.state.clients.find((c) => c.id == id)
  return client ? client.name : 'Nomalum'
}

const statusOptions = ref([
  { label: 'Yangi', value: 'new' },
  { label: 'Muzokara', value: 'negotiation' },
  { label: 'Yutildi', value: 'won' },
  { label: "Yo'qotildi", value: 'lost' },
])

const form = reactive({
  clientId: '',
  title: '',
  amount: '',
})

onMounted(() => {
  dealStore.dealsGet()
  console.log(dealStore.dealsGet())
  clientStore.clientsGet()
})

function openCreateDialog() {
  form.clientId = ''
  form.title = ''
  form.amount = ''
  showDialog.value = true
}

async function handleCreateDeal() {
  submitting.value = true
  try {
    await dealStore.createDeal(form)
    await dealStore.dealsGet() // ro'yxatni yangilash
    showDialog.value = false
  } catch (error) {
    console.log('CREATE DEAL ERROR:', error)
  } finally {
    submitting.value = false
  }
}

function statusLabel(status) {
  const found = statusOptions.value.find((s) => s.value === status)
  return found ? found.label : status
}

function statusSeverity(status) {
  const map = {
    new: 'info',
    negotiation: 'warn',
    won: 'success',
    lost: 'danger',
  }
  return map[status] || 'info'
}

async function handleStatusChange(deal, newStatus) {
  try {
    await dealStore.updateDealStatus(deal.id, newStatus)
    await dealStore.dealsGet()
  } catch (error) {
    console.log('UPDATE STATUS ERROR:', error)
  }
}

function formatAmount(amount) {
  return parseFloat(amount).toLocaleString() + " so'm"
}
</script>

<template>
  <div class="deals-page">
    <div class="page-header">
      <h1>Bitimlar</h1>
      <Button label="Yangi bitim" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <DataTable
      :value="dealStore.state.deals"
      :loading="loading"
      paginator
      :rows="10"
      stripedRows
      class="deals-table"
    >
      <Column field="title" header="Nomi"></Column>

      <!-- Client — API IRI ko'rinishida keladi (masalan "/api/clients/1"),
           shuning uchun to'g'ridan-to'g'ri ko'rsatib bo'lmaydi, alohida formatlash kerak -->
      <Column header="Mijoz">
        <template #body="{ data }">
          {{ extractClientName(data.client) }}
        </template>
      </Column>

      <Column field="amount" header="Summa">
        <template #body="{ data }">
          {{ formatAmount(data.amount) }}
        </template>
      </Column>

      <!-- Status — oddiy matn emas, rangli "badge" (Tag komponenti) orqali ko'rsatiladi,
           bu holatni vizual jihatdan tezroq ажратиб olish uchun -->
      <Column header="Holati">
        <template #body="{ data }">
          <Tag :value="statusLabel(data.status)" :severity="statusSeverity(data.status)" />
        </template>
      </Column>

      <!-- Amallar ustuni — status o'zgartirish uchun dropdown -->
      <Column header="Statusni o'zgartirish">
        <template #body="{ data }">
          <Select
            :modelValue="data.status"
            @update:modelValue="(newStatus) => handleStatusChange(data, newStatus)"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            class="status-select"
          />
        </template>
      </Column>

      <template #empty> Hozircha bitimlar mavjud emas. </template>
    </DataTable>

    <!-- Yangi bitim yaratish formasi -->
    <Dialog v-model:visible="showDialog" header="Yangi bitim qo'shish" modal class="deal-dialog">
      <form @submit.prevent="handleCreateDeal" class="dialog-form">
        <div class="field">
          <label for="client">Mijoz</label>
          <!-- Mijozlar ro'yxatini clientStore'dan olamiz (allaqachon Kun 5'da bor) -->
          <Select
            id="client"
            v-model="form.clientId"
            :options="clientStore.state.clients"
            optionLabel="name"
            optionValue="id"
            placeholder="Mijozni tanlang"
            required
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="title">Nomi</label>
          <InputText id="title" v-model="form.title" required class="w-full" />
        </div>

        <div class="field">
          <label for="amount">Summa</label>
          <InputNumber
            id="amount"
            v-model="form.amount"
            mode="decimal"
            :minFractionDigits="2"
            required
            class="w-full"
          />
        </div>

        <div class="dialog-actions">
          <Button
            label="Bekor qilish"
            severity="secondary"
            text
            type="button"
            @click="showDialog = false"
          />
          <Button label="Saqlash" type="submit" :loading="submitting" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<style scoped>
.deals-page {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.deals-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.status-select {
  min-width: 160px; /* dropdown juda torayib ketmasligi uchun */
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 350px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}

.w-full {
  width: 100%;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
