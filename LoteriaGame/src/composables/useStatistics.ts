// Composable para cálculos de estadísticas y análisis de rendimiento

import { computed, ref } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import type { UserStatistics, MonthlyStats } from '@/types'

export function useStatistics() {
  const statisticsStore = useStatisticsStore()

  // ============================================================================
  // CÁLCULOS DE PORCENTAJES
  // ============================================================================

  /**
   * Calcula el porcentaje de victorias con precisión decimal
   */
  const preciseWinRate = computed(() => {
    const stats = statisticsStore.userStats
    if (stats.totalGames === 0) return 0
    return Number(((stats.wins / stats.totalGames) * 100).toFixed(2))
  })

  /**
   * Calcula el porcentaje de derrotas
   */
  const lossRate = computed(() => {
    const stats = statisticsStore.userStats
    if (stats.totalGames === 0) return 0
    return Number(((stats.losses / stats.totalGames) * 100).toFixed(2))
  })

  /**
   * Calcula la tasa de mejora mensual
   */
  const monthlyImprovementRate = computed(() => {
    const recentMonths = statisticsStore.recentMonthsStats
    if (recentMonths.length < 2) return 0

    const currentMonth = recentMonths[0].stats
    const previousMonth = recentMonths[1].stats

    if (previousMonth.gamesPlayed === 0) return 0

    const improvement = currentMonth.winPercentage - previousMonth.winPercentage
    return Number(improvement.toFixed(1))
  })

  // ============================================================================
  // CÁLCULOS DE PROMEDIOS
  // ============================================================================

  /**
   * Calcula el promedio de tiempo de juego por día
   */
  const averagePlayTimePerDay = computed(() => {
    const stats = statisticsStore.userStats
    const currentMonth = statisticsStore.currentMonthStats
    
    if (currentMonth.gamesPlayed === 0) return 0
    
    const daysInMonth = new Date().getDate() // Días transcurridos del mes actual
    const totalTimeThisMonth = currentMonth.gamesPlayed * currentMonth.averageGameTime
    
    return Math.round(totalTimeThisMonth / daysInMonth)
  })

  /**
   * Calcula el promedio de partidas por sesión
   */
  const averageGamesPerSession = computed(() => {
    // Estimación basada en estadísticas históricas
    const stats = statisticsStore.userStats
    if (stats.totalGames === 0) return 0
    
    // Asumimos que una sesión promedio dura entre 30-60 minutos
    const averageSessionTime = 45 * 60 // 45 minutos en segundos
    const gamesPerSession = Math.round(averageSessionTime / stats.averageGameTime)
    
    return Math.max(1, Math.min(gamesPerSession, 10)) // Entre 1 y 10 partidas por sesión
  })

  /**
   * Calcula el promedio móvil de victorias (últimas N partidas)
   */
  function calculateMovingAverage(windowSize: number = 10): number {
    // En una implementación real, esto vendría del historial de partidas
    // Por ahora, simulamos basándonos en las estadísticas actuales
    const stats = statisticsStore.userStats
    const recentPerformance = statisticsStore.getRecentPerformance(windowSize)
    
    return recentPerformance.recentWinRate
  }

  // ============================================================================
  // CÁLCULOS DE RACHAS
  // ============================================================================

  /**
   * Analiza patrones de rachas
   */
  const streakAnalysis = computed(() => {
    const stats = statisticsStore.userStats
    const currentStreak = stats.currentWinStreak
    const longestStreak = stats.longestWinStreak
    
    return {
      current: currentStreak,
      longest: longestStreak,
      isPositive: currentStreak > 0,
      isNegative: currentStreak < 0,
      streakType: currentStreak > 0 ? 'victoria' : currentStreak < 0 ? 'derrota' : 'neutral',
      streakLength: Math.abs(currentStreak),
      percentageOfBest: longestStreak > 0 ? Math.round((Math.abs(currentStreak) / longestStreak) * 100) : 0
    }
  })

  /**
   * Predice la probabilidad de continuar la racha actual
   */
  const streakProbability = computed(() => {
    const analysis = streakAnalysis.value
    const winRate = preciseWinRate.value / 100
    
    if (analysis.current === 0) {
      return {
        nextWin: winRate,
        nextLoss: 1 - winRate,
        streakContinuation: 0
      }
    }
    
    // Probabilidad de continuar racha basada en el rendimiento histórico
    const streakContinuation = analysis.isPositive 
      ? winRate * (1 - (analysis.streakLength * 0.05)) // Disminuye ligeramente con rachas largas
      : (1 - winRate) * (1 - (analysis.streakLength * 0.05))
    
    return {
      nextWin: winRate,
      nextLoss: 1 - winRate,
      streakContinuation: Math.max(0.1, Math.min(0.9, streakContinuation))
    }
  })

  // ============================================================================
  // ANÁLISIS TEMPORAL
  // ============================================================================

  /**
   * Analiza tendencias de rendimiento por hora del día
   */
  function getPerformanceByTimeOfDay(): Array<{
    hour: number
    gamesPlayed: number
    winRate: number
    label: string
  }> {
    // Simulación de datos por hora (en una implementación real vendría del historial)
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    return hours.map(hour => {
      // Simulamos patrones realistas: mejor rendimiento en horas de concentración
      let baseWinRate = preciseWinRate.value
      
      // Ajustes por hora del día
      if (hour >= 9 && hour <= 11) baseWinRate += 5 // Mañana productiva
      if (hour >= 14 && hour <= 16) baseWinRate += 3 // Tarde concentrada
      if (hour >= 20 && hour <= 22) baseWinRate += 2 // Noche relajada
      if (hour >= 0 && hour <= 6) baseWinRate -= 10 // Madrugada cansada
      if (hour >= 12 && hour <= 13) baseWinRate -= 3 // Hora de comida
      
      const gamesPlayed = Math.max(0, Math.round(Math.random() * 10))
      
      return {
        hour,
        gamesPlayed,
        winRate: Math.max(0, Math.min(100, baseWinRate + (Math.random() - 0.5) * 10)),
        label: `${hour.toString().padStart(2, '0')}:00`
      }
    })
  }

  /**
   * Analiza tendencias semanales
   */
  function getWeeklyTrends(): Array<{
    day: number
    dayName: string
    gamesPlayed: number
    winRate: number
    averageGameTime: number
  }> {
    const days = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 
      'Jueves', 'Viernes', 'Sábado'
    ]
    
    return days.map((dayName, day) => {
      const baseWinRate = preciseWinRate.value
      const baseGameTime = statisticsStore.userStats.averageGameTime
      
      // Patrones semanales simulados
      let winRateModifier = 0
      let gameTimeModifier = 0
      
      if (day === 0 || day === 6) { // Fin de semana
        winRateModifier = 5 // Mejor rendimiento relajado
        gameTimeModifier = 30 // Partidas más largas
      } else if (day === 1) { // Lunes
        winRateModifier = -3 // Inicio de semana más difícil
        gameTimeModifier = -15 // Partidas más rápidas
      }
      
      return {
        day,
        dayName,
        gamesPlayed: Math.round(Math.random() * 15 + 5),
        winRate: Math.max(0, Math.min(100, baseWinRate + winRateModifier + (Math.random() - 0.5) * 8)),
        averageGameTime: Math.max(60, baseGameTime + gameTimeModifier + (Math.random() - 0.5) * 60)
      }
    })
  }

  // ============================================================================
  // COMPARACIONES Y RANKINGS
  // ============================================================================

  /**
   * Compara estadísticas con períodos anteriores
   */
  function compareWithPreviousPeriod(period: 'month' | 'quarter' | 'year') {
    const currentMonth = statisticsStore.currentMonthStats
    const recentMonths = statisticsStore.recentMonthsStats
    
    let comparisonData = {
      current: currentMonth,
      previous: null as MonthlyStats | null,
      improvement: {
        gamesPlayed: 0,
        winRate: 0,
        averageGameTime: 0
      }
    }
    
    if (period === 'month' && recentMonths.length >= 2) {
      comparisonData.previous = recentMonths[1].stats
    } else if (period === 'quarter' && recentMonths.length >= 4) {
      // Promedio del trimestre anterior
      const quarterStats = recentMonths.slice(1, 4).reduce((acc, month) => ({
        gamesPlayed: acc.gamesPlayed + month.stats.gamesPlayed,
        wins: acc.wins + month.stats.wins,
        losses: acc.losses + month.stats.losses,
        winPercentage: 0, // Se calculará después
        averageGameTime: acc.averageGameTime + month.stats.averageGameTime,
        month: 'Trimestre Anterior',
        year: currentMonth.year
      }), { gamesPlayed: 0, wins: 0, losses: 0, winPercentage: 0, averageGameTime: 0, month: '', year: 0 })
      
      quarterStats.winPercentage = quarterStats.gamesPlayed > 0 
        ? Math.round((quarterStats.wins / quarterStats.gamesPlayed) * 100)
        : 0
      quarterStats.averageGameTime = Math.round(quarterStats.averageGameTime / 3)
      
      comparisonData.previous = quarterStats
    }
    
    if (comparisonData.previous) {
      comparisonData.improvement = {
        gamesPlayed: currentMonth.gamesPlayed - comparisonData.previous.gamesPlayed,
        winRate: currentMonth.winPercentage - comparisonData.previous.winPercentage,
        averageGameTime: currentMonth.averageGameTime - comparisonData.previous.averageGameTime
      }
    }
    
    return comparisonData
  }

  /**
   * Calcula el ranking simulado del jugador
   */
  const playerRanking = computed(() => {
    const stats = statisticsStore.userStats
    const winRate = preciseWinRate.value
    
    // Simulación de ranking basado en múltiples factores
    let score = 0
    
    // Factor de victorias (40% del score)
    score += (winRate / 100) * 400
    
    // Factor de experiencia (30% del score)
    const experienceBonus = Math.min(stats.totalGames / 100, 1) * 300
    score += experienceBonus
    
    // Factor de consistencia (20% del score)
    const consistencyBonus = Math.max(0, 1 - (Math.abs(stats.currentWinStreak) / 20)) * 200
    score += consistencyBonus
    
    // Factor de actividad reciente (10% del score)
    const activityBonus = Math.min(statisticsStore.currentMonthStats.gamesPlayed / 20, 1) * 100
    score += activityBonus
    
    // Determinar liga y posición
    let league = 'Bronce'
    let position = Math.floor(Math.random() * 1000) + 1
    
    if (score >= 800) {
      league = 'Diamante'
      position = Math.floor(Math.random() * 50) + 1
    } else if (score >= 650) {
      league = 'Oro'
      position = Math.floor(Math.random() * 100) + 1
    } else if (score >= 500) {
      league = 'Plata'
      position = Math.floor(Math.random() * 200) + 1
    } else if (score >= 350) {
      league = 'Bronce'
      position = Math.floor(Math.random() * 500) + 1
    }
    
    return {
      score: Math.round(score),
      league,
      position,
      percentile: Math.max(1, Math.min(99, Math.round((1000 - position) / 10)))
    }
  })

  // ============================================================================
  // PREDICCIONES Y PROYECCIONES
  // ============================================================================

  /**
   * Proyecta estadísticas futuras basadas en tendencias actuales
   */
  function projectFutureStats(days: number = 30): {
    projectedGames: number
    projectedWins: number
    projectedWinRate: number
    projectedPlayTime: number
  } {
    const currentMonth = statisticsStore.currentMonthStats
    const dailyAverage = averagePlayTimePerDay.value
    const gamesPerDay = currentMonth.gamesPlayed / new Date().getDate()
    
    const projectedGames = Math.round(gamesPerDay * days)
    const projectedWins = Math.round(projectedGames * (preciseWinRate.value / 100))
    const projectedPlayTime = dailyAverage * days
    
    return {
      projectedGames,
      projectedWins,
      projectedWinRate: preciseWinRate.value,
      projectedPlayTime
    }
  }

  // ============================================================================
  // RETURN COMPOSABLE
  // ============================================================================

  return {
    // Cálculos de porcentajes
    preciseWinRate,
    lossRate,
    monthlyImprovementRate,
    
    // Cálculos de promedios
    averagePlayTimePerDay,
    averageGamesPerSession,
    calculateMovingAverage,
    
    // Análisis de rachas
    streakAnalysis,
    streakProbability,
    
    // Análisis temporal
    getPerformanceByTimeOfDay,
    getWeeklyTrends,
    
    // Comparaciones
    compareWithPreviousPeriod,
    playerRanking,
    
    // Proyecciones
    projectFutureStats
  }
}