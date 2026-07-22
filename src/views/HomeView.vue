<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()
function logOut(){
  localStorage.removeItem('accessToken')
  router.push('/login')
}
</script>

<template>
  <div class="about">
    <h1>This is an Home page</h1>

    <router-link @click="logOut()" to="/login">Chiqish</router-link>
  </div>
</template>
