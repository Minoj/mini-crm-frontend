<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function onClick(){
  router.push('/clients')
}
</script>

<template>
  <div class="about">
    <h1>This is an Home page</h1>
    <Button>
      <router-link to="/clients">Client</router-link>
    </Button>
  </div>
</template>
