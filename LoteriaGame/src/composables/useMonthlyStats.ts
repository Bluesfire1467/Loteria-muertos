// Composable para seguimiento y análisis de estadísticas mensuales

import { computed, ref } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import type { MonthlyStats } from '@/types'

export function useMonthlyStats() {
  const statisticsStore = useStatisticsStore()
  const selectedMonth = ref(getCurrentMonthKey())

  // ============================================================================
  // GETTERS COMPUTADOS
  // ============================================================================

  /**
   * Estadísticas del mes seleccionado
   */
  const currentMonthData = computed(() => {
    return statisticsStore.userStats.monthlyStats[selectedMonth.value] || createEmptyMonthlyStats(selectedMonth.value)
  })

  /**
   * Lista de meses disponibles para selección
   */
  const availableMonths = computed(() => {
    const months: Array<{ key: string; label: string; stats: MonthlyStats }> = []
    const currentDate = new Date()
    
    // Generar últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const key = formatMonthKey(date)
      const stats = statisticsStore.userStats.monthlyStats[key] || createEmptyMonthlyStats(key)
      
      months.push({
        key,
        label: formatMonthLabel(date),
        stats
      })
    }
    
    return months
  })

  /**
   * Meses con datos (que tienen partidas jugadas)
   */
  const monthsWithData = computed(() => {
    return availableMonths.value.filter(month => month.stats.gamesPlayed > 0)
  })

  /**
   * Mejor mes en términos de porcentaje de victoria
   */
  const bestMonth = computed(() => {
    const months = monthsWithData.value
    if (months.length === 0) return null
    
    return months.reduce((best, current) => 
      current.stats.winPercentage > best.stats.winPercentage ? current : best
    )
  })

  /**
   * Mes más activo (más partidas jugadas)
   */
  const mostActiveMonth = computed(() => {
    const months = monthsWithData.value
    if (months.length === 0) return null
    
    return months.reduce((most, current) => 
      current.stats.gamesPlayed > most.stats.gamesPlayed ? current : most
    )
  })

  /**
   * Tendencia de los últimos 6 meses
   */
  const sixMonthTrend = computed(() => {
    const recentMonths = availableMonths.value.slice(0, 6).reverse()
    const monthsWithGames = recentMonths.filter(m => m.stats.gamesPlayed > 0)
    
    if (monthsWithGames.length < 2) {
      return { trend: 'stable', change: 0, description: 'Datos insuficientes' }
    }
    
    const first = monthsWithGames[0]
    const last = monthsWithGames[monthsWithGames.length - 1]
    const change = last.stats.winPercentage - first.stats.winPercentage
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    let description = 'Rendimiento estable'
    
    if (change > 5) {
      trend = 'improving'
      description = `Mejorando ${change.toFixed(1)}% en los últimos meses`
    } else if (change < -5) {
      trend = 'declining'
      description = `Bajando ${Math.abs(change).toFixed(1)}% en los últimos meses`
    }
    
    return { trend, change, description }
  })

  // ============================================================================
  // ANÁLISIS COMPARATIVO
  // ============================================================================

  /**
   * Compara el mes actual con el anterior
   */
  const monthOverMonthComparison = computed(() => {
    const currentMonth = statisticsStore.currentMonthStats
    const previousMonthKey = getPreviousMonthKey()
    const previousMonth = statisticsStore.userStats.monthlyStats[previousMonthKey]
    
    if (!previousMonth || previousMonth.gamesPlayed === 0) {
      return {
        hasComparison: false,
        gamesChange: 0,
        winRateChange: 0,
        timeChange: 0
      }
    }
    
    return {
      hasComparison: true,
      gamesChange: currentMonth.gamesPlayed - previousMonth.gamesPlayed,
      winRateChange: currentMonth.winPercentage - previousMonth.winPercentage,
      timeChange: currentMonth.averageGameTime - previousMonth.averageGameTime,
      gamesChangePercent: previousMonth.gamesPlayed > 0 
        ? Math.round(((currentMonth.gamesPlayed - previousMonth.gamesPlayed) / previousMonth.gamesPlayed) * 100)
        : 0
    }
  })

  /**
   * Estadísticas del trimestre actual
   */
  const quarterlyStats = computed(() => {
    const currentDate = new Date()
    const quarterMonths = getQuarterMonths(currentDate)
    
    let totalGames = 0
    let totalWins = 0
    let totalLosses = 0
    let totalTime = 0
    let monthsWithData = 0
    
    quarterMonths.forEach(monthKey => {
      const monthStats = statisticsStore.userStats.monthlyStats[monthKey]
      if (monthStats && monthStats.gamesPlayed > 0) {
        totalGames += monthStats.gamesPlayed
        totalWins += monthStats.wins
        totalLosses += monthStats.losses
        totalTime += monthStats.averageGameTime * monthStats.gamesPlayed
        monthsWithData++
      }
    })
    
    return {
      gamesPlayed: totalGames,
      wins: totalWins,
      losses: totalLosses,
      winPercentage: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
      averageGameTime: totalGames > 0 ? Math.round(totalTime / totalGames) : 0,
      monthsActive: monthsWithData,
      quarter: getQuarterName(currentDate)
    }
  })

  // ============================================================================
  // ANÁLISIS DE PATRONES
  // ============================================================================

  /**
   * Identifica patrones estacionales
   */
  const seasonalPatterns = computed(() => {
    const monthlyData = monthsWithData.value
    if (monthlyData.length < 6) return null
    
    // Agrupar por estación (aproximado por mes)
    const seasons = {
      spring: [] as MonthlyStats[], // Mar, Abr, May
      summer: [] as MonthlyStats[], // Jun, Jul, Ago
      autumn: [] as MonthlyStats[], // Sep, Oct, Nov
      winter: [] as MonthlyStats[]  // Dic, Ene, Feb
    }
    
    monthlyData.forEach(month => {
      const monthNum = parseInt(month.key.split('-')[1])
      if ([3, 4, 5].includes(monthNum)) seasons.spring.push(month.stats)
      else if ([6, 7, 8].includes(monthNum)) seasons.summer.push(month.stats)
      else if ([9, 10, 11].includes(monthNum)) seasons.autumn.push(month.stats)
      else seasons.winter.push(month.stats)
    })
    
    const seasonAverages = Object.entries(seasons).map(([season, months]) => {
      if (months.length === 0) return { season, avgWinRate: 0, avgGames: 0, monthCount: 0 }
      
      const avgWinRate = months.reduce((sum, m) => sum + m.winPercentage, 0) / months.length
      const avgGames = months.reduce((sum, m) => sum + m.gamesPlayed, 0) / months.length
      
      return {
        season,
        avgWinRate: Math.round(avgWinRate),
        avgGames: Math.round(avgGames),
        monthCount: months.length
      }
    }).filter(s => s.monthCount > 0)
    
    return seasonAverages
  })

  /**
   * Detecta rachas mensuales
   */
  const monthlyStreaks = computed(() => {
    const months = monthsWithData.value.slice().reverse() // Orden cronológico
    if (months.length < 2) return { currentStreak: 0, longestStreak: 0, streakType: 'none' }
    
    let currentStreak = 0
    let longestStreak = 0
    let streakType: 'improving' | 'declining' | 'none' = 'none'
    
    // Detectar racha actual
    for (let i = 1; i < months.length; i++) {
      const current = months[i].stats.winPercentage
      const previous = months[i - 1].stats.winPercentage
      
      if (current > previous) {
        if (streakType !== 'improving') {
          currentStreak = 1
          streakType = 'improving'
        } else {
          currentStreak++
        }
      } else if (current < previous) {
        if (streakType !== 'declining') {
          currentStreak = 1
          streakType = 'declining'
        } else {
          currentStreak++
        }
      } else {
        currentStreak = 0
        streakType = 'none'
      }
      
      longestStreak = Math.max(longestStreak, currentStreak)
    }
    
    return { currentStreak, longestStreak, streakType }
  })

  // ============================================================================
  // ACCIONES
  // ============================================================================

  /**
   * Selecciona un mes específico
   */
  function selectMonth(monthKey: string) {
    selectedMonth.value = monthKey
  }

  /**
   * Navega al mes anterior
   */
  function goToPreviousMonth() {
    const current = new Date(selectedMonth.value + '-01')
    const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1)
    selectedMonth.value = formatMonthKey(previous)
  }

  /**
   * Navega al mes siguiente
   */
  function goToNextMonth() {
    const current = new Date(selectedMonth.value + '-01')
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1)
    const today = new Date()
    
    // No permitir navegar más allá del mes actual
    if (next <= today) {
      selectedMonth.value = formatMonthKey(next)
    }
  }

  /**
   * Vuelve al mes actual
   */
  function goToCurrentMonth() {
    selectedMonth.value = getCurrentMonthKey()
  }

  /**
   * Obtiene resumen de un rango de meses
   */
  function getMonthRangeSummary(startMonth: string, endMonth: string) {
    const start = new Date(startMonth + '-01')
    const end = new Date(endMonth + '-01')
    
    let totalGames = 0
    let totalWins = 0
    let totalTime = 0
    let monthsWithData = 0
    
    const current = new Date(start)
    while (current <= end) {
      const monthKey = formatMonthKey(current)
      const monthStats = statisticsStore.userStats.monthlyStats[monthKey]
      
      if (monthStats && monthStats.gamesPlayed > 0) {
        totalGames += monthStats.gamesPlayed
        totalWins += monthStats.wins
        totalTime += monthStats.averageGameTime * monthStats.gamesPlayed
        monthsWithData++
      }
      
      current.setMonth(current.getMonth() + 1)
    }
    
    return {
      totalGames,
      totalWins,
      winPercentage: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
      averageGameTime: totalGames > 0 ? Math.round(totalTime / totalGames) : 0,
      monthsActive: monthsWithData,
      monthsInRange: Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)) + 1
    }
  }

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  function getCurrentMonthKey(): string {
    const now = new Date()
    return formatMonthKey(now)
  }

  function getPreviousMonthKey(): string {
    const now = new Date()
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return formatMonthKey(previous)
  }

  function formatMonthKey(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
  }

  function formatMonthLabel(date: Date): string {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  function createEmptyMonthlyStats(monthKey: string): MonthlyStats {
    const [year, month] = monthKey.split('-').map(Number)
    const date = new Date(year, month - 1)
    
    return {
      month: date.toLocaleDateString('es-ES', { month: 'long' }),
      year,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      averageGameTime: 0
    }
  }

  function getQuarterMonths(date: Date): string[] {
    const quarter = Math.floor(date.getMonth() / 3)
    const year = date.getFullYear()
    const startMonth = quarter * 3
    
    return [
      `${year}-${(startMonth + 1).toString().padStart(2, '0')}`,
      `${year}-${(startMonth + 2).toString().padStart(2, '0')}`,
      `${year}-${(startMonth + 3).toString().padStart(2, '0')}`
    ]
  }

  function getQuarterName(date: Date): string {
    const quarter = Math.floor(date.getMonth() / 3) + 1
    return `Q${quarter} ${date.getFullYear()}`
  }

  // ============================================================================
  // RETURN COMPOSABLE
  // ============================================================================

  return {
    // Estado
    selectedMonth,
    
    // Datos computados
    currentMonthData,
    availableMonths,
    monthsWithData,
    bestMonth,
    mostActiveMonth,
    sixMonthTrend,
    
    // Análisis comparativo
    monthOverMonthComparison,
    quarterlyStats,
    
    // Patrones
    seasonalPatterns,
    monthlyStreaks,
    
    // Acciones
    selectMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    getMonthRangeSummary,
    
    // Utilidades
    formatMonthLabel,
    getCurrentMonthKey
  }
}