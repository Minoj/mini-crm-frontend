<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function logOut() {
  localStorage.removeItem('accessToken')
  router.push('/login')
}
</script>

<template>
  <!-- Chap tomondagi doimiy sidebar -->
  <aside class="sidebar">
    <!-- Loyiha nomi/logotipi -->
    <div class="sidebar-header">
      <h2>Mini CRM</h2>
    </div>

    <!-- Navigatsiya linklari — router-link avtomatik "active" klass qo'shadi,
           joriy sahifaga mos link CSS orqali ajratib ko'rsatiladi -->
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-link">
        <i class="pi pi-home"></i>
        <span>Bosh sahifa</span>
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
  width: 260px; /* qattiq belgilangan kenglik — sidebar hech qachon torg'aymaydi/kengaymaydi */
  flex-shrink: 0; /* content siqilib ketganda ham sidebar o'z kengligini saqlaydi */
  background: #1e293b; /* to'q kulrang-ko'k fon — kontentdan ajralib turishi uchun */
  color: white;
  display: flex;
  flex-direction: column; /* header, nav, footer tepa-pastga tizilsin */
  padding: 1.5rem 0;
}

.sidebar-header {
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* nozik ajratuvchi chiziq */
  margin-bottom: 1rem;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1; /* qolgan bo'sh joyni egallaydi, footer pastga suriladi */
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
  margin-top: auto; /* footer'ni sidebar tagiga "yopishtiradi" */
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
</style>
