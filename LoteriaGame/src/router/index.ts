import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy loading de componentes para mejor rendimiento
const HomeView = () => import('@/views/HomeView.vue')
const GameView = () => import('@/views/GameView.vue')
const StatisticsView = () => import('@/views/StatisticsView.vue')
const AchievementsView = () => import('@/views/AchievementsView.vue')
const SettingsView = () => import('@/views/SettingsView.vue')
const CardGalleryView = () => import('@/views/CardGalleryView.vue')
const CardDemoView = () => import('@/views/CardDemoView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Inicio - Lotería Día de Muertos',
      description: 'Página principal del juego de Lotería Mexicana'
    }
  },
  {
    path: '/juego',
    name: 'game',
    component: GameView,
    meta: {
      title: 'Juego - Lotería Día de Muertos',
      description: 'Partida de Lotería Mexicana en curso',
      requiresGame: true
    }
  },
  {
    path: '/estadisticas',
    name: 'statistics',
    component: StatisticsView,
    meta: {
      title: 'Estadísticas - Lotería Día de Muertos',
      description: 'Estadísticas de rendimiento del jugador'
    }
  },
  {
    path: '/logros',
    name: 'achievements',
    component: AchievementsView,
    meta: {
      title: 'Logros - Lotería Día de Muertos',
      description: 'Logros desbloqueados y progreso'
    }
  },
  {
    path: '/configuracion',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Configuración - Lotería Día de Muertos',
      description: 'Configuración del juego y preferencias'
    }
  },
  {
    path: '/cartas',
    name: 'cards',
    component: CardGalleryView,
    meta: {
      title: 'Galería de Cartas - Lotería Día de Muertos',
      description: 'Galería de todas las cartas SVG del juego'
    }
  },
  {
    path: '/demo',
    name: 'demo',
    component: CardDemoView,
    meta: {
      title: 'Demo de Cartas - Lotería Día de Muertos',
      description: 'Demostración de las cartas SVG'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada (navegación con botones del navegador), usarla
    if (savedPosition) {
      return savedPosition
    }
    
    // Si estamos navegando dentro de la vista del juego, mantener la posición actual
    if (to.name === 'game' && from.name === 'game') {
      return false // No cambiar el scroll
    }
    
    // Para otras navegaciones, ir al top
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Actualizar título de la página
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Verificar si la ruta requiere un juego activo
  if (to.meta.requiresGame) {
    // Aquí se podría verificar si hay un juego activo
    // Por ahora permitimos el acceso
  }

  next()
})

export default router