// Store de logros para la aplicación de Lotería Día de Muertos

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { 
  Achievement, 
  GameSession,
  Player,
  UserStatistics
} from '@/types'
import { AchievementCategory } from '@/types'
import { loadData, saveData } from '@/utils/storage'
import { useStatisticsStore } from './statistics'

export const useAchievementsStore = defineStore('achievements', () => {
  // ============================================================================
  // ESTADO
  // ============================================================================
  
  const achievements = ref<Achievement[]>([])
  const recentlyUnlocked = ref<Achievement[]>([])
  const notificationQueue = ref<Achievement[]>([])
  const isInitialized = ref(false)

  // ============================================================================
  // DEFINICIÓN DE LOGROS
  // ============================================================================

  const achievementDefinitions: Omit<Achievement, 'progress' | 'isUnlocked' | 'unlockedAt'>[] = [
    // GAMEPLAY ACHIEVEMENTS
    {
      id: 'first_win',
      name: 'Primera Victoria',
      description: 'Gana tu primera partida de lotería',
      icon: '🏆',
      maxProgress: 1,
      category: AchievementCategory.GAMEPLAY
    },
    {
      id: 'win_streak_3',
      name: 'Racha Inicial',
      description: 'Gana 3 partidas consecutivas',
      icon: '🔥',
      maxProgress: 3,
      category: AchievementCategory.GAMEPLAY
    },
    {
      id: 'win_streak_5',
      name: 'Racha de Fuego',
      description: 'Gana 5 partidas consecutivas',
      icon: '🌟',
      maxProgress: 5,
      category: AchievementCategory.GAMEPLAY
    },
    {
      id: 'win_streak_10',
      name: 'Imparable',
      description: 'Gana 10 partidas consecutivas',
      icon: '⚡',
      maxProgress: 10,
      category: AchievementCategory.GAMEPLAY
    },
    {
      id: 'speed_demon',
      name: 'Demonio de la Velocidad',
      description: 'Gana una partida en menos de 2 minutos',
      icon: '💨',
      maxProgress: 1,
      category: AchievementCategory.GAMEPLAY
    },
    {
      id: 'patient_player',
      name: 'Jugador Paciente',
      description: 'Completa una partida que dure más de 15 minutos',
      icon: '🧘',
      maxProgress: 1,
      category: AchievementCategory.GAMEPLAY
    },
    {
      id: 'comeback_king',
      name: 'Rey del Regreso',
      description: 'Gana después de perder 5 partidas seguidas',
      icon: '👑',
      maxProgress: 1,
      category: AchievementCategory.GAMEPLAY
    },

    // MILESTONE ACHIEVEMENTS
    {
      id: 'games_10',
      name: 'Principiante',
      description: 'Juega 10 partidas',
      icon: '🌱',
      maxProgress: 10,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'games_25',
      name: 'Aficionado',
      description: 'Juega 25 partidas',
      icon: '🎯',
      maxProgress: 25,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'games_50',
      name: 'Entusiasta',
      description: 'Juega 50 partidas',
      icon: '🎮',
      maxProgress: 50,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'games_100',
      name: 'Centenario',
      description: 'Juega 100 partidas',
      icon: '💯',
      maxProgress: 100,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'games_250',
      name: 'Veterano',
      description: 'Juega 250 partidas',
      icon: '🏅',
      maxProgress: 250,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'games_500',
      name: 'Maestro',
      description: 'Juega 500 partidas',
      icon: '🎖️',
      maxProgress: 500,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'wins_50',
      name: 'Medio Centenar',
      description: 'Gana 50 partidas',
      icon: '🏆',
      maxProgress: 50,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'wins_100',
      name: 'Centurión',
      description: 'Gana 100 partidas',
      icon: '⭐',
      maxProgress: 100,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'playtime_1h',
      name: 'Primera Hora',
      description: 'Juega durante 1 hora total',
      icon: '⏰',
      maxProgress: 3600, // segundos
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'playtime_10h',
      name: 'Dedicado',
      description: 'Juega durante 10 horas total',
      icon: '⏳',
      maxProgress: 36000, // segundos
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'win_rate_70',
      name: 'Experto',
      description: 'Mantén 70% de victorias con al menos 20 partidas',
      icon: '🎯',
      maxProgress: 1,
      category: AchievementCategory.MILESTONE
    },
    {
      id: 'win_rate_80',
      name: 'Maestro de la Lotería',
      description: 'Mantén 80% de victorias con al menos 50 partidas',
      icon: '🏆',
      maxProgress: 1,
      category: AchievementCategory.MILESTONE
    },

    // SEASONAL ACHIEVEMENTS
    {
      id: 'dia_muertos_2024',
      name: 'Día de Muertos 2024',
      description: 'Juega durante noviembre de 2024',
      icon: '💀',
      maxProgress: 1,
      category: AchievementCategory.SEASONAL
    },
    {
      id: 'dia_muertos_veteran',
      name: 'Veterano del Día de Muertos',
      description: 'Juega durante el Día de Muertos por 3 años consecutivos',
      icon: '🌺',
      maxProgress: 3,
      category: AchievementCategory.SEASONAL
    },
    {
      id: 'november_champion',
      name: 'Campeón de Noviembre',
      description: 'Gana 20 partidas durante noviembre',
      icon: '🏆',
      maxProgress: 20,
      category: AchievementCategory.SEASONAL
    },
    {
      id: 'halloween_spirit',
      name: 'Espíritu de Halloween',
      description: 'Juega el 31 de octubre',
      icon: '🎃',
      maxProgress: 1,
      category: AchievementCategory.SEASONAL
    },
    {
      id: 'new_year_player',
      name: 'Jugador de Año Nuevo',
      description: 'Juega el 1 de enero',
      icon: '🎊',
      maxProgress: 1,
      category: AchievementCategory.SEASONAL
    }
  ]

  // ============================================================================
  // GETTERS COMPUTADOS
  // ============================================================================
  
  const unlockedAchievements = computed(() => 
    achievements.value.filter(a => a.isUnlocked)
  )

  const lockedAchievements = computed(() => 
    achievements.value.filter(a => !a.isUnlocked)
  )

  const achievementsByCategory = computed(() => {
    const categories = {
      [AchievementCategory.GAMEPLAY]: [] as Achievement[],
      [AchievementCategory.MILESTONE]: [] as Achievement[],
      [AchievementCategory.SEASONAL]: [] as Achievement[]
    }
    
    achievements.value.forEach(achievement => {
      categories[achievement.category].push(achievement)
    })
    
    return categories
  })

  const totalAchievements = computed(() => achievements.value.length)
  const unlockedCount = computed(() => unlockedAchievements.value.length)
  const completionPercentage = computed(() => 
    totalAchievements.value > 0 
      ? Math.round((unlockedCount.value / totalAchievements.value) * 100)
      : 0
  )

  const recentAchievements = computed(() => 
    unlockedAchievements.value
      .filter(a => a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 5)
  )

  const nextAchievements = computed(() => 
    lockedAchievements.value
      .filter(a => a.progress > 0)
      .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
      .slice(0, 3)
  )

  const hasNotifications = computed(() => notificationQueue.value.length > 0)

  // ============================================================================
  // WATCHERS PARA VALIDACIÓN AUTOMÁTICA
  // ============================================================================

  // Configurar watchers después de la inicialización
  function setupWatchers() {
    const statisticsStore = useStatisticsStore()

    // Watcher para estadísticas generales
    watch(
      () => statisticsStore.userStats,
      (newStats) => {
        if (isInitialized.value) {
          checkAllAchievements(newStats)
        }
      },
      { deep: true }
    )

    // Watcher para logros estacionales basados en fecha
    watch(
      () => new Date().toDateString(),
      () => {
        if (isInitialized.value) {
          checkSeasonalAchievements()
        }
      }
    )
  }

  // ============================================================================
  // ACCIONES PRINCIPALES
  // ============================================================================

  /**
   * Inicializa el sistema de logros
   */
  async function initialize(): Promise<void> {
    try {
      await loadAchievements()
      initializeAchievements()
      setupWatchers()
      checkSeasonalAchievements()
      isInitialized.value = true
      console.log('🏆 Sistema de logros inicializado')
    } catch (error) {
      console.error('Error al inicializar logros:', error)
    }
  }

  /**
   * Inicializa los logros si no existen
   */
  function initializeAchievements(): void {
    if (achievements.value.length === 0) {
      achievements.value = achievementDefinitions.map(def => ({
        ...def,
        progress: 0,
        isUnlocked: false,
        unlockedAt: undefined
      }))
      saveAchievements()
    } else {
      // Agregar nuevos logros si se han añadido definiciones
      const existingIds = new Set(achievements.value.map(a => a.id))
      const newAchievements = achievementDefinitions
        .filter(def => !existingIds.has(def.id))
        .map(def => ({
          ...def,
          progress: 0,
          isUnlocked: false,
          unlockedAt: undefined
        }))
      
      if (newAchievements.length > 0) {
        achievements.value.push(...newAchievements)
        saveAchievements()
        console.log(`🏆 ${newAchievements.length} nuevos logros añadidos`)
      }
    }
  }

  /**
   * Verifica todos los logros basados en las estadísticas actuales
   */
  function checkAllAchievements(stats: UserStatistics): void {
    checkGameplayAchievements(stats)
    checkMilestoneAchievements(stats)
    checkSeasonalAchievements()
  }

  /**
   * Verifica logros de gameplay
   */
  function checkGameplayAchievements(stats: UserStatistics): void {
    // Primera victoria
    updateAchievementProgress('first_win', stats.wins >= 1 ? 1 : 0)

    // Rachas de victoria
    const currentStreak = Math.max(0, stats.currentWinStreak)
    updateAchievementProgress('win_streak_3', Math.min(currentStreak, 3))
    updateAchievementProgress('win_streak_5', Math.min(currentStreak, 5))
    updateAchievementProgress('win_streak_10', Math.min(currentStreak, 10))

    // Logros especiales que requieren verificación en tiempo real
    // Estos se verificarán cuando se registre el resultado de una partida
  }

  /**
   * Verifica logros de hitos
   */
  function checkMilestoneAchievements(stats: UserStatistics): void {
    // Partidas jugadas
    updateAchievementProgress('games_10', Math.min(stats.totalGames, 10))
    updateAchievementProgress('games_25', Math.min(stats.totalGames, 25))
    updateAchievementProgress('games_50', Math.min(stats.totalGames, 50))
    updateAchievementProgress('games_100', Math.min(stats.totalGames, 100))
    updateAchievementProgress('games_250', Math.min(stats.totalGames, 250))
    updateAchievementProgress('games_500', Math.min(stats.totalGames, 500))

    // Victorias
    updateAchievementProgress('wins_50', Math.min(stats.wins, 50))
    updateAchievementProgress('wins_100', Math.min(stats.wins, 100))

    // Tiempo de juego
    updateAchievementProgress('playtime_1h', Math.min(stats.totalPlayTime, 3600))
    updateAchievementProgress('playtime_10h', Math.min(stats.totalPlayTime, 36000))

    // Porcentaje de victorias
    const hasEnoughGamesFor70 = stats.totalGames >= 20 && stats.winPercentage >= 70
    updateAchievementProgress('win_rate_70', hasEnoughGamesFor70 ? 1 : 0)

    const hasEnoughGamesFor80 = stats.totalGames >= 50 && stats.winPercentage >= 80
    updateAchievementProgress('win_rate_80', hasEnoughGamesFor80 ? 1 : 0)
  }

  /**
   * Verifica logros estacionales
   */
  function checkSeasonalAchievements(): void {
    const now = new Date()
    const month = now.getMonth() + 1 // 1-12
    const day = now.getDate()
    const year = now.getFullYear()

    // Día de Muertos (noviembre)
    if (month === 11) {
      updateAchievementProgress('dia_muertos_2024', 1)
      
      // Verificar si ya se jugó en noviembre para el logro de campeón
      const statisticsStore = useStatisticsStore()
      const currentMonthKey = `${year}-11`
      const novemberStats = statisticsStore.userStats.monthlyStats[currentMonthKey]
      if (novemberStats && novemberStats.wins > 0) {
        updateAchievementProgress('november_champion', Math.min(novemberStats.wins, 20))
      }
    }

    // Halloween (31 de octubre)
    if (month === 10 && day === 31) {
      updateAchievementProgress('halloween_spirit', 1)
    }

    // Año Nuevo (1 de enero)
    if (month === 1 && day === 1) {
      updateAchievementProgress('new_year_player', 1)
    }
  }

  /**
   * Verifica logros específicos después de una partida
   */
  function checkGameSpecificAchievements(gameSession: GameSession, _humanPlayer: Player, wasWin: boolean): void {
    const gameDuration = gameSession.duration || 0

    // Demonio de la velocidad (menos de 2 minutos)
    if (wasWin && gameDuration < 120) {
      updateAchievementProgress('speed_demon', 1)
    }

    // Jugador paciente (más de 15 minutos)
    if (gameDuration > 900) {
      updateAchievementProgress('patient_player', 1)
    }

    // Rey del regreso (ganar después de perder 5 seguidas)
    const statisticsStore = useStatisticsStore()
    const prevStreak = statisticsStore.userStats.currentWinStreak
    if (wasWin && prevStreak <= -5) {
      updateAchievementProgress('comeback_king', 1)
    }

    // Verificar logros estacionales relacionados con partidas
    const now = new Date()
    if (now.getMonth() + 1 === 11 && wasWin) {
      // Incrementar progreso del campeón de noviembre
      const achievement = achievements.value.find(a => a.id === 'november_champion')
      if (achievement && !achievement.isUnlocked) {
        updateAchievementProgress('november_champion', Math.min(achievement.progress + 1, 20))
      }
    }
  }

  /**
   * Actualiza el progreso de un logro específico
   */
  function updateAchievementProgress(achievementId: string, newProgress: number): void {
    const achievement = achievements.value.find(a => a.id === achievementId)
    if (!achievement) return

    const oldProgress = achievement.progress
    achievement.progress = Math.min(newProgress, achievement.maxProgress)

    // Verificar si se desbloqueó
    if (!achievement.isUnlocked && achievement.progress >= achievement.maxProgress) {
      unlockAchievement(achievement)
    }

    // Guardar si hubo cambios
    if (oldProgress !== achievement.progress) {
      saveAchievements()
    }
  }

  /**
   * Desbloquea un logro
   */
  function unlockAchievement(achievement: Achievement): void {
    if (achievement.isUnlocked) return

    achievement.isUnlocked = true
    achievement.unlockedAt = new Date()
    
    // Añadir a la cola de notificaciones
    notificationQueue.value.push({ ...achievement })
    recentlyUnlocked.value.unshift({ ...achievement })
    
    // Mantener solo los 10 más recientes
    if (recentlyUnlocked.value.length > 10) {
      recentlyUnlocked.value = recentlyUnlocked.value.slice(0, 10)
    }

    saveAchievements()
    console.log(`🏆 ¡Logro desbloqueado! ${achievement.name}: ${achievement.description}`)
  }

  /**
   * Obtiene la siguiente notificación de la cola
   */
  function getNextNotification(): Achievement | null {
    return notificationQueue.value.shift() || null
  }

  /**
   * Limpia todas las notificaciones
   */
  function clearNotifications(): void {
    notificationQueue.value = []
  }

  /**
   * Obtiene un logro por ID
   */
  function getAchievementById(id: string): Achievement | undefined {
    return achievements.value.find(a => a.id === id)
  }

  /**
   * Obtiene logros por categoría
   */
  function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return achievements.value.filter(a => a.category === category)
  }

  /**
   * Obtiene estadísticas de logros
   */
  function getAchievementStats(): {
    total: number
    unlocked: number
    locked: number
    completionPercentage: number
    byCategory: Record<AchievementCategory, { total: number; unlocked: number }>
  } {
    const byCategory = {
      [AchievementCategory.GAMEPLAY]: { total: 0, unlocked: 0 },
      [AchievementCategory.MILESTONE]: { total: 0, unlocked: 0 },
      [AchievementCategory.SEASONAL]: { total: 0, unlocked: 0 }
    }

    achievements.value.forEach(achievement => {
      byCategory[achievement.category].total++
      if (achievement.isUnlocked) {
        byCategory[achievement.category].unlocked++
      }
    })

    return {
      total: totalAchievements.value,
      unlocked: unlockedCount.value,
      locked: lockedAchievements.value.length,
      completionPercentage: completionPercentage.value,
      byCategory
    }
  }

  /**
   * Reinicia todos los logros (para testing o reset completo)
   */
  function resetAllAchievements(): void {
    achievements.value.forEach(achievement => {
      achievement.progress = 0
      achievement.isUnlocked = false
      achievement.unlockedAt = undefined
    })
    
    recentlyUnlocked.value = []
    notificationQueue.value = []
    
    saveAchievements()
    console.log('🏆 Todos los logros han sido reiniciados')
  }

  /**
   * Carga los logros desde localStorage
   */
  async function loadAchievements(): Promise<void> {
    try {
      const saved = await loadData('achievements' as any) as Achievement[] | null
      if (saved && Array.isArray(saved)) {
        // Convertir fechas de string a Date
        saved.forEach(achievement => {
          if (achievement.unlockedAt) {
            achievement.unlockedAt = new Date(achievement.unlockedAt)
          }
        })
        achievements.value = saved
        console.log('🏆 Logros cargados desde localStorage')
      }
    } catch (error) {
      console.error('Error al cargar logros:', error)
    }
  }

  /**
   * Guarda los logros en localStorage
   */
  async function saveAchievements(): Promise<void> {
    try {
      await saveData('achievements' as any, achievements.value)
      console.log('🏆 Logros guardados en localStorage')
    } catch (error) {
      console.error('Error al guardar logros:', error)
    }
  }

  /**
   * Exporta los logros para respaldo
   */
  function exportAchievements(): string {
    return JSON.stringify({
      achievements: achievements.value,
      recentlyUnlocked: recentlyUnlocked.value,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }, null, 2)
  }

  /**
   * Importa logros desde un respaldo
   */
  function importAchievements(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      
      if (!parsed.achievements || !Array.isArray(parsed.achievements)) {
        throw new Error('Formato de datos inválido')
      }

      // Convertir fechas
      parsed.achievements.forEach((achievement: any) => {
        if (achievement.unlockedAt) {
          achievement.unlockedAt = new Date(achievement.unlockedAt)
        }
      })
      
      if (parsed.recentlyUnlocked) {
        parsed.recentlyUnlocked.forEach((achievement: any) => {
          if (achievement.unlockedAt) {
            achievement.unlockedAt = new Date(achievement.unlockedAt)
          }
        })
        recentlyUnlocked.value = parsed.recentlyUnlocked
      }
      
      // Restaurar datos
      achievements.value = parsed.achievements
      saveAchievements()
      
      console.log('🏆 Logros importados correctamente')
      return true
    } catch (error) {
      console.error('Error al importar logros:', error)
      return false
    }
  }

  // ============================================================================
  // INTEGRACIÓN CON SISTEMA DE JUEGO
  // ============================================================================

  /**
   * Función principal para verificar logros después de una partida
   */
  function onGameCompleted(gameSession: GameSession, humanPlayer: Player): void {
    if (!isInitialized.value) return

    const wasWin = humanPlayer.isWinner
    checkGameSpecificAchievements(gameSession, humanPlayer, wasWin)
    
    // Las estadísticas se actualizarán automáticamente y triggearán los watchers
    console.log('🏆 Verificación de logros completada para la partida')
  }

  /**
   * Función para verificar logros cuando cambian las estadísticas
   */
  function onStatisticsUpdated(stats: UserStatistics): void {
    if (!isInitialized.value) return
    checkAllAchievements(stats)
  }

  // ============================================================================
  // RETURN STORE
  // ============================================================================

  return {
    // Estado
    achievements,
    recentlyUnlocked,
    notificationQueue,
    isInitialized,
    
    // Getters
    unlockedAchievements,
    lockedAchievements,
    achievementsByCategory,
    totalAchievements,
    unlockedCount,
    completionPercentage,
    recentAchievements,
    nextAchievements,
    hasNotifications,
    
    // Acciones principales
    initialize,
    onGameCompleted,
    onStatisticsUpdated,
    
    // Gestión de notificaciones
    getNextNotification,
    clearNotifications,
    
    // Consultas
    getAchievementById,
    getAchievementsByCategory,
    getAchievementStats,
    
    // Gestión de datos
    loadAchievements,
    saveAchievements,
    exportAchievements,
    importAchievements,
    resetAllAchievements,
    
    // Utilidades internas (para testing)
    updateAchievementProgress,
    checkAllAchievements,
    checkSeasonalAchievements
  }
})