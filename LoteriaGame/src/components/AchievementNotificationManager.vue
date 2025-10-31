<template>
  <div class="achievement-notification-manager">
    <!-- Notificación actual -->
    <AchievementNotification
      :achievement="currentNotification"
      :visible="showNotification"
      :auto-hide="autoHide"
      :duration="notificationDuration"
      :play-sound="playSound"
      @close="handleNotificationClose"
      @click="handleNotificationClick"
    />
    
    <!-- Indicador de cola (opcional) -->
    <Transition name="queue-indicator">
      <div 
        v-if="showQueueIndicator && queueCount > 0"
        class="queue-indicator"
        @click="showNextNotification"
      >
        <span class="queue-count">+{{ queueCount }}</span>
        <span class="queue-text">más logros</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAchievementsStore } from '@/stores/achievements'
import AchievementNotification from './AchievementNotification.vue'
import type { Achievement } from '@/types'

// ============================================================================
// PROPS
// ============================================================================

interface Props {
  autoHide?: boolean
  notificationDuration?: number
  playSound?: boolean
  showQueueIndicator?: boolean
  maxConcurrentNotifications?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoHide: true,
  notificationDuration: 5000,
  playSound: true,
  showQueueIndicator: true,
  maxConcurrentNotifications: 1
})

// ============================================================================
// STORES
// ============================================================================

const achievementsStore = useAchievementsStore()

// ============================================================================
// ESTADO REACTIVO
// ============================================================================

const currentNotification = ref<Achievement | null>(null)
const showNotification = ref(false)
const processingQueue = ref(false)
const notificationHistory = ref<Achievement[]>([])

// ============================================================================
// COMPUTED
// ============================================================================

const queueCount = computed(() => achievementsStore.notificationQueue.length)

const hasQueuedNotifications = computed(() => queueCount.value > 0)

// ============================================================================
// WATCHERS
// ============================================================================

// Observar cambios en la cola de notificaciones
watch(
  () => achievementsStore.notificationQueue.length,
  (newLength, oldLength) => {
    // Si hay nuevas notificaciones y no estamos mostrando ninguna
    if (newLength > 0 && !showNotification.value && !processingQueue.value) {
      showNextNotification()
    }
  },
  { immediate: true }
)

// ============================================================================
// MÉTODOS
// ============================================================================

/**
 * Muestra la siguiente notificación de la cola
 */
function showNextNotification(): void {
  if (processingQueue.value || showNotification.value) {
    return
  }

  const nextAchievement = achievementsStore.getNextNotification()
  if (!nextAchievement) {
    return
  }

  processingQueue.value = true
  currentNotification.value = nextAchievement
  showNotification.value = true
  
  // Agregar al historial
  notificationHistory.value.unshift(nextAchievement)
  
  // Mantener solo las últimas 20 notificaciones en el historial
  if (notificationHistory.value.length > 20) {
    notificationHistory.value = notificationHistory.value.slice(0, 20)
  }

  console.log(`🏆 Mostrando notificación de logro: ${nextAchievement.name}`)
}

/**
 * Maneja el cierre de una notificación
 */
function handleNotificationClose(): void {
  showNotification.value = false
  
  // Esperar a que termine la animación de salida antes de mostrar la siguiente
  setTimeout(() => {
    currentNotification.value = null
    processingQueue.value = false
    
    // Mostrar la siguiente notificación si hay alguna en cola
    if (hasQueuedNotifications.value) {
      setTimeout(() => {
        showNextNotification()
      }, 500) // Pequeña pausa entre notificaciones
    }
  }, 400) // Duración de la animación de salida
}

/**
 * Maneja el clic en una notificación
 */
function handleNotificationClick(achievement: Achievement): void {
  console.log(`🏆 Clic en logro: ${achievement.name}`)
  
  // Emitir evento personalizado para que otros componentes puedan reaccionar
  const event = new CustomEvent('achievement-clicked', {
    detail: { achievement },
    bubbles: true
  })
  document.dispatchEvent(event)
  
  // Opcional: cerrar la notificación al hacer clic
  handleNotificationClose()
}

/**
 * Limpia todas las notificaciones pendientes
 */
function clearAllNotifications(): void {
  achievementsStore.clearNotifications()
  handleNotificationClose()
}

/**
 * Obtiene el historial de notificaciones mostradas
 */
function getNotificationHistory(): Achievement[] {
  return [...notificationHistory.value]
}

/**
 * Fuerza la muestra de una notificación específica
 */
function showAchievementNotification(achievement: Achievement): void {
  // Agregar a la cola si no está ya presente
  const isAlreadyQueued = achievementsStore.notificationQueue.some(a => a.id === achievement.id)
  if (!isAlreadyQueued) {
    achievementsStore.notificationQueue.push(achievement)
  }
  
  // Mostrar inmediatamente si no hay notificación activa
  if (!showNotification.value) {
    showNextNotification()
  }
}

/**
 * Pausa el procesamiento de notificaciones
 */
function pauseNotifications(): void {
  processingQueue.value = true
}

/**
 * Reanuda el procesamiento de notificaciones
 */
function resumeNotifications(): void {
  processingQueue.value = false
  if (hasQueuedNotifications.value && !showNotification.value) {
    showNextNotification()
  }
}

/**
 * Obtiene estadísticas del manager de notificaciones
 */
function getNotificationStats(): {
  totalShown: number
  currentQueueSize: number
  isProcessing: boolean
  isShowingNotification: boolean
} {
  return {
    totalShown: notificationHistory.value.length,
    currentQueueSize: queueCount.value,
    isProcessing: processingQueue.value,
    isShowingNotification: showNotification.value
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  console.log('🏆 AchievementNotificationManager montado')
  
  // Verificar si hay notificaciones pendientes al montar
  if (hasQueuedNotifications.value) {
    showNextNotification()
  }
})

onUnmounted(() => {
  console.log('🏆 AchievementNotificationManager desmontado')
})

// ============================================================================
// EXPOSE PARA COMPONENTE PADRE
// ============================================================================

defineExpose({
  showNextNotification,
  clearAllNotifications,
  getNotificationHistory,
  showAchievementNotification,
  pauseNotifications,
  resumeNotifications,
  getNotificationStats
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS BASE
   ============================================================================ */

.achievement-notification-manager {
  position: relative;
  z-index: 9999;
}

/* ============================================================================
   INDICADOR DE COLA
   ============================================================================ */

.queue-indicator {
  position: fixed;
  top: 20px;
  right: 440px; /* A la izquierda de la notificación principal */
  background: linear-gradient(135deg, #2D1B69 0%, #1a0f3d 100%);
  border: 1px solid rgba(255, 210, 63, 0.5);
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 9998;
}

.queue-indicator:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  border-color: #FFD23F;
}

.queue-count {
  background: #FFD23F;
  color: #2D1B69;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.queue-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* ============================================================================
   TRANSICIONES
   ============================================================================ */

.queue-indicator-enter-active,
.queue-indicator-leave-active {
  transition: all 0.3s ease;
}

.queue-indicator-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}

.queue-indicator-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 768px) {
  .queue-indicator {
    right: 20px;
    top: 80px; /* Debajo de la notificación principal en móvil */
  }
}

@media (max-width: 480px) {
  .queue-indicator {
    right: 10px;
    top: 90px;
    padding: 6px 12px;
  }
  
  .queue-count {
    font-size: 11px;
    padding: 1px 4px;
  }
  
  .queue-text {
    font-size: 11px;
  }
}

/* ============================================================================
   MODO REDUCIDO DE MOVIMIENTO
   ============================================================================ */

@media (prefers-reduced-motion: reduce) {
  .queue-indicator {
    transition: none !important;
  }
  
  .queue-indicator-enter-active,
  .queue-indicator-leave-active {
    transition: opacity 0.2s ease !important;
  }
  
  .queue-indicator:hover {
    transform: none;
  }
}
</style>