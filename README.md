# Mini CRM — Frontend

Vue 3 asosidagi CRM interfeysi — mijozlar va bitimlarni boshqarish uchun.

## Texnologiyalar

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** — state management
- **Vue Router** — navigatsiya va himoyalangan sahifalar (Navigation Guards)
- **Axios** — backend API bilan aloqa (JWT token interceptor bilan)
- **PrimeVue** — UI komponentlar kutubxonasi (DataTable, Dialog, Toast va h.k.)

## Funksionallik

- Ro'yxatdan o'tish / kirish (JWT)
- Mijozlar — ro'yxat, qo'shish, o'chirish, batafsil sahifa (unga tegishli bitimlar bilan)
- Bitimlar — ro'yxat, qo'shish, status boshqaruvi, o'chirish
- Rolga asoslangan ko'rinish — har bir foydalanuvchi faqat o'z ma'lumotlarini ko'radi
- Responsive dizayn (mobil uchun ochiladigan sidebar)

## Ishga tushirish

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
