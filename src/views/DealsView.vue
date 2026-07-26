<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useClients } from '@/stores/getClients.js'
import { onMounted, reactive, ref } from 'vue'
import { useDeals } from '@/stores/getDeals.js'
import { useToast } from 'primevue/usetoast'

const clientStore = useClients()
const dealStore = useDeals()
const toast = useToast()

const showDialog = ref(false)
const submitting = ref(false)
const loading = ref(false)
const confirm = useConfirm()
const submitted = ref(false)

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
  amount: null,
})

function openCreateDialog() {
  form.clientId = ''
  form.title = ''
  form.amount = null
  submitted.value = false
  showDialog.value = true
}

async function handleCreateDeal() {
  submitted.value = true

  if (!form.clientId || !form.title || !form.amount) {
    return
  }

  submitting.value = true

  try {
    await dealStore.createDeal(form)
    await dealStore.dealsGet() // ro'yxatni yangilash
    toast.add({
      severity: 'success',
      summary: 'Muvaffaqiyatli',
      detail: 'Bitim yaratildi',
      life: 3000,
    })
    showDialog.value = false
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Xatolik',
      detail: 'Client yaratilmadi',
      life: 3000,
    })
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
  }
}

async function confirmDelete(deal) {
  confirm.require({
    group: 'templating',
    message: `"${deal.title}" ni o'chirmoqchimisiz?`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await dealStore.deleteDeal(deal.id)
        await dealStore.dealsGet()

        toast.add({
          severity: 'success',
          summary: 'Muvaffaqiyatli',
          detail: "Bitim o'chirildi",
          life: 3000,
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Xatolik',
          detail: "Bitimni o'chirib bo'lmadi",
          life: 3000,
        })
      }
    },
  })
}

onMounted(() => {
  dealStore.dealsGet()
  clientStore.clientsGet()
})

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

      <Column header="Bitim o'chirish">
        <template #body="{ data }">
          <Button icon="pi pi-trash" severity="danger" text @click="confirmDelete(data)" />
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
            :invalid="submitted && !form.clientId"
            class="w-full"
          />
          <small v-if="submitted && !form.clientId" class="error-text">
            Mijoz tanlanishi shart
          </small>
        </div>

        <div class="field">
          <label for="title">Nomi</label>
          <InputText
            id="title"
            v-model="form.title"
            class="w-full"
            :invalid="submitted && !form.title"
          />
          <small v-if="submitted && !form.title" class="error-text">
            Title kiritilishi shart
          </small>
        </div>

        <div class="field">
          <label for="amount">Summa</label>
          <InputNumber
            id="amount"
            v-model="form.amount"
            mode="decimal"
            :minFractionDigits="0"
            :maxFractionDigits="2"
            :max="99999999.99"
            :invalid="submitted && !form.amount"
            class="w-full"
          />
          <small v-if="submitted && !form.amount" class="error-text">
            Title kiritilishi shart
          </small>
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

    <ConfirmDialog group="templating">
      <template #message="slotProps">
        <div class="flex flex-column align-items-center w-full gap-3">
          <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
          <p>{{ slotProps.message.message }}</p>
        </div>
      </template>
    </ConfirmDialog>
  </div>
</template>

<style scoped>
.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 4px;
}

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

:deep(.p-dialog) {
  margin: 1rem; /* barcha tomondan minimal masofa, ekranning eng chetiga yopishmasin */
  max-width: calc(
    100vw - 2rem
  ); /* Dialog kengligi ekrandan katta bo'lmasin (1rem chap + 1rem o'ng) */
}

:deep(.deal-dialog) {
  margin: 1rem;
  max-width: calc(100vw - 2rem);
}
</style>
