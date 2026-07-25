<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import Toast from 'primevue/toast'
import { useAuthorization } from '@/stores/auth.js'

const sidebarOpen = ref(false)
const route = useRoute()
const authStore = useAuthorization()

onMounted(() => {
  authStore.loadUser()
})

// Sahifa almashganda sidebar avtomatik yopiladi
watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <SideBar :class="{ 'sidebar-open': sidebarOpen }" />

    <!-- Overlay -->
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>

    <!-- Hamburger -->
    <button
      class="hamburger-btn"
      :class="{ open: sidebarOpen }"
      @click="sidebarOpen = !sidebarOpen"
    >
      <i :class="sidebarOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
    </button>

    <!-- Asosiy kontent -->
    <main class="main-content">
      <Toast />
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

/* Asosiy kontent */
.main-content {
  flex: 1;
  padding: 2rem;
  background: #f8fafc;
  overflow-y: auto;
}

/* Desktop */
.hamburger-btn {
  display: none;
}

/* ---------------- MOBILE ---------------- */

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    padding-top: 4.5rem;
  }

  /* Sidebar */
  :deep(.sidebar) {
    position: fixed;
    top: 0;
    left: -260px;

    width: 260px;
    height: 100vh;

    z-index: 1000;
    transition: left 0.3s ease;
  }

  :deep(.sidebar.sidebar-open) {
    left: 0;
  }

  /* Overlay */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 999;
  }

  /* Hamburger */
  .hamburger-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    position: fixed;
    top: 1rem;
    left: 1rem;

    width: 46px;
    height: 46px;

    border: none;
    border-radius: 8px;

    background: white; /* to'q kulrang-ko'k fon — kontentdan ajralib turishi uchun */
    color: #1e293b;
    cursor: pointer;

    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    z-index: 1101;

    transition: left 0.3s ease;
  }

  .hamburger-btn.open {
    left: 210px;
    background: #1e293b;
    color: white;
  }

  .hamburger-btn i {
    font-size: 1.2rem;
  }
}
</style>
