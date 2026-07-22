<script setup>
import SideBar from '@/components/SideBar.vue'

</script>

<template>
  <!-- Butun sahifani egallaydigan flex konteyner — Sidebar chapda, kontent o'ngda -->
  <div class="app-layout">
    <SideBar />
    <!-- O'ng tomon — asosiy kontent maydoni -->
    <div class="main-content">
      <!-- router-view — bu yerga joriy sahifa (Dashboard, Clients va h.k.) render bo'ladi -->
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex; /* sidebar va content yonma-yon joylashishi uchun */
  min-height: 100vh; /* butun ekran balandligini egallaydi */
}

.main-content {
  flex-grow: 1; /* qolgan butun eni egallaydi */
  padding: 2rem;
  background: #f8fafc; /* juda och kulrang fon — sidebar'dan farqli, kontent uchun */
  overflow-y: auto; /* agar kontent ekrandan uzun bo'lsa, faqat shu qism scroll bo'ladi */
}
</style>
