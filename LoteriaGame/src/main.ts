import './assets/styles/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useStatisticsStore } from '@/stores/statistics'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar stores después de montar Pinia
app.mount('#app')

// Inicializar el store de estadísticas
const statisticsStore = useStatisticsStore()
statisticsStore.initialize()