// Composable para tracking de tiempo de juego y cronómetro de partidas

import { ref, computed, onUnmounted } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'

export function useGameTimer() {
  const statisticsStore = useStatisticsStore()

  // ============================================================================
  // ESTADO REACTIVO
  // ============================================================================

  const gameStartTime = ref<Date | null>(null)
  const gameEndTime = ref<Date | null>(null)
  const currentTime = ref(new Date())
  const isGameActive = ref(false)
  const isPaused = ref(false)
  const pausedTime = ref(0) // Tiempo total pausado en milisegundos

  // Timer para actualizar el tiempo actual
  let timeUpdateInterval: number | null = null
  let pauseStartTime: Date | null = null

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Duración actual del juego en segundos
   */
  const currentGameDuration = computed(() => {
    if (!gameStartTime.value) return 0
    
    const endTime = gameEndTime.value || currentTime.value
    const totalTime = endTime.getTime() - gameStartTime.value.getTime()
    const activeTime = totalTime - pausedTime.value
    
    return Math.max(0, Math.floor(activeTime / 1000))
  })

  /**
   * Duración formateada (mm:ss)
   */
  const formattedGameDuration = computed(() => {
    return formatTime(currentGameDuration.value)
  })

  /**
   * Duración formateada extendida (hh:mm:ss si es necesario)
   */
  const formattedGameDurationExtended = computed(() => {
    return formatTimeExtended(currentGameDuration.value)
  })

  /**
   * Estado del cronómetro
   */
  const timerStatus = computed(() => {
    if (!isGameActive.value) return 'stopped'
    if (isPaused.value) return 'paused'
    return 'running'
  })

  /**
   * Tiempo promedio por partida del usuario
   */
  const averageGameTime = computed(() => {
    return statisticsStore.userStats.averageGameTime
  })

  /**
   * Comparación con el tiempo promedio
   */
  const timeComparison = computed(() => {
    if (!isGameActive.value || averageGameTime.value === 0) {
      return { status: 'normal', difference: 0, message: '' }
    }

    const current = currentGameDuration.value
    const average = averageGameTime.value
    const difference = current - average
    const percentageDiff = Math.abs(difference) / average * 100

    if (percentageDiff < 10) {
      return { 
        status: 'normal', 
        difference, 
        message: 'Tiempo normal' 
      }
    } else if (difference > 0) {
      return { 
        status: 'slow', 
        difference, 
        message: `${Math.round(percentageDiff)}% más lento que tu promedio` 
      }
    } else {
      return { 
        status: 'fast', 
        difference, 
        message: `${Math.round(percentageDiff)}% más rápido que tu promedio` 
      }
    }
  })

  /**
   * Predicción de tiempo restante basada en progreso del juego
   */
  const estimatedTimeRemaining = computed(() => {
    // Esta función requeriría información del progreso del juego
    // Por ahora, estimamos basándonos en el tiempo promedio
    if (!isGameActive.value || averageGameTime.value === 0) return 0
    
    const elapsed = currentGameDuration.value
    const average = averageGameTime.value
    
    // Estimación simple: si llevamos menos del 80% del tiempo promedio, 
    // estimamos que falta el tiempo restante
    if (elapsed < average * 0.8) {
      return Math.max(0, average - elapsed)
    }
    
    // Si ya pasamos el 80%, estimamos que puede durar un 20% más
    return Math.round(elapsed * 0.2)
  })

  // ============================================================================
  // ACCIONES DEL CRONÓMETRO
  // ============================================================================

  /**
   * Inicia el cronómetro de una nueva partida
   */
  function startGame(): void {
    gameStartTime.value = new Date()
    gameEndTime.value = null
    isGameActive.value = true
    isPaused.value = false
    pausedTime.value = 0
    pauseStartTime = null

    // Iniciar actualización del tiempo
    startTimeUpdate()

    console.log('⏱️ Cronómetro de partida iniciado')
  }

  /**
   * Finaliza el cronómetro de la partida actual
   */
  function endGame(): number {
    if (!isGameActive.value) return 0

    gameEndTime.value = new Date()
    isGameActive.value = false
    isPaused.value = false

    // Si estaba pausado, agregar el tiempo de pausa final
    if (pauseStartTime) {
      pausedTime.value += gameEndTime.value.getTime() - pauseStartTime.getTime()
      pauseStartTime = null
    }

    // Detener actualización del tiempo
    stopTimeUpdate()

    const finalDuration = currentGameDuration.value
    console.log(`⏱️ Partida finalizada en ${formattedGameDuration.value}`)

    return finalDuration
  }

  /**
   * Pausa el cronómetro
   */
  function pauseGame(): void {
    if (!isGameActive.value || isPaused.value) return

    isPaused.value = true
    pauseStartTime = new Date()
    
    console.log('⏸️ Cronómetro pausado')
  }

  /**
   * Reanuda el cronómetro
   */
  function resumeGame(): void {
    if (!isGameActive.value || !isPaused.value || !pauseStartTime) return

    // Agregar el tiempo pausado al total
    pausedTime.value += new Date().getTime() - pauseStartTime.getTime()
    pauseStartTime = null
    isPaused.value = false

    console.log('▶️ Cronómetro reanudado')
  }

  /**
   * Reinicia el cronómetro
   */
  function resetGame(): void {
    gameStartTime.value = null
    gameEndTime.value = null
    isGameActive.value = false
    isPaused.value = false
    pausedTime.value = 0
    pauseStartTime = null

    stopTimeUpdate()

    console.log('🔄 Cronómetro reiniciado')
  }

  // ============================================================================
  // GESTIÓN DE TIEMPO
  // ============================================================================

  /**
   * Inicia la actualización periódica del tiempo
   */
  function startTimeUpdate(): void {
    stopTimeUpdate() // Asegurar que no hay múltiples intervalos
    
    timeUpdateInterval = window.setInterval(() => {
      currentTime.value = new Date()
    }, 1000) // Actualizar cada segundo
  }

  /**
   * Detiene la actualización del tiempo
   */
  function stopTimeUpdate(): void {
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval)
      timeUpdateInterval = null
    }
  }

  // ============================================================================
  // ESTADÍSTICAS DE TIEMPO
  // ============================================================================

  /**
   * Registra el tiempo de la partida en las estadísticas
   */
  function recordGameTime(duration: number): void {
    // Esta función se llamaría desde el GameManager cuando termine una partida
    console.log(`📊 Tiempo de partida registrado: ${formatTime(duration)}`)
  }

  /**
   * Obtiene estadísticas de tiempo de juego
   */
  function getTimeStatistics() {
    const stats = statisticsStore.userStats
    
    return {
      totalPlayTime: stats.totalPlayTime,
      averageGameTime: stats.averageGameTime,
      totalGames: stats.totalGames,
      formattedTotalTime: statisticsStore.formatPlayTime(stats.totalPlayTime),
      formattedAverageTime: statisticsStore.formatTime(stats.averageGameTime),
      estimatedHoursPlayed: Math.round(stats.totalPlayTime / 3600 * 10) / 10
    }
  }

  /**
   * Calcula estadísticas de velocidad de juego
   */
  function getSpeedStatistics() {
    const stats = statisticsStore.userStats
    const timeStats = getTimeStatistics()
    
    // Clasificación de velocidad basada en tiempo promedio
    let speedCategory = 'normal'
    let speedDescription = 'Velocidad normal'
    
    if (stats.averageGameTime < 300) { // Menos de 5 minutos
      speedCategory = 'fast'
      speedDescription = 'Jugador rápido'
    } else if (stats.averageGameTime < 180) { // Menos de 3 minutos
      speedCategory = 'very_fast'
      speedDescription = 'Jugador muy rápido'
    } else if (stats.averageGameTime > 600) { // Más de 10 minutos
      speedCategory = 'slow'
      speedDescription = 'Jugador reflexivo'
    } else if (stats.averageGameTime > 900) { // Más de 15 minutos
      speedCategory = 'very_slow'
      speedDescription = 'Jugador muy reflexivo'
    }

    return {
      category: speedCategory,
      description: speedDescription,
      averageTime: stats.averageGameTime,
      gamesPerHour: stats.averageGameTime > 0 ? Math.round(3600 / stats.averageGameTime) : 0,
      ...timeStats
    }
  }

  /**
   * Obtiene récords de tiempo
   */
  function getTimeRecords() {
    // En una implementación completa, estos datos vendrían del historial de partidas
    // Por ahora, estimamos basándonos en las estadísticas actuales
    const avgTime = statisticsStore.userStats.averageGameTime
    
    return {
      fastestGame: Math.max(60, avgTime - 120), // Estimación: 2 minutos menos que el promedio
      longestGame: avgTime + 300, // Estimación: 5 minutos más que el promedio
      averageGame: avgTime,
      totalGames: statisticsStore.userStats.totalGames,
      hasRecords: statisticsStore.userStats.totalGames > 0
    }
  }

  // ============================================================================
  // UTILIDADES DE FORMATO
  // ============================================================================

  /**
   * Formatea tiempo en formato mm:ss
   */
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Formatea tiempo en formato extendido hh:mm:ss
   */
  function formatTimeExtended(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }

  /**
   * Convierte segundos a texto descriptivo
   */
  function formatTimeDescriptive(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} segundo${seconds !== 1 ? 's' : ''}`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      if (remainingSeconds === 0) {
        return `${minutes} minuto${minutes !== 1 ? 's' : ''}`
      } else {
        return `${minutes}m ${remainingSeconds}s`
      }
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
  }

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  // Limpiar intervalos al desmontar el componente
  onUnmounted(() => {
    stopTimeUpdate()
  })

  // ============================================================================
  // RETURN COMPOSABLE
  // ============================================================================

  return {
    // Estado
    gameStartTime,
    gameEndTime,
    isGameActive,
    isPaused,
    timerStatus,

    // Tiempo computado
    currentGameDuration,
    formattedGameDuration,
    formattedGameDurationExtended,
    timeComparison,
    estimatedTimeRemaining,

    // Acciones del cronómetro
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    resetGame,

    // Estadísticas
    recordGameTime,
    getTimeStatistics,
    getSpeedStatistics,
    getTimeRecords,

    // Utilidades
    formatTime,
    formatTimeExtended,
    formatTimeDescriptive
  }
}