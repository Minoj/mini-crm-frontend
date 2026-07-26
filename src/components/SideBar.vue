<script setup>
import { useRouter } from 'vue-router'
import { useAuthorization } from '@/stores/auth.js'
import { computed } from 'vue'

const authStore = useAuthorization()
const router = useRouter()

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const isAdmin = computed(() => userInfo.roles?.includes('ROLE_ADMIN'))

function logOut() {
  authStore.logout()
  router.replace('/login')
}
</script>

<template>
  <!-- Chap tomondagi doimiy sidebar -->
  <aside class="sidebar">
    <!-- Loyiha nomi/logotipi -->
    <div class="sidebar-header">
      <h2>Mini CRM</h2>
    </div>

    <div class="user-profile">
      <div class="user-avatar">{{ userInfo.name?.[0]?.toUpperCase() }}</div>
      <div class="user-details">
        <span class="user-name">{{ userInfo.name }}</span>
        <span class="user-role">{{
          userInfo.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Menejer'
        }}</span>
      </div>
    </div>

    <!-- Navigatsiya linklari — router-link avtomatik "active" klass qo'shadi,
           joriy sahifaga mos link CSS orqali ajratib ko'rsatiladi -->
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-link">
        <i class="pi pi-home"></i>
        <span>Bosh sahifa</span>
      </router-link>

      <router-link v-if="isAdmin" to="/users" class="nav-link">
        <i class="pi pi-shield"></i>
        <span>Foydalanuvchilar</span>
      </router-link>

      <router-link to="/clients" class="nav-link">
        <i class="pi pi-users"></i>
        <span>Mijozlar</span>
      </router-link>

      <router-link to="/deals" class="nav-link">
        <i class="pi pi-briefcase"></i>
        <span>Bitimlar</span>
      </router-link>
    </nav>

    <!-- Pastda joylashgan chiqish tugmasi — sidebar tagiga "yopishtirish" uchun
           mt-auto (margin-top: auto) ishlatiladi flex konteynerida -->
    <div class="sidebar-footer">
      <router-link to="/login" class="logout-btn" @click="logOut()">
        <i class="pi pi-sign-out"></i>
        <span>Chiqish</span>
      </router-link>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  height: 100vh; /* aniq balandlik — 100% ekran, ortiqcha emas */
  overflow: hidden; /* butun sidebar hech qachon scroll bo'lmaydi */
  box-sizing: border-box; /* padding balandlikka qo'shilib, oshib ketmasin */
}

.sidebar-header {
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  flex-shrink: 0; /* header hech qachon siqilmasin */
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1; /* qolgan bo'sh joyni egallaydi */
  overflow-y: auto; /* agar link'lar ko'p bo'lsa, FAQAT shu qism scroll bo'ladi, butun sidebar emas */
  min-height: 0; /* flexbox'da overflow to'g'ri ishlashi uchun zarur trik */
}

.nav-link {
  display: flex;
  align-items: center; /* ikonka va matn bir chiziqda joylashsin */
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #cbd5e1; /* och kulrang — oddiy holatda */
  text-decoration: none;
  transition: background 0.15s; /* hover'da yumshoq o'tish effekti */
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05); /* sichqoncha ustiga kelganda nozik yorishish */
  color: white;
}

/* Vue Router avtomatik qo'shadigan klass — joriy faol sahifa uchun */
.nav-link.router-link-active {
  background: #2563eb; /* ko'k fon — qaysi sahifada ekaningni aniq ko'rsatadi */
  color: white;
}

.nav-link i {
  font-size: 1.1rem;
  width: 20px; /* barcha ikonkalar bir xil kenglikda, matn tekis boshlansin */
}

.sidebar-footer {
  padding: 0 1.5rem;
  flex-shrink: 0; /* footer (chiqish tugmasi) hech qachon siqilmaydi yoki yashirilmaydi */
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #cbd5e1;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.15s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}
.user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* uzun ism kesilib, "..." bilan tugasin */
}
.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
}
</style>
