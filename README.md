# Mini CRM — Frontend

Vue 3 asosidagi CRM interfeysi — mijozlar va bitimlarni boshqarish uchun.

## 🔗 Demo

- **Ilova:** https://humoyun1.uz
- **Backend API:** https://mini-crm-backend-218m.onrender.com/api/docs

> ⚠️ **Muhim:** Backend bepul Render rejasida ishlaydi va faolsizlikdan keyin "uxlab qoladi". **Saytga birinchi kirishda (login qilishda) 30-60 soniya kutish kerak bo'lishi mumkin** — bu server uyg'onayotganini bildiradi, xato emas. Sahifani qayta yuklamasdan, shunchaki kuting.

## Texnologiyalar

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** — state management
- **Vue Router** — navigatsiya va himoyalangan sahifalar (Navigation Guards)
- **Axios** — backend API bilan aloqa (JWT token interceptor bilan)
- **PrimeVue 4** — UI komponentlar kutubxonasi (DataTable, Dialog, Toast va h.k.)

## Funksionallik

- Ro'yxatdan o'tish / kirish (JWT)
- **Mijozlar** — ro'yxat, qo'shish, o'chirish, batafsil sahifa (unga tegishli bitimlar bilan)
- **Bitimlar** — ro'yxat, qo'shish, status boshqaruvi, o'chirish
- **Rolga asoslangan ko'rinish** — har bir foydalanuvchi faqat o'z ma'lumotlarini ko'radi
- **Admin Panel** — foydalanuvchilar ro'yxati va rol boshqaruvi
- **Foydalanuvchi profili** — Sidebar'da joriy foydalanuvchi ismi va roli
- **Responsive dizayn** — mobil qurilmalarda ochiladigan/yopiladigan sidebar

## Lokal ishga tushirish

\`\`\`bash
npm install
npm run dev
\`\`\`

`.env` faylida backend manzilini ko'rsating:
\`\`\`
VITE_API_URL=http://localhost:8000
\`\`\`

## Loyiha haqida

Bu loyiha Vue 3 va PrimeVue'ni o'rganish maqsadida, Claude (Anthropic) yordamida qurilgan — AI dizayn (template/CSS) va texnik yo'nalish bergan, JavaScript logikasi (state, API integratsiyasi) mustaqil yozilgan.
