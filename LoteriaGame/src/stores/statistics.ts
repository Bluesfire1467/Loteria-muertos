// Store de estadísticas para la aplicación de Lotería Día de Muertos

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  UserStatistics, 
  MonthlyStats, 
  GameSession,
  Player
} from '@/types'
import { loadData, saveData } from '@/utils/storage'

export const useStatisticsStore = defineStore('statistics', () => {
  // ============================================================================
  // ESTADO
  // ============================================================================
  
  const userStats = ref<UserStatistics>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    winPercentage: 0,
    averageGameTime: 0,
    longestWinStreak: 0,
    currentWinStreak: 0,
    totalPlayTime: 0,
    monthlyStats: {},
    lastUpdated: new Date()
  })

  const currentSessionStats = ref({
    gamesThisSession: 0,
    winsThisSession: 0,
    sessionStartTime: new Date()
  })

  // ============================================================================
  // GETTERS COMPUTADOS
  // ============================================================================
  
  const winRate = computed(() => {
    if (userStats.value.totalGames === 0) return 0
    return Math.round((userStats.value.wins / userStats.value.totalGames) * 100)
  })

  const lossRate = computed(() => {
    if (userStats.value.totalGames === 0) return 0
    return Math.round((userStats.value.losses / userStats.value.totalGames) * 100)
  })

  const averageGameTimeFormatted = computed(() => {
    return formatTime(userStats.value.averageGameTime)
  })

  const totalPlayTimeFormatted = computed(() => {
    return formatPlayTime(userStats.value.totalPlayTime)
  })

  const currentMonthStats = computed(() => {
    const currentMonth = getCurrentMonthKey()
    return userStats.value.monthlyStats[currentMonth] || createEmptyMonthlyStats(currentMonth)
  })

  const recentMonthsStats = computed(() => {
    const months = getRecentMonthKeys(6) // Últimos 6 meses
    return months.map(monthKey => ({
      monthKey,
      stats: userStats.value.monthlyStats[monthKey] || createEmptyMonthlyStats(monthKey)
    }))
  })

  const isOnWinStreak = computed(() => userStats.value.currentWinStreak > 0)
  const isOnLossStreak = computed(() => userStats.value.currentWinStreak < 0)

  const performanceRating = computed(() => {
    const winRate = userStats.value.winPercentage
    if (winRate >= 80) return { rating: 'Excelente', color: 'success', icon: '🏆' }
    if (winRate >= 65) return { rating: 'Muy Bueno', color: 'good', icon: '⭐' }
    if (winRate >= 50) return { rating: 'Bueno', color: 'average', icon: '👍' }
    if (winRate >= 35) return { rating: 'Regular', color: 'below', icon: '📈' }
    return { rating: 'Principiante', color: 'beginner', icon: '🌱' }
  })

  // ============================================================================
  // ACCIONES
  // ============================================================================

  /**
   * Registra el resultado de una partida
   */
  function recordGameResult(gameSession: GameSession, humanPlayer: Player): void {
    const isWin = humanPlayer.isWinner
    const gameDuration = gameSession.duration || 0
    const currentMonth = getCurrentMonthKey()

    // Validar duración del juego (debe ser mayor a 0)
    if (gameDuration <= 0) {
      console.warn('⚠️ Duración de juego inválida, usando tiempo mínimo de 30 segundos')
      gameSession.duration = 30
    }

    // Actualizar estadísticas generales
    userStats.value.totalGames++
    userStats.value.totalPlayTime += gameDuration

    if (isWin) {
      userStats.value.wins++
      userStats.value.currentWinStreak = Math.max(0, userStats.value.currentWinStreak) + 1
      userStats.value.longestWinStreak = Math.max(
        userStats.value.longestWinStreak, 
        userStats.value.currentWinStreak
      )
    } else {
      userStats.value.losses++
      userStats.value.currentWinStreak = Math.min(0, userStats.value.currentWinStreak) - 1
    }

    // Recalcular porcentaje de victoria
    userStats.value.winPercentage = Math.round((userStats.value.wins / userStats.value.totalGames) * 100)

    // Recalcular tiempo promedio de juego
    userStats.value.averageGameTime = Math.round(userStats.value.totalPlayTime / userStats.value.totalGames)

    // Actualizar estadísticas mensuales
    updateMonthlyStats(currentMonth, isWin, gameDuration)

    // Actualizar estadísticas de sesión
    currentSessionStats.value.gamesThisSession++
    if (isWin) {
      currentSessionStats.value.winsThisSession++
    }

    // Actualizar timestamp
    userStats.value.lastUpdated = new Date()

    // Guardar en localStorage
    saveStatistics()

    console.log(`📊 Estadísticas actualizadas: ${isWin ? 'Victoria' : 'Derrota'} - Duración: ${formatTime(gameDuration)} - Racha: ${userStats.value.currentWinStreak}`)
  }

  /**
   * Actualiza las estadísticas mensuales
   */
  function updateMonthlyStats(monthKey: string, isWin: boolean, gameDuration: number): void {
    if (!userStats.value.monthlyStats[monthKey]) {
      userStats.value.monthlyStats[monthKey] = createEmptyMonthlyStats(monthKey)
    }

    const monthStats = userStats.value.monthlyStats[monthKey]
    monthStats.gamesPlayed++
    monthStats.averageGameTime = Math.round(
      ((monthStats.averageGameTime * (monthStats.gamesPlayed - 1)) + gameDuration) / monthStats.gamesPlayed
    )

    if (isWin) {
      monthStats.wins++
    } else {
      monthStats.losses++
    }

    monthStats.winPercentage = Math.round((monthStats.wins / monthStats.gamesPlayed) * 100)
  }

  /**
   * Obtiene estadísticas de rendimiento reciente
   */
  function getRecentPerformance(gameCount: number = 10): {
    recentWinRate: number
    trend: 'improving' | 'declining' | 'stable'
    recentGames: number
  } {
    // En una implementación real, esto vendría de un historial de partidas
    // Por ahora, simulamos basándonos en las estadísticas actuales
    const recentWinRate = Math.max(0, Math.min(100, 
      userStats.value.winPercentage + (Math.random() - 0.5) * 20
    ))
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    const difference = recentWinRate - userStats.value.winPercentage
    
    if (difference > 5) trend = 'improving'
    else if (difference < -5) trend = 'declining'

    return {
      recentWinRate: Math.round(recentWinRate),
      trend,
      recentGames: Math.min(gameCount, userStats.value.totalGames)
    }
  }

  /**
   * Obtiene estadísticas comparativas
   */
  function getComparativeStats(): {
    vsAveragePlayer: number
    ranking: string
    percentile: number
  } {
    // Simulación de datos comparativos
    const averageWinRate = 45 // Promedio simulado
    const vsAverage = userStats.value.winPercentage - averageWinRate
    
    let ranking = 'Principiante'
    let percentile = 50
    
    if (userStats.value.winPercentage >= 75) {
      ranking = 'Experto'
      percentile = 90
    } else if (userStats.value.winPercentage >= 60) {
      ranking = 'Avanzado'
      percentile = 75
    } else if (userStats.value.winPercentage >= 45) {
      ranking = 'Intermedio'
      percentile = 60
    }

    return {
      vsAveragePlayer: Math.round(vsAverage),
      ranking,
      percentile
    }
  }

  /**
   * Obtiene logros relacionados con estadísticas
   */
  function getStatisticsAchievements(): Array<{
    id: string
    name: string
    description: string
    progress: number
    maxProgress: number
    isUnlocked: boolean
  }> {
    return [
      {
        id: 'games_10',
        name: 'Principiante',
        description: 'Juega 10 partidas',
        progress: Math.min(userStats.value.totalGames, 10),
        maxProgress: 10,
        isUnlocked: userStats.value.totalGames >= 10
      },
      {
        id: 'games_50',
        name: 'Aficionado',
        description: 'Juega 50 partidas',
        progress: Math.min(userStats.value.totalGames, 50),
        maxProgress: 50,
        isUnlocked: userStats.value.totalGames >= 50
      },
      {
        id: 'games_100',
        name: 'Centenario',
        description: 'Juega 100 partidas',
        progress: Math.min(userStats.value.totalGames, 100),
        maxProgress: 100,
        isUnlocked: userStats.value.totalGames >= 100
      },
      {
        id: 'win_streak_5',
        name: 'Racha de Fuego',
        description: 'Gana 5 partidas consecutivas',
        progress: Math.min(Math.max(userStats.value.longestWinStreak, 0), 5),
        maxProgress: 5,
        isUnlocked: userStats.value.longestWinStreak >= 5
      },
      {
        id: 'win_rate_70',
        name: 'Maestro de la Lotería',
        description: 'Mantén 70% de victorias con al menos 20 partidas',
        progress: userStats.value.totalGames >= 20 && userStats.value.winPercentage >= 70 ? 1 : 0,
        maxProgress: 1,
        isUnlocked: userStats.value.totalGames >= 20 && userStats.value.winPercentage >= 70
      }
    ]
  }

  /**
   * Reinicia todas las estadísticas
   */
  function resetAllStatistics(): void {
    userStats.value = {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      averageGameTime: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      totalPlayTime: 0,
      monthlyStats: {},
      lastUpdated: new Date()
    }

    currentSessionStats.value = {
      gamesThisSession: 0,
      winsThisSession: 0,
      sessionStartTime: new Date()
    }

    saveStatistics()
    console.log('📊 Todas las estadísticas han sido reiniciadas')
  }

  /**
   * Carga las estadísticas desde localStorage
   */
  async function loadStatistics(): Promise<void> {
    try {
      const saved = await loadData('statistics' as any) as UserStatistics | null
      if (saved) {
        // Convertir fechas de string a Date
        if (saved.lastUpdated) {
          saved.lastUpdated = new Date(saved.lastUpdated)
        }
        Object.assign(userStats.value, saved)
        console.log('📊 Estadísticas cargadas desde localStorage')
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  /**
   * Guarda las estadísticas en localStorage
   */
  async function saveStatistics(): Promise<void> {
    try {
      await saveData('statistics' as any, userStats.value)
      console.log('📊 Estadísticas guardadas en localStorage')
    } catch (error) {
      console.error('Error al guardar estadísticas:', error)
    }
  }

  /**
   * Exporta las estadísticas para respaldo
   */
  function exportStatistics(): string {
    return JSON.stringify({
      userStats: userStats.value,
      sessionStats: currentSessionStats.value,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }, null, 2)
  }

  /**
   * Importa estadísticas desde un respaldo
   */
  function importStatistics(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      
      if (!parsed.userStats || !parsed.version) {
        throw new Error('Formato de datos inválido')
      }

      // Convertir fechas
      parsed.userStats.lastUpdated = new Date(parsed.userStats.lastUpdated)
      
      // Restaurar datos
      Object.assign(userStats.value, parsed.userStats)
      saveStatistics()
      
      console.log('📊 Estadísticas importadas correctamente')
      return true
    } catch (error) {
      console.error('Error al importar estadísticas:', error)
      return false
    }
  }

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  /**
   * Obtiene la clave del mes actual
   */
  function getCurrentMonthKey(): string {
    const now = new Date()
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
  }

  /**
   * Obtiene las claves de los meses recientes
   */
  function getRecentMonthKeys(count: number): string[] {
    const keys: string[] = []
    const now = new Date()
    
    for (let i = 0; i < count; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      keys.push(key)
    }
    
    return keys
  }

  /**
   * Crea estadísticas mensuales vacías
   */
  function createEmptyMonthlyStats(monthKey: string): MonthlyStats {
    const [year, month] = monthKey.split('-').map(Number)
    return {
      month: new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'long' }),
      year,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      averageGameTime: 0
    }
  }

  /**
   * Formatea tiempo en formato mm:ss
   */
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Formatea tiempo de juego total
   */
  function formatPlayTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else {
      return `${seconds}s`
    }
  }

  /**
   * Calcula tendencia de rendimiento
   */
  function calculatePerformanceTrend(): {
    direction: 'up' | 'down' | 'stable'
    percentage: number
    description: string
  } {
    const recentPerf = getRecentPerformance()
    const difference = recentPerf.recentWinRate - userStats.value.winPercentage
    
    let direction: 'up' | 'down' | 'stable' = 'stable'
    let description = 'Rendimiento estable'
    
    if (Math.abs(difference) < 3) {
      direction = 'stable'
      description = 'Rendimiento consistente'
    } else if (difference > 0) {
      direction = 'up'
      description = `Mejorando ${Math.abs(difference)}% recientemente`
    } else {
      direction = 'down'
      description = `Bajando ${Math.abs(difference)}% recientemente`
    }

    return {
      direction,
      percentage: Math.abs(difference),
      description
    }
  }

  /**
   * Obtiene estadísticas de la sesión actual
   */
  function getSessionStatistics(): {
    duration: number
    gamesPlayed: number
    wins: number
    sessionWinRate: number
  } {
    const sessionDuration = Math.floor((Date.now() - currentSessionStats.value.sessionStartTime.getTime()) / 1000)
    const sessionWinRate = currentSessionStats.value.gamesThisSession > 0 
      ? Math.round((currentSessionStats.value.winsThisSession / currentSessionStats.value.gamesThisSession) * 100)
      : 0

    return {
      duration: sessionDuration,
      gamesPlayed: currentSessionStats.value.gamesThisSession,
      wins: currentSessionStats.value.winsThisSession,
      sessionWinRate
    }
  }

  /**
   * Reinicia las estadísticas de la sesión actual
   */
  function resetSessionStats(): void {
    currentSessionStats.value = {
      gamesThisSession: 0,
      winsThisSession: 0,
      sessionStartTime: new Date()
    }
  }

  /**
   * Registra el inicio de una nueva partida
   */
  function recordGameStart(): void {
    console.log('⏱️ Nueva partida iniciada - cronómetro activado')
  }

  /**
   * Registra el tiempo de una partida específica
   */
  function recordGameTime(duration: number): void {
    if (duration > 0) {
      console.log(`⏱️ Tiempo de partida registrado: ${formatTime(duration)}`)
      // El tiempo se registrará oficialmente cuando se llame a recordGameResult
    }
  }

  /**
   * Obtiene estadísticas de tiempo detalladas
   */
  function getTimeStatistics(): {
    totalPlayTime: number
    averageGameTime: number
    totalGames: number
    formattedTotalTime: string
    formattedAverageTime: string
    estimatedHoursPlayed: number
    gamesPerHour: number
    fastestGameEstimate: number
    longestGameEstimate: number
  } {
    const stats = userStats.value
    
    return {
      totalPlayTime: stats.totalPlayTime,
      averageGameTime: stats.averageGameTime,
      totalGames: stats.totalGames,
      formattedTotalTime: formatPlayTime(stats.totalPlayTime),
      formattedAverageTime: formatTime(stats.averageGameTime),
      estimatedHoursPlayed: Math.round(stats.totalPlayTime / 3600 * 10) / 10,
      gamesPerHour: stats.averageGameTime > 0 ? Math.round(3600 / stats.averageGameTime) : 0,
      fastestGameEstimate: Math.max(60, stats.averageGameTime - 120),
      longestGameEstimate: stats.averageGameTime + 300
    }
  }

  /**
   * Calcula métricas de velocidad de juego
   */
  function getSpeedMetrics(): {
    category: 'very_fast' | 'fast' | 'normal' | 'slow' | 'very_slow'
    description: string
    percentile: number
    comparedToAverage: number
  } {
    const avgTime = userStats.value.averageGameTime
    const globalAverage = 420 // 7 minutos promedio estimado
    
    let category: 'very_fast' | 'fast' | 'normal' | 'slow' | 'very_slow' = 'normal'
    let description = 'Velocidad normal'
    let percentile = 50
    
    if (avgTime < 180) { // Menos de 3 minutos
      category = 'very_fast'
      description = 'Jugador muy rápido'
      percentile = 95
    } else if (avgTime < 300) { // Menos de 5 minutos
      category = 'fast'
      description = 'Jugador rápido'
      percentile = 80
    } else if (avgTime > 900) { // Más de 15 minutos
      category = 'very_slow'
      description = 'Jugador muy reflexivo'
      percentile = 5
    } else if (avgTime > 600) { // Más de 10 minutos
      category = 'slow'
      description = 'Jugador reflexivo'
      percentile = 20
    }
    
    const comparedToAverage = Math.round(((avgTime - globalAverage) / globalAverage) * 100)
    
    return {
      category,
      description,
      percentile,
      comparedToAverage
    }
  }

  /**
   * Obtiene tendencias de tiempo de juego
   */
  function getTimeTrends(): {
    recentAverage: number
    overallAverage: number
    trend: 'faster' | 'slower' | 'stable'
    trendPercentage: number
    description: string
  } {
    const overallAverage = userStats.value.averageGameTime
    const currentMonth = currentMonthStats.value
    const recentAverage = currentMonth.averageGameTime || overallAverage
    
    const difference = recentAverage - overallAverage
    const percentageDiff = overallAverage > 0 ? Math.abs(difference) / overallAverage * 100 : 0
    
    let trend: 'faster' | 'slower' | 'stable' = 'stable'
    let description = 'Tiempo de juego estable'
    
    if (percentageDiff > 10) {
      if (difference < 0) {
        trend = 'faster'
        description = `Jugando ${percentageDiff.toFixed(1)}% más rápido recientemente`
      } else {
        trend = 'slower'
        description = `Jugando ${percentageDiff.toFixed(1)}% más lento recientemente`
      }
    }
    
    return {
      recentAverage,
      overallAverage,
      trend,
      trendPercentage: percentageDiff,
      description
    }
  }

  /**
   * Inicializa el store cargando datos guardados
   */
  function initialize(): void {
    loadStatistics()
    resetSessionStats()
    console.log('📊 Store de estadísticas inicializado')
  }

  // ============================================================================
  // RETURN STORE
  // ============================================================================

  return {
    // Estado
    userStats,
    currentSessionStats,
    
    // Getters
    winRate,
    lossRate,
    averageGameTimeFormatted,
    totalPlayTimeFormatted,
    currentMonthStats,
    recentMonthsStats,
    isOnWinStreak,
    isOnLossStreak,
    performanceRating,
    
    // Acciones principales
    recordGameResult,
    resetAllStatistics,
    
    // Gestión de datos
    loadStatistics,
    saveStatistics,
    exportStatistics,
    importStatistics,
    
    // Análisis
    getRecentPerformance,
    getComparativeStats,
    getStatisticsAchievements,
    calculatePerformanceTrend,
    getSessionStatistics,
    resetSessionStats,
    
    // Funciones de tiempo
    recordGameStart,
    recordGameTime,
    getTimeStatistics,
    getSpeedMetrics,
    getTimeTrends,
    
    // Utilidades
    formatTime,
    formatPlayTime,
    
    // Inicialización
    initialize
  }
})