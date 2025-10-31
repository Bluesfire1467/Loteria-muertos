// Composable para integrar el sistema de logros con el juego

import { onMounted, onUnmounted } from 'vue'
import { useAchievementsStore } from '@/stores/achievements'
import { useStatisticsStore } from '@/stores/statistics'
import { useAchievementNotifications } from './useAchievementNotifications'
import type { GameSession, Player } from '@/types'

export function useGameAchievements() {
  // ============================================================================
  // STORES Y COMPOSABLES
  // ============================================================================
  
  const achievementsStore = useAchievementsStore()
  const statisticsStore = useStatisticsStore()
  const notifications = useAchievementNotifications()

  // ============================================================================
  // MÉTODOS PRINCIPALES
  // ============================================================================

  /**
   * Inicializa el sistema de logros para el juego
   */
  async function initializeAchievements(): Promise<void> {
    // Inicializar stores si no están inicializados
    if (!achievementsStore.isInitialized) {
      await achievementsStore.initialize()
    }
    
    // Inicializar notificaciones
    notifications.initialize()
    
    console.log('🏆 Sistema de logros del juego inicializado')
  }

  /**
   * Procesa los logros después de completar una partida
   */
  function processGameAchievements(gameSession: GameSession, humanPlayer: Player): void {
    // Verificar logros específicos del juego
    achievementsStore.onGameCompleted(gameSession, humanPlayer)
    
    // Las estadísticas se actualizarán automáticamente y triggearán los watchers de logros
    console.log('🏆 Logros procesados para la partida completada')
  }

  /**
   * Procesa logros cuando se actualizan las estadísticas
   */
  function processStatisticsAchievements(): void {
    const stats = statisticsStore.userStats
    achievementsStore.onStatisticsUpdated(stats)
    
    console.log('🏆 Logros procesados para estadísticas actualizadas')
  }

  /**
   * Muestra notificaciones para logros recién desbloqueados
   */
  function showNewAchievementNotifications(): void {
    // Las notificaciones se manejan automáticamente a través del store
    // Este método puede usarse para forzar la verificación
    if (achievementsStore.hasNotifications) {
      console.log(`🔔 ${achievementsStore.notificationQueue.length} notificaciones de logros pendientes`)
    }
  }

  /**
   * Verifica logros estacionales (llamar periódicamente)
   */
  function checkSeasonalAchievements(): void {
    achievementsStore.checkSeasonalAchievements()
  }

  /**
   * Obtiene el progreso de logros para mostrar en UI
   */
  function getAchievementProgress(): {
    totalAchievements: number
    unlockedCount: number
    completionPercentage: number
    recentAchievements: number
    nearCompletion: number
  } {
    return {
      totalAchievements: achievementsStore.totalAchievements,
      unlockedCount: achievementsStore.unlockedCount,
      completionPercentage: achievementsStore.completionPercentage,
      recentAchievements: achievementsStore.recentAchievements.length,
      nearCompletion: achievementsStore.nextAchievements.length
    }
  }

  /**
   * Obtiene logros destacados para mostrar en la UI principal
   */
  function getFeaturedAchievements(): {
    recent: typeof achievementsStore.recentAchievements
    next: typeof achievementsStore.nextAchievements
    seasonal: ReturnType<typeof achievementsStore.getAchievementsByCategory>
  } {
    return {
      recent: achievementsStore.recentAchievements,
      next: achievementsStore.nextAchievements,
      seasonal: achievementsStore.getAchievementsByCategory('seasonal')
    }
  }

  /**
   * Verifica si hay logros pendientes de mostrar
   */
  function hasPendingNotifications(): boolean {
    return achievementsStore.hasNotifications
  }

  /**
   * Obtiene estadísticas completas del sistema de logros
   */
  function getAchievementSystemStats(): {
    achievements: ReturnType<typeof achievementsStore.getAchievementStats>
    notifications: ReturnType<typeof notifications.getDetailedStats>
  } {
    return {
      achievements: achievementsStore.getAchievementStats(),
      notifications: notifications.getDetailedStats()
    }
  }

  // ============================================================================
  // EVENTOS Y LISTENERS
  // ============================================================================

  /**
   * Configura listeners para eventos del juego
   */
  function setupGameEventListeners(): void {
    // Listener para cuando se completa una partida
    document.addEventListener('game-completed', (event: any) => {
      const { gameSession, humanPlayer } = event.detail
      if (gameSession && humanPlayer) {
        processGameAchievements(gameSession, humanPlayer)
      }
    })

    // Listener para cuando se actualizan estadísticas
    document.addEventListener('statistics-updated', () => {
      processStatisticsAchievements()
    })

    // Listener para verificaciones periódicas
    document.addEventListener('daily-check', () => {
      checkSeasonalAchievements()
    })

    console.log('🎮 Listeners de eventos de logros configurados')
  }

  /**
   * Limpia los listeners de eventos
   */
  function cleanupGameEventListeners(): void {
    document.removeEventListener('game-completed', processGameAchievements as any)
    document.removeEventListener('statistics-updated', processStatisticsAchievements)
    document.removeEventListener('daily-check', checkSeasonalAchievements)
    
    console.log('🎮 Listeners de eventos de logros limpiados')
  }

  // ============================================================================
  // UTILIDADES DE INTEGRACIÓN
  // ============================================================================

  /**
   * Emite un evento personalizado para completar una partida
   */
  function emitGameCompleted(gameSession: GameSession, humanPlayer: Player): void {
    const event = new CustomEvent('game-completed', {
      detail: { gameSession, humanPlayer },
      bubbles: true
    })
    document.dispatchEvent(event)
  }

  /**
   * Emite un evento personalizado para actualización de estadísticas
   */
  function emitStatisticsUpdated(): void {
    const event = new CustomEvent('statistics-updated', {
      bubbles: true
    })
    document.dispatchEvent(event)
  }

  /**
   * Programa verificaciones periódicas de logros estacionales
   */
  function schedulePeriodicChecks(): void {
    // Verificar logros estacionales cada hora
    const intervalId = setInterval(() => {
      checkSeasonalAchievements()
    }, 60 * 60 * 1000) // 1 hora

    // Limpiar interval al desmontar
    onUnmounted(() => {
      clearInterval(intervalId)
    })

    console.log('⏰ Verificaciones periódicas de logros programadas')
  }

  /**
   * Obtiene recomendaciones de logros para el jugador
   */
  function getAchievementRecommendations(): Array<{
    achievement: ReturnType<typeof achievementsStore.getAchievementById>
    reason: string
    priority: 'high' | 'medium' | 'low'
  }> {
    const recommendations: Array<{
      achievement: ReturnType<typeof achievementsStore.getAchievementById>
      reason: string
      priority: 'high' | 'medium' | 'low'
    }> = []

    // Recomendar logros próximos a completarse
    achievementsStore.nextAchievements.forEach(achievement => {
      const progress = (achievement.progress / achievement.maxProgress) * 100
      if (progress >= 80) {
        recommendations.push({
          achievement,
          reason: `Solo te faltan ${achievement.maxProgress - achievement.progress} más para desbloquearlo`,
          priority: 'high'
        })
      } else if (progress >= 50) {
        recommendations.push({
          achievement,
          reason: `Ya tienes ${Math.round(progress)}% de progreso`,
          priority: 'medium'
        })
      }
    })

    // Recomendar logros estacionales si estamos en la época correcta
    const now = new Date()
    const month = now.getMonth() + 1
    
    if (month === 11) { // Noviembre
      const seasonalAchievements = achievementsStore.getAchievementsByCategory('seasonal')
        .filter(a => !a.isUnlocked && a.id.includes('november'))
      
      seasonalAchievements.forEach(achievement => {
        recommendations.push({
          achievement,
          reason: 'Disponible solo durante noviembre - ¡Día de Muertos!',
          priority: 'high'
        })
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  onMounted(() => {
    initializeAchievements()
    setupGameEventListeners()
    schedulePeriodicChecks()
  })

  onUnmounted(() => {
    cleanupGameEventListeners()
  })

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Inicialización
    initializeAchievements,
    
    // Procesamiento de logros
    processGameAchievements,
    processStatisticsAchievements,
    checkSeasonalAchievements,
    
    // Notificaciones
    showNewAchievementNotifications,
    hasPendingNotifications,
    
    // Información de logros
    getAchievementProgress,
    getFeaturedAchievements,
    getAchievementSystemStats,
    getAchievementRecommendations,
    
    // Eventos
    emitGameCompleted,
    emitStatisticsUpdated,
    
    // Stores (para acceso directo si es necesario)
    achievementsStore,
    notifications
  }
}