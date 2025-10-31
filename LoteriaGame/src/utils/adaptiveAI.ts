// Sistema de IA Adaptativa para ajustar dificultad de bots
// Analiza el desempeño del jugador y ajusta la dificultad automáticamente

import { Difficulty } from '@/types'
import type { 
  BotPlayer, 
  GameSession, 
  UserStatistics 
} from '@/types'
import { botManager } from './botManager'

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

interface PlayerPerformanceMetrics {
  winRate: number
  averageGameTime: number
  recentWinStreak: number
  recentLossStreak: number
  gamesPlayed: number
  skillLevel: number // 0-100
}

interface DifficultyAdjustment {
  oldDifficulty: Difficulty
  newDifficulty: Difficulty
  reason: string
  confidence: number // 0-1
}

interface AdaptiveSettings {
  minGamesBeforeAdjustment: number
  adjustmentThreshold: number
  maxAdjustmentsPerSession: number
  skillLevelBounds: {
    beginner: [number, number]
    intermediate: [number, number]
    advanced: [number, number]
  }
}

// ============================================================================
// CONFIGURACIÓN ADAPTATIVA
// ============================================================================

const DEFAULT_ADAPTIVE_SETTINGS: AdaptiveSettings = {
  minGamesBeforeAdjustment: 3,
  adjustmentThreshold: 0.15, // 15% de confianza mínima para ajustar
  maxAdjustmentsPerSession: 2,
  skillLevelBounds: {
    beginner: [0, 30],
    intermediate: [30, 70],
    advanced: [70, 100]
  }
}

// ============================================================================
// CLASE ADAPTIVE AI MANAGER
// ============================================================================

export class AdaptiveAIManager {
  private settings: AdaptiveSettings
  private adjustmentHistory: DifficultyAdjustment[] = []
  private sessionAdjustments: number = 0
  private lastAnalysisTime: Date = new Date()

  constructor(settings: AdaptiveSettings = DEFAULT_ADAPTIVE_SETTINGS) {
    this.settings = settings
  }

  /**
   * Analiza el desempeño del jugador y sugiere ajustes de dificultad
   */
  analyzePlayerPerformance(
    playerStats: UserStatistics,
    recentGames: GameSession[]
  ): PlayerPerformanceMetrics {
    const metrics: PlayerPerformanceMetrics = {
      winRate: this.calculateWinRate(playerStats),
      averageGameTime: playerStats.averageGameTime,
      recentWinStreak: this.calculateRecentWinStreak(recentGames),
      recentLossStreak: this.calculateRecentLossStreak(recentGames),
      gamesPlayed: playerStats.totalGames,
      skillLevel: this.calculateSkillLevel(playerStats, recentGames)
    }

    console.log('📊 Métricas de rendimiento del jugador:', metrics)
    return metrics
  }

  /**
   * Determina si se debe ajustar la dificultad de los bots
   */
  shouldAdjustDifficulty(
    metrics: PlayerPerformanceMetrics,
    currentBots: BotPlayer[]
  ): boolean {
    // Verificar condiciones básicas
    if (metrics.gamesPlayed < this.settings.minGamesBeforeAdjustment) {
      console.log(`⏳ Esperando más partidas (${metrics.gamesPlayed}/${this.settings.minGamesBeforeAdjustment})`)
      return false
    }

    if (this.sessionAdjustments >= this.settings.maxAdjustmentsPerSession) {
      console.log(`🚫 Máximo de ajustes por sesión alcanzado (${this.sessionAdjustments})`)
      return false
    }

    // Analizar si hay desbalance significativo
    const difficultyMismatch = this.analyzeDifficultyMismatch(metrics, currentBots)
    
    return difficultyMismatch.confidence >= this.settings.adjustmentThreshold
  }

  /**
   * Ajusta la dificultad de los bots basado en el rendimiento del jugador
   */
  adjustBotsDifficulty(
    metrics: PlayerPerformanceMetrics,
    currentBots: BotPlayer[]
  ): DifficultyAdjustment[] {
    const adjustments: DifficultyAdjustment[] = []

    for (const bot of currentBots) {
      const adjustment = this.calculateBotDifficultyAdjustment(metrics, bot)
      
      if (adjustment && adjustment.newDifficulty !== adjustment.oldDifficulty) {
        // Aplicar el ajuste
        const success = botManager.updateBotDifficulty(bot.id, adjustment.newDifficulty)
        
        if (success) {
          adjustments.push(adjustment)
          this.adjustmentHistory.push(adjustment)
          this.sessionAdjustments++
          
          console.log(`🎯 Ajuste de dificultad: ${bot.name} ${adjustment.oldDifficulty} → ${adjustment.newDifficulty}`)
          console.log(`   Razón: ${adjustment.reason}`)
        }
      }
    }

    return adjustments
  }

  /**
   * Calcula el ajuste de dificultad para un bot específico
   */
  private calculateBotDifficultyAdjustment(
    metrics: PlayerPerformanceMetrics,
    bot: BotPlayer
  ): DifficultyAdjustment | null {
    const targetDifficulty = this.getTargetDifficulty(metrics)
    const currentDifficulty = bot.difficulty

    if (targetDifficulty === currentDifficulty) {
      return null
    }

    let reason = ''
    let confidence = 0

    // Determinar razón y confianza del ajuste
    if (metrics.winRate > 0.75 && metrics.recentWinStreak >= 3) {
      reason = 'Jugador ganando demasiado fácilmente'
      confidence = Math.min(0.9, metrics.winRate - 0.5)
    } else if (metrics.winRate < 0.25 && metrics.recentLossStreak >= 3) {
      reason = 'Jugador perdiendo demasiado seguido'
      confidence = Math.min(0.9, 0.5 - metrics.winRate)
    } else if (metrics.skillLevel > 70 && currentDifficulty === Difficulty.EASY) {
      reason = 'Nivel de habilidad alto detectado'
      confidence = (metrics.skillLevel - 70) / 30 * 0.8
    } else if (metrics.skillLevel < 30 && currentDifficulty === Difficulty.HARD) {
      reason = 'Nivel de habilidad bajo detectado'
      confidence = (30 - metrics.skillLevel) / 30 * 0.8
    } else {
      // Ajuste gradual basado en tendencias
      const winRateDiff = Math.abs(metrics.winRate - 0.5)
      if (winRateDiff > 0.2) {
        reason = 'Ajuste gradual por tendencia de victorias'
        confidence = winRateDiff * 0.6
      }
    }

    if (confidence < this.settings.adjustmentThreshold) {
      return null
    }

    return {
      oldDifficulty: currentDifficulty,
      newDifficulty: targetDifficulty,
      reason,
      confidence
    }
  }

  /**
   * Determina la dificultad objetivo basada en las métricas del jugador
   */
  private getTargetDifficulty(metrics: PlayerPerformanceMetrics): Difficulty {
    const { skillLevel, winRate, recentWinStreak, recentLossStreak } = metrics

    // Casos extremos
    if (winRate > 0.8 && recentWinStreak >= 5) {
      return Difficulty.HARD
    }
    
    if (winRate < 0.2 && recentLossStreak >= 5) {
      return Difficulty.EASY
    }

    // Basado en nivel de habilidad
    if (skillLevel >= this.settings.skillLevelBounds.advanced[0]) {
      return winRate > 0.6 ? Difficulty.HARD : Difficulty.MEDIUM
    }
    
    if (skillLevel <= this.settings.skillLevelBounds.beginner[1]) {
      return winRate < 0.4 ? Difficulty.EASY : Difficulty.MEDIUM
    }

    // Nivel intermedio - ajuste fino
    if (winRate > 0.65) {
      return Difficulty.HARD
    } else if (winRate < 0.35) {
      return Difficulty.EASY
    } else {
      return Difficulty.MEDIUM
    }
  }

  /**
   * Analiza el desajuste entre dificultad actual y rendimiento del jugador
   */
  private analyzeDifficultyMismatch(
    metrics: PlayerPerformanceMetrics,
    currentBots: BotPlayer[]
  ): { mismatch: boolean; confidence: number; reason: string } {
    const targetDifficulty = this.getTargetDifficulty(metrics)
    
    // Verificar si hay bots que necesitan ajuste
    const needsAdjustment = currentBots.some(bot => bot.difficulty !== targetDifficulty)
    
    if (!needsAdjustment) {
      return { mismatch: false, confidence: 0, reason: 'Dificultad apropiada' }
    }

    // Calcular confianza basada en métricas
    let confidence = 0
    let reason = ''

    const winRateDeviation = Math.abs(metrics.winRate - 0.5)
    const streakFactor = Math.max(metrics.recentWinStreak, metrics.recentLossStreak) / 10

    confidence = Math.min(0.9, winRateDeviation + streakFactor * 0.3)

    if (metrics.winRate > 0.7) {
      reason = 'Tasa de victoria muy alta'
    } else if (metrics.winRate < 0.3) {
      reason = 'Tasa de victoria muy baja'
    } else if (metrics.recentWinStreak >= 4) {
      reason = 'Racha de victorias larga'
    } else if (metrics.recentLossStreak >= 4) {
      reason = 'Racha de derrotas larga'
    } else {
      reason = 'Ajuste preventivo'
      confidence *= 0.5 // Reducir confianza para ajustes preventivos
    }

    return { mismatch: true, confidence, reason }
  }

  /**
   * Calcula la tasa de victorias del jugador
   */
  private calculateWinRate(stats: UserStatistics): number {
    if (stats.totalGames === 0) return 0
    return stats.wins / stats.totalGames
  }

  /**
   * Calcula la racha de victorias reciente
   */
  private calculateRecentWinStreak(recentGames: GameSession[]): number {
    let streak = 0
    
    // Analizar los últimos 10 juegos
    const games = recentGames.slice(-10).reverse()
    
    for (const game of games) {
      if (game.winner?.type === 'human') {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  /**
   * Calcula la racha de derrotas reciente
   */
  private calculateRecentLossStreak(recentGames: GameSession[]): number {
    let streak = 0
    
    // Analizar los últimos 10 juegos
    const games = recentGames.slice(-10).reverse()
    
    for (const game of games) {
      if (game.winner?.type === 'bot') {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  /**
   * Calcula el nivel de habilidad del jugador (0-100)
   */
  private calculateSkillLevel(
    stats: UserStatistics,
    recentGames: GameSession[]
  ): number {
    let skillLevel = 50 // Base neutral

    // Factor de tasa de victorias (40% del peso)
    const winRateBonus = (stats.winPercentage - 50) * 0.8
    skillLevel += winRateBonus

    // Factor de tiempo promedio (20% del peso)
    // Juegos más rápidos indican mayor habilidad
    if (stats.averageGameTime > 0) {
      const timeBonus = Math.max(-15, Math.min(15, (300 - stats.averageGameTime) / 20))
      skillLevel += timeBonus
    }

    // Factor de consistencia (20% del peso)
    const recentWinRate = this.calculateRecentWinRate(recentGames)
    const consistency = 100 - Math.abs(stats.winPercentage - recentWinRate * 100)
    skillLevel += (consistency - 50) * 0.2

    // Factor de experiencia (20% del peso)
    const experienceBonus = Math.min(20, stats.totalGames / 5)
    skillLevel += experienceBonus

    // Normalizar entre 0-100
    return Math.max(0, Math.min(100, skillLevel))
  }

  /**
   * Calcula la tasa de victorias reciente
   */
  private calculateRecentWinRate(recentGames: GameSession[]): number {
    if (recentGames.length === 0) return 0
    
    const recentWins = recentGames.filter(game => game.winner?.type === 'human').length
    return recentWins / recentGames.length
  }

  /**
   * Obtiene el historial de ajustes
   */
  getAdjustmentHistory(): DifficultyAdjustment[] {
    return [...this.adjustmentHistory]
  }

  /**
   * Reinicia el contador de ajustes de sesión
   */
  resetSessionAdjustments(): void {
    this.sessionAdjustments = 0
    console.log('🔄 Contador de ajustes de sesión reiniciado')
  }

  /**
   * Obtiene estadísticas del sistema adaptativo
   */
  getAdaptiveStats(): {
    totalAdjustments: number
    sessionAdjustments: number
    lastAnalysis: Date
    settings: AdaptiveSettings
  } {
    return {
      totalAdjustments: this.adjustmentHistory.length,
      sessionAdjustments: this.sessionAdjustments,
      lastAnalysis: this.lastAnalysisTime,
      settings: { ...this.settings }
    }
  }

  /**
   * Actualiza la configuración adaptativa
   */
  updateSettings(newSettings: Partial<AdaptiveSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    console.log('⚙️ Configuración adaptativa actualizada:', newSettings)
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

/**
 * Instancia singleton del AdaptiveAIManager
 */
export const adaptiveAI = new AdaptiveAIManager()

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Analiza y ajusta la dificultad automáticamente
 */
export function autoAdjustDifficulty(
  playerStats: UserStatistics,
  recentGames: GameSession[],
  currentBots: BotPlayer[]
): DifficultyAdjustment[] {
  const metrics = adaptiveAI.analyzePlayerPerformance(playerStats, recentGames)
  
  if (adaptiveAI.shouldAdjustDifficulty(metrics, currentBots)) {
    return adaptiveAI.adjustBotsDifficulty(metrics, currentBots)
  }
  
  return []
}

/**
 * Obtiene la dificultad recomendada para nuevos bots
 */
export function getRecommendedDifficulty(
  playerStats: UserStatistics,
  recentGames: GameSession[]
): Difficulty {
  const metrics = adaptiveAI.analyzePlayerPerformance(playerStats, recentGames)
  return adaptiveAI['getTargetDifficulty'](metrics) // Acceso a método privado para utilidad
}

/**
 * Verifica si el jugador está listo para un desafío mayor
 */
export function isPlayerReadyForChallenge(
  playerStats: UserStatistics,
  recentGames: GameSession[]
): boolean {
  const metrics = adaptiveAI.analyzePlayerPerformance(playerStats, recentGames)
  return metrics.winRate > 0.7 && metrics.recentWinStreak >= 3 && metrics.skillLevel > 60
}

/**
 * Verifica si el jugador necesita ayuda (dificultad más fácil)
 */
export function doesPlayerNeedHelp(
  playerStats: UserStatistics,
  recentGames: GameSession[]
): boolean {
  const metrics = adaptiveAI.analyzePlayerPerformance(playerStats, recentGames)
  return metrics.winRate < 0.3 && metrics.recentLossStreak >= 3 && metrics.skillLevel < 40
}