// Composable para gestionar notificaciones de logros

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAchievementsStore } from '@/stores/achievements'
import type { Achievement } from '@/types'

export interface NotificationSettings {
  enabled: boolean
  playSound: boolean
  autoHide: boolean
  duration: number
  showQueueIndicator: boolean
}

export interface NotificationEvent {
  type: 'shown' | 'clicked' | 'closed' | 'queued'
  achievement: Achievement
  timestamp: Date
}

export function useAchievementNotifications() {
  // ============================================================================
  // STORES
  // ============================================================================
  
  const achievementsStore = useAchievementsStore()

  // ============================================================================
  // ESTADO REACTIVO
  // ============================================================================
  
  const settings = ref<NotificationSettings>({
    enabled: true,
    playSound: true,
    autoHide: true,
    duration: 5000,
    showQueueIndicator: true
  })

  const eventHistory = ref<NotificationEvent[]>([])
  const isInitialized = ref(false)

  // ============================================================================
  // COMPUTED
  // ============================================================================
  
  const hasQueuedNotifications = computed(() => 
    achievementsStore.hasNotifications
  )

  const queueCount = computed(() => 
    achievementsStore.notificationQueue.length
  )

  const recentEvents = computed(() => 
    eventHistory.value.slice(0, 10)
  )

  const notificationStats = computed(() => ({
    totalShown: eventHistory.value.filter(e => e.type === 'shown').length,
    totalClicked: eventHistory.value.filter(e => e.type === 'clicked').length,
    totalClosed: eventHistory.value.filter(e => e.type === 'closed').length,
    currentQueue: queueCount.value,
    lastShown: eventHistory.value.find(e => e.type === 'shown')?.timestamp
  }))

  // ============================================================================
  // MÉTODOS PRINCIPALES
  // ============================================================================

  /**
   * Inicializa el sistema de notificaciones
   */
  function initialize(): void {
    if (isInitialized.value) return

    // Cargar configuración guardada
    loadSettings()
    
    // Configurar listeners de eventos
    setupEventListeners()
    
    isInitialized.value = true
    console.log('🔔 Sistema de notificaciones de logros inicializado')
  }

  /**
   * Muestra una notificación para un logro específico
   */
  function showNotification(achievement: Achievement): void {
    if (!settings.value.enabled) {
      console.log('🔕 Notificaciones deshabilitadas, omitiendo logro:', achievement.name)
      return
    }

    // Registrar evento
    recordEvent('queued', achievement)

    // Agregar a la cola del store si no está ya presente
    const isAlreadyQueued = achievementsStore.notificationQueue.some(a => a.id === achievement.id)
    if (!isAlreadyQueued) {
      achievementsStore.notificationQueue.push(achievement)
      console.log(`🔔 Logro añadido a la cola de notificaciones: ${achievement.name}`)
    }

    // Emitir evento personalizado para que el manager lo procese
    emitNotificationEvent('achievement-queued', achievement)
  }

  /**
   * Registra que una notificación fue mostrada
   */
  function onNotificationShown(achievement: Achievement): void {
    recordEvent('shown', achievement)
    console.log(`🔔 Notificación mostrada: ${achievement.name}`)
  }

  /**
   * Registra que una notificación fue clickeada
   */
  function onNotificationClicked(achievement: Achievement): void {
    recordEvent('clicked', achievement)
    console.log(`🔔 Notificación clickeada: ${achievement.name}`)
  }

  /**
   * Registra que una notificación fue cerrada
   */
  function onNotificationClosed(achievement: Achievement): void {
    recordEvent('closed', achievement)
    console.log(`🔔 Notificación cerrada: ${achievement.name}`)
  }

  /**
   * Limpia todas las notificaciones pendientes
   */
  function clearAllNotifications(): void {
    achievementsStore.clearNotifications()
    console.log('🔔 Todas las notificaciones han sido limpiadas')
  }

  /**
   * Pausa las notificaciones temporalmente
   */
  function pauseNotifications(): void {
    settings.value.enabled = false
    emitNotificationEvent('notifications-paused')
    console.log('⏸️ Notificaciones pausadas')
  }

  /**
   * Reanuda las notificaciones
   */
  function resumeNotifications(): void {
    settings.value.enabled = true
    emitNotificationEvent('notifications-resumed')
    console.log('▶️ Notificaciones reanudadas')
  }

  // ============================================================================
  // CONFIGURACIÓN
  // ============================================================================

  /**
   * Actualiza la configuración de notificaciones
   */
  function updateSettings(newSettings: Partial<NotificationSettings>): void {
    Object.assign(settings.value, newSettings)
    saveSettings()
    emitNotificationEvent('settings-updated', null, { settings: settings.value })
    console.log('⚙️ Configuración de notificaciones actualizada')
  }

  /**
   * Restaura la configuración por defecto
   */
  function resetSettings(): void {
    settings.value = {
      enabled: true,
      playSound: true,
      autoHide: true,
      duration: 5000,
      showQueueIndicator: true
    }
    saveSettings()
    console.log('🔄 Configuración de notificaciones restaurada')
  }

  /**
   * Obtiene la configuración actual
   */
  function getSettings(): NotificationSettings {
    return { ...settings.value }
  }

  // ============================================================================
  // GESTIÓN DE EVENTOS
  // ============================================================================

  /**
   * Registra un evento en el historial
   */
  function recordEvent(type: NotificationEvent['type'], achievement: Achievement): void {
    const event: NotificationEvent = {
      type,
      achievement,
      timestamp: new Date()
    }

    eventHistory.value.unshift(event)

    // Mantener solo los últimos 100 eventos
    if (eventHistory.value.length > 100) {
      eventHistory.value = eventHistory.value.slice(0, 100)
    }
  }

  /**
   * Emite un evento personalizado del DOM
   */
  function emitNotificationEvent(eventName: string, achievement?: Achievement | null, data?: any): void {
    const event = new CustomEvent(eventName, {
      detail: {
        achievement,
        timestamp: new Date(),
        ...data
      },
      bubbles: true
    })
    document.dispatchEvent(event)
  }

  /**
   * Configura los listeners de eventos del DOM
   */
  function setupEventListeners(): void {
    // Listener para cuando se muestra una notificación
    document.addEventListener('achievement-notification-shown', (event: any) => {
      if (event.detail?.achievement) {
        onNotificationShown(event.detail.achievement)
      }
    })

    // Listener para cuando se hace clic en una notificación
    document.addEventListener('achievement-clicked', (event: any) => {
      if (event.detail?.achievement) {
        onNotificationClicked(event.detail.achievement)
      }
    })

    // Listener para cuando se cierra una notificación
    document.addEventListener('achievement-notification-closed', (event: any) => {
      if (event.detail?.achievement) {
        onNotificationClosed(event.detail.achievement)
      }
    })
  }

  /**
   * Limpia los listeners de eventos
   */
  function cleanupEventListeners(): void {
    document.removeEventListener('achievement-notification-shown', onNotificationShown as any)
    document.removeEventListener('achievement-clicked', onNotificationClicked as any)
    document.removeEventListener('achievement-notification-closed', onNotificationClosed as any)
  }

  // ============================================================================
  // PERSISTENCIA
  // ============================================================================

  /**
   * Guarda la configuración en localStorage
   */
  function saveSettings(): void {
    try {
      localStorage.setItem('achievement-notification-settings', JSON.stringify(settings.value))
    } catch (error) {
      console.warn('No se pudo guardar la configuración de notificaciones:', error)
    }
  }

  /**
   * Carga la configuración desde localStorage
   */
  function loadSettings(): void {
    try {
      const saved = localStorage.getItem('achievement-notification-settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.assign(settings.value, parsed)
      }
    } catch (error) {
      console.warn('No se pudo cargar la configuración de notificaciones:', error)
    }
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  /**
   * Obtiene estadísticas detalladas
   */
  function getDetailedStats(): {
    settings: NotificationSettings
    stats: typeof notificationStats.value
    recentEvents: NotificationEvent[]
    queueStatus: {
      count: number
      hasNotifications: boolean
    }
  } {
    return {
      settings: getSettings(),
      stats: notificationStats.value,
      recentEvents: recentEvents.value,
      queueStatus: {
        count: queueCount.value,
        hasNotifications: hasQueuedNotifications.value
      }
    }
  }

  /**
   * Exporta el historial de eventos
   */
  function exportEventHistory(): string {
    return JSON.stringify({
      events: eventHistory.value,
      settings: settings.value,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }, null, 2)
  }

  /**
   * Limpia el historial de eventos
   */
  function clearEventHistory(): void {
    eventHistory.value = []
    console.log('🗑️ Historial de eventos de notificaciones limpiado')
  }

  /**
   * Verifica si una notificación debe mostrarse
   */
  function shouldShowNotification(achievement: Achievement): boolean {
    if (!settings.value.enabled) return false
    
    // Verificar si ya se mostró recientemente (últimos 5 minutos)
    const recentShown = eventHistory.value.find(
      event => event.type === 'shown' && 
               event.achievement.id === achievement.id &&
               (Date.now() - event.timestamp.getTime()) < 300000 // 5 minutos
    )
    
    return !recentShown
  }

  /**
   * Obtiene recomendaciones de configuración basadas en el uso
   */
  function getSettingsRecommendations(): Array<{
    setting: keyof NotificationSettings
    currentValue: any
    recommendedValue: any
    reason: string
  }> {
    const recommendations: Array<{
      setting: keyof NotificationSettings
      currentValue: any
      recommendedValue: any
      reason: string
    }> = []

    const stats = notificationStats.value
    
    // Si el usuario cierra muchas notificaciones, sugerir duración más corta
    if (stats.totalClosed > stats.totalShown * 0.8 && settings.value.duration > 3000) {
      recommendations.push({
        setting: 'duration',
        currentValue: settings.value.duration,
        recommendedValue: 3000,
        reason: 'Cierras muchas notificaciones manualmente, una duración más corta podría ser mejor'
      })
    }

    // Si nunca hace clic en notificaciones, sugerir desactivar sonido
    if (stats.totalShown > 10 && stats.totalClicked === 0 && settings.value.playSound) {
      recommendations.push({
        setting: 'playSound',
        currentValue: settings.value.playSound,
        recommendedValue: false,
        reason: 'No interactúas con las notificaciones, podrías desactivar el sonido'
      })
    }

    return recommendations
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    cleanupEventListeners()
  })

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Estado
    settings,
    eventHistory,
    isInitialized,

    // Computed
    hasQueuedNotifications,
    queueCount,
    recentEvents,
    notificationStats,

    // Métodos principales
    initialize,
    showNotification,
    clearAllNotifications,
    pauseNotifications,
    resumeNotifications,

    // Eventos
    onNotificationShown,
    onNotificationClicked,
    onNotificationClosed,

    // Configuración
    updateSettings,
    resetSettings,
    getSettings,

    // Utilidades
    getDetailedStats,
    exportEventHistory,
    clearEventHistory,
    shouldShowNotification,
    getSettingsRecommendations
  }
}