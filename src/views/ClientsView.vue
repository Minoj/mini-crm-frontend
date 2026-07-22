<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { useClients } from '@/stores/getClients.js'
import { computed, onMounted, reactive, ref } from 'vue'

const clientStore = useClients()
const loading = ref(false)
const showDialog = ref(false)
const submitting = ref(false)

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
  showDialog.value = true
}

async function handleCreateClient() {
  submitting.value = true
  try {
    await clientStore.createClient(form)
    await clientStore.clientsGet() // ro'yxatni yangilash
    showDialog.value = false
  } catch (error) {
    console.log('CREATE CLIENT ERROR:', error)
  } finally {
    submitting.value = false
  }
}

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
      <Column field="name" header="Ism"></Column>
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

      <!-- Bo'sh jadval holati uchun xabar (hali hech qanday mijoz bo'lmasa) -->
      <template #empty> Hozircha mijozlar mavjud emas. </template>
    </DataTable>

    <!-- Modal oyna — "Yangi mijoz" tugmasi bosilganda ochiladi.
         v-model:visible — Dialog'ning ochiq/yopiqligini boshqaradi -->
    <Dialog v-model:visible="showDialog" header="Yangi mijoz qo'shish" modal class="client-dialog">
      <form @submit.prevent="handleCreateClient" class="dialog-form">
        <div class="field">
          <label for="name">Ism</label>
          <InputText id="name" v-model="form.name" required class="w-full" />
        </div>

        <div class="field">
          <label for="phone">Telefon</label>
          <InputText
            id="phone"
            v-model="form.phone"
            placeholder="+998901234567"
            required
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <InputText id="email" v-model="form.email" type="email" required class="w-full" />
        </div>

        <div class="field">
          <label for="company">Kompaniya</label>
          <InputText id="company" v-model="form.company" required class="w-full" />
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
  </div>
</template>

<style scoped>
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
</style>
