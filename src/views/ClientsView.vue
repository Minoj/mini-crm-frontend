<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useClients } from '@/stores/getClients.js'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useAuthorization } from '@/stores/auth.js'

const clientStore = useClients()
const toast = useToast()
const authStore = useAuthorization()

const loading = ref(false)
const showDialog = ref(false)
const submitting = ref(false)
const confirm = useConfirm()
const submitted = ref(false)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
})
onMounted(() => {
  clientStore.clientsGet()
})

function openCreateDialog() {
  form.name = ''
  form.phone = ''
  form.email = ''
  form.company = ''
  submitted.value = false
  showDialog.value = true
}

async function handleCreateClient() {
  submitted.value = true

  if (!form.name || !form.email || !form.phone || !form.company) {
    return
  }

  if (!emailRegex.test(form.email)) {
    return
  }

  submitting.value = true

  try {
    await clientStore.createClient(form)
    await clientStore.clientsGet() // ro'yxatni yangilash
    toast.add({
      severity: 'success',
      summary: 'Muvaffaqiyatli',
      detail: 'Client yaratildi',
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
    console.log('CREATE CLIENT ERROR:', error)
  } finally {
    submitting.value = false
  }
}

async function confirmDelete(client) {
  confirm.require({
    group: 'templating',
    message: `"${client.name}" ni o'chirmoqchimisiz?`,
    header: 'Tasdiqlash',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await clientStore.deleteClient(client.id)
      await clientStore.clientsGet()
    },
  })
}

const canDelete = computed(() => {
  return (
    authStore.user?.roles?.includes('ROLE_ADMIN') || authStore.user?.roles?.includes('ROLE_MANAGER')
  )
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="clients-page">
    <!-- Sahifa sarlavhasi va "Yangi mijoz" tugmasi bir qatorda, ikki chetga surilgan -->
    <div class="page-header">
      <h1>Mijozlar</h1>
      <Button label="Yangi mijoz" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <!-- Asosiy jadval — :value orqali massivni uzatasan, :loading esa
         ma'lumot yuklanayotganda avtomatik spinner ko'rsatadi -->
    <DataTable
      :value="clientStore.state.clients"
      :loading="loading"
      paginator
      :rows="10"
      stripedRows
      class="clients-table"
    >
      <!-- Har bir Column — jadvaldagi bitta ustun.
           field — ma'lumotdagi qaysi kalitdan olinishini bildiradi -->
      <Column header="Ism">
        <template #body="{ data }">
          <router-link :to="'/clients/' + data.id" class="client-link">
            {{ data.name }}
          </router-link>
        </template>
      </Column>
      <Column field="phone" header="Telefon"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="company" header="Kompaniya"></Column>

      <!-- Maxsus ustun — sana formatini o'zgartirish uchun slot ishlatilgan.
           #body="{ data }" — har bir qator uchun shu qism qayta render bo'ladi,
           data — o'sha qatorning to'liq obyekti -->
      <Column header="Yaratilgan sana">
        <template #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>
      </Column>

      <Column v-if="canDelete" header="Deal o'chirish">
        <template #body="{ data }">
          <Button icon="pi pi-trash" severity="danger" text @click="confirmDelete(data)">
            Uchirish
          </Button>
        </template>
      </Column>

      <!-- Bo'sh jadval holati uchun xabar (hali hech qanday mijoz bo'lmasa) -->
      <template #empty> Hozircha mijozlar mavjud emas. </template>
    </DataTable>

    <!-- Modal oyna — "Yangi mijoz" tugmasi bosilganda ochiladi.
         v-model:visible — Dialog'ning ochiq/yopiqligini boshqaradi -->
    <Dialog v-model:visible="showDialog" header="Yangi mijoz qo'shish" modal class="client-dialog">
      <form @submit.prevent="handleCreateClient" class="dialog-form">
        <div class="field">
          <label for="name">Ism</label>
          <InputText
            id="name"
            v-model="form.name"
            class="w-full"
            :invalid="submitted && !form.name"
          />
          <small v-if="submitted && !form.name" class="error-text"> Ism kiritilishi shart </small>
        </div>

        <div class="field">
          <label for="phone">Telefon</label>
          <InputText
            id="phone"
            v-model="form.phone"
            :invalid="submitted && !form.phone"
            placeholder="+998901234567"
            class="w-full"
          />
          <small v-if="submitted && !form.phone" class="error-text">
            Telefon kiritilishi shart
          </small>
        </div>

        <div class="field">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="form.email"
            type="email"
            class="w-full"
            :invalid="submitted && (!form.email || !emailRegex.test(form.email))"
          />
          <small v-if="submitted && !form.email" class="error-text"> Email kiritishi shart </small>
          <small v-else-if="submitted && !emailRegex.test(form.email)" class="error-text">
            Email formati noto'g'ri
          </small>
        </div>

        <div class="field">
          <label for="company">Kompaniya</label>
          <InputText
            id="company"
            v-model="form.company"
            class="w-full"
            :invalid="submitted && !form.company"
          />
          <small v-if="submitted && !form.company" class="error-text">
            Kompaniya nomi kiritilishi shart
          </small>
        </div>

        <!-- Dialog pastidagi tugmalar — Bekor qilish va Saqlash -->
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

.client-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}
.client-link:hover {
  text-decoration: underline;
}

.clients-page {
  max-width: 1100px; /* jadval juda kengayib ketmasligi uchun chegara */
}

.page-header {
  display: flex;
  justify-content: space-between; /* sarlavha chapda, tugma o'ngda */
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}

.clients-table {
  background: white;
  border-radius: 8px;
  overflow: hidden; /* jadval burchaklari border-radius bilan tekis kesilishi uchun */
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 350px; /* Dialog juda tor bo'lib qolmasligi uchun */
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
  justify-content: flex-end; /* ikkala tugma o'ngga tortiladi */
  gap: 0.75rem;
  margin-top: 0.5rem;
}

:deep(.client-dialog) {
  margin: 1rem;
  max-width: calc(100vw - 2rem);
}

:deep(.p-dialog) {
  margin: 1rem; /* barcha tomondan minimal masofa, ekranning eng chetiga yopishmasin */
  max-width: calc(
    100vw - 2rem
  ); /* Dialog kengligi ekrandan katta bo'lmasin (1rem chap + 1rem o'ng) */
}
</style>
