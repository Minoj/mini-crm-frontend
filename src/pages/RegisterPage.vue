<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthorization } from '@/stores/auth.js'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const router = useRouter()
const registerStore = useAuthorization()

async function register() {
  errorMessage.value = ''
  loading.value = true
  try {
    await registerStore.userRegister({
      name: name.value,
      email: email.value,
      password: password.value,
    })
    console.log({
      email: email.value,
      password: password.value,
    })
    await registerStore.userAuth({
      email: email.value,
      password: password.value,
    })
    await router.push('/')
  } catch (err) {
    errorMessage.value = 'Xatolik yuz berdi malumotni qaytadan tekshiring'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Login bilan bir xil tashqi konteyner — dizayn izchilligi uchun ataylab bir xil class ishlatilgan -->
  <div class="login-page">
    <div class="login-card">
      <h1>Mini CRM</h1>
      <p class="subtitle">Ro'yxatdan o'tish</p>

      <form @submit.prevent="register()" class="form">
        <!-- Login'dan farqi — bu yerda "Ism" fieldi qo'shilgan -->
        <div class="field">
          <label for="name">Ism</label>
          <InputText id="name" v-model="name" required class="w-full" />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" type="email" required class="w-full" />
        </div>

        <div class="field">
          <label for="password">Parol</label>
          <!-- Diqqat: bu yerda :feedback="false" YO'Q — chunki register paytida
               PrimeVue avtomatik parol kuchini ko'rsatuvchi progress bar chiqaradi,
               bu foydalanuvchiga kuchliroq parol tanlashga yordam beradi.
               Login sahifasida bu keraksiz edi (u yerda faqat tekshirish, tanlash emas) -->
          <Password
            id="password"
            v-model="password"
            toggleMask
            required
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <Message v-if="errorMessage" severity="error" :closable="false">
          {{ errorMessage }}
        </Message>

        <Button type="submit" label="Ro'yxatdan o'tish" :loading="loading" class="w-full" />
      </form>

      <!-- Login sahifasiga qaytish havolasi -->
      <p class="switch-link">
        Akkauntingiz bormi?
        <router-link to="/login">Kirish</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f4f6f9;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  text-align: center;
  margin: 0;
  font-size: 1.75rem;
  color: #1e293b;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-top: 0.25rem;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.switch-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.switch-link a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}
</style>
