<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { onMounted } from 'vue'
import { useUsers } from '@/stores/getUsers.js'
import { useToast } from 'primevue/usetoast'

const userStore = useUsers()
const toast = useToast()

const roleOptions = [
  { label: 'Foydalanuvchi', value: 'ROLE_USER' },
  { label: 'Admin', value: 'ROLE_ADMIN' },
]

onMounted(() => {
  userStore.usersGet()
})

async function handleRoleChange(user, newRole) {
  try {
    await userStore.changeUserRole(user.id, newRole)
    await userStore.usersGet()
    toast.add({
      severity: 'success',
      summary: 'Muvaffaqiyatli',
      detail: 'Rol yangilandi',
      life: 3000,
    })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Rol yangilanmadi', life: 3000 })
  }
}
</script>

<template>
  <div class="users-page">
    <div class="page-header">
      <h1>Foydalanuvchilar</h1>
    </div>

    <DataTable
      :value="userStore.state.users"
      :loading="userStore.state.loading"
      paginator
      :rows="10"
      stripedRows
      class="users-table"
    >
      <Column field="name" header="Ism"></Column>
      <Column field="email" header="Email"></Column>

      <Column header="Rol">
        <template #body="{ data }">
          <Tag
            :value="data.roles.includes('ROLE_ADMIN') ? 'Admin' : 'Foydalanuvchi'"
            :severity="data.roles.includes('ROLE_ADMIN') ? 'danger' : 'info'"
          />
        </template>
      </Column>

      <Column header="Rolni o'zgartirish">
        <template #body="{ data }">
          <Select
            :modelValue="data.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'"
            @update:modelValue="(newRole) => handleRoleChange(data, newRole)"
            :options="roleOptions"
            optionLabel="label"
            optionValue="value"
            class="role-select"
          />
        </template>
      </Column>

      <template #empty> Foydalanuvchilar mavjud emas. </template>
    </DataTable>
  </div>
</template>

<style scoped>
.users-page {
  max-width: 1000px;
}
.page-header {
  margin-bottom: 1.5rem;
}
.page-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e293b;
}
.users-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}
.role-select {
  min-width: 160px;
}
</style>
