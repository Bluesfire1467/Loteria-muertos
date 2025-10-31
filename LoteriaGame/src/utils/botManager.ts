// Bot Manager para la aplicación de Lotería Día de Muertos
// Maneja la creación, comportamiento y reacciones de los bots

import { 
  Difficulty, 
  PlayerType, 
  CelebrationStyle 
} from '@/types'
import type { 
  BotPlayer, 
  BotPersonality, 
  LoteriaCard, 
  DifficultySettings,
  BotConfiguration 
} from '@/types'
import { getRandomCards } from '@/data/loteriaCards'
import { botAnimationManager } from './botAnimations'

// ============================================================================
// CONFIGURACIÓN DE BOTS
// ============================================================================

/**
 * Nombres mexicanos tradicionales para los bots
 */
export const BOT_NAMES: string[] = [
  'María Elena', 'José Luis', 'Carmen Rosa', 'Francisco Javier',
  'Ana Sofía', 'Miguel Ángel', 'Rosa María', 'Carlos Alberto',
  'Guadalupe', 'Antonio', 'Esperanza', 'Roberto',
  'Dolores', 'Manuel', 'Concepción', 'Alejandro'
]

/**
 * Personalidades predefinidas para los bots
 */
export const BOT_PERSONALITIES: BotPersonality[] = [
  {
    name: 'Rápido',
    reactionSpeed: 0.8,
    errorProbability: 0.05,
    celebrationStyle: CelebrationStyle.ENTHUSIASTIC
  },
  {
    name: 'Cauteloso',
    reactionSpeed: 1.5,
    errorProbability: 0.02,
    celebrationStyle: CelebrationStyle.SUBTLE
  },
  {
    name: 'Distraído',
    reactionSpeed: 2.0,
    errorProbability: 0.15,
    celebrationStyle: CelebrationStyle.ANIMATED
  },
  {
    name: 'Competitivo',
    reactionSpeed: 0.6,
    errorProbability: 0.08,
    celebrationStyle: CelebrationStyle.ENTHUSIASTIC
  },
  {
    name: 'Relajado',
    reactionSpeed: 2.5,
    errorProbability: 0.12,
    celebrationStyle: CelebrationStyle.SUBTLE
  },
  {
    name: 'Nervioso',
    reactionSpeed: 1.2,
    errorProbability: 0.20,
    celebrationStyle: CelebrationStyle.ANIMATED
  }
]

/**
 * Configuración de dificultad para los bots
 */
export const DIFFICULTY_SETTINGS: DifficultySettings = {
  [Difficulty.EASY]: {
    reactionTimeRange: [3000, 6000], // 3-6 segundos (más lento para dar oportunidad al jugador)
    errorRate: 0.25, // 25% de probabilidad de error
    adaptiveSpeedMultiplier: 1.2
  },
  [Difficulty.MEDIUM]: {
    reactionTimeRange: [2000, 4500], // 2-4.5 segundos
    errorRate: 0.15, // 15% de probabilidad de error
    adaptiveSpeedMultiplier: 1.0
  },
  [Difficulty.HARD]: {
    reactionTimeRange: [1000, 3000], // 1-3 segundos
    errorRate: 0.08, // 8% de probabilidad de error
    adaptiveSpeedMultiplier: 0.8
  }
}

/**
 * Configuración completa de bots
 */
export const BOT_CONFIGURATION: BotConfiguration = {
  names: BOT_NAMES,
  personalities: BOT_PERSONALITIES,
  difficultySettings: DIFFICULTY_SETTINGS
}

// ============================================================================
// CLASE BOT MANAGER
// ============================================================================

export class BotManager {
  private bots: Map<string, BotPlayer> = new Map()
  private reactionTimers: Map<string, number> = new Map()
  private botReactionCallbacks: Map<string, (botId: string, cardId: number) => void> = new Map()

  /**
   * Crea un nuevo bot con personalidad y dificultad específicas
   */
  createBot(
    id: string, 
    difficulty: Difficulty = Difficulty.MEDIUM,
    personalityIndex?: number
  ): BotPlayer {
    // Seleccionar personalidad
    const personality = personalityIndex !== undefined 
      ? BOT_PERSONALITIES[personalityIndex % BOT_PERSONALITIES.length]
      : this.getRandomPersonality()

    // Seleccionar nombre único
    const name = this.getUniqueBotName()

    // Obtener configuración de dificultad
    const difficultyConfig = DIFFICULTY_SETTINGS[difficulty]

    // Crear bot
    const bot: BotPlayer = {
      id,
      name,
      type: PlayerType.BOT,
      board: getRandomCards(16),
      markedCards: new Set<number>(),
      isWinner: false,
      difficulty,
      reactionTimeRange: difficultyConfig.reactionTimeRange,
      errorRate: difficultyConfig.errorRate,
      personality
    }

    // Registrar bot
    this.bots.set(id, bot)

    console.log(`🤖 Bot creado: ${name} (${personality.name}, ${difficulty})`)
    return bot
  }

  /**
   * Crea múltiples bots para una partida
   */
  createBots(count: number, baseDifficulty: Difficulty = Difficulty.MEDIUM): BotPlayer[] {
    const bots: BotPlayer[] = []
    
    for (let i = 0; i < count; i++) {
      // Variar ligeramente la dificultad
      let difficulty = baseDifficulty
      if (i === 0 && count > 1) {
        difficulty = Difficulty.EASY // Primer bot más fácil
      } else if (i === count - 1 && count > 2) {
        difficulty = Difficulty.HARD // Último bot más difícil
      }

      const bot = this.createBot(`bot_${i + 1}`, difficulty, i)
      bots.push(bot)
    }

    return bots
  }

  /**
   * Simula la reacción de un bot a una carta cantada
   */
  simulateBotReaction(
    botId: string, 
    currentCard: LoteriaCard,
    onReaction: (botId: string, cardId: number) => void
  ): void {
    const bot = this.bots.get(botId)
    if (!bot) {
      console.warn(`⚠️ Bot no encontrado: ${botId}`)
      return
    }

    // Limpiar timer anterior si existe
    this.clearBotTimer(botId)

    // Verificar si el bot tiene la carta en su tablero
    const hasCard = bot.board.some(card => card.id === currentCard.id)
    if (!hasCard) {
      console.log(`🤖 ${bot.name} no tiene la carta ${currentCard.name}`)
      return
    }

    // Verificar si ya marcó la carta
    if (bot.markedCards.has(currentCard.id)) {
      console.log(`🤖 ${bot.name} ya marcó la carta ${currentCard.name}`)
      return
    }

    // Calcular tiempo de reacción
    const reactionTime = this.calculateReactionTime(bot)
    
    // Determinar si cometerá un error
    const willMakeError = this.shouldMakeError(bot)

    console.log(`🤖 ${bot.name} reaccionará en ${reactionTime}ms ${willMakeError ? '(con error)' : ''}`)

    // Configurar callback
    this.botReactionCallbacks.set(botId, onReaction)

    // Programar reacción
    const timer = window.setTimeout(() => {
      if (willMakeError) {
        // Error: no marcar la carta o marcar carta incorrecta
        const errorType = Math.random() < 0.7 ? 'miss' : 'wrong'
        
        if (errorType === 'miss') {
          console.log(`🤖 ${bot.name} perdió la carta ${currentCard.name}`)
          // No hacer nada (perder la carta)
        } else {
          // Marcar carta incorrecta (si tiene alguna sin marcar)
          const unmarkedCards = bot.board.filter(card => !bot.markedCards.has(card.id))
          if (unmarkedCards.length > 0) {
            const wrongCard = unmarkedCards[Math.floor(Math.random() * unmarkedCards.length)]
            console.log(`🤖 ${bot.name} marcó carta incorrecta: ${wrongCard.name}`)
            // Nota: La validación en el juego debería prevenir esto
          }
        }
      } else {
        // Verificar que el bot realmente tiene la carta en su tablero antes de marcar
        const hasCardInBoard = bot.board.some(card => card.id === currentCard.id)
        if (hasCardInBoard && !bot.markedCards.has(currentCard.id)) {
          // Reacción correcta
          console.log(`🤖 ${bot.name} marca correctamente: ${currentCard.name}`)
          
          // Ejecutar celebración
          botAnimationManager.celebrateBot(bot, currentCard.name)
          
          onReaction(botId, currentCard.id)
        } else {
          console.log(`🤖 ${bot.name} no puede marcar ${currentCard.name} (no la tiene en su tablero o ya está marcada)`)
        }
      }

      // Limpiar timer
      this.reactionTimers.delete(botId)
    }, reactionTime)

    this.reactionTimers.set(botId, timer)
  }

  /**
   * Calcula el tiempo de reacción de un bot basado en su personalidad y dificultad
   */
  private calculateReactionTime(bot: BotPlayer): number {
    const [minTime, maxTime] = bot.reactionTimeRange
    const baseTime = minTime + Math.random() * (maxTime - minTime)
    
    // Aplicar modificador de personalidad
    const personalityModifier = bot.personality.reactionSpeed
    
    // Agregar variabilidad natural
    const variability = 0.8 + Math.random() * 0.4 // ±20%
    
    return Math.floor(baseTime * personalityModifier * variability)
  }

  /**
   * Determina si un bot debería cometer un error
   */
  private shouldMakeError(bot: BotPlayer): boolean {
    // Combinar error rate de dificultad y personalidad
    const totalErrorRate = Math.min(
      bot.errorRate + bot.personality.errorProbability,
      0.3 // Máximo 30% de error
    )
    
    return Math.random() < totalErrorRate
  }

  /**
   * Obtiene una personalidad aleatoria
   */
  private getRandomPersonality(): BotPersonality {
    return BOT_PERSONALITIES[Math.floor(Math.random() * BOT_PERSONALITIES.length)]
  }

  /**
   * Obtiene un nombre único para un bot
   */
  private getUniqueBotName(): string {
    const usedNames = Array.from(this.bots.values()).map(bot => bot.name)
    const availableNames = BOT_NAMES.filter(name => !usedNames.includes(name))
    
    if (availableNames.length === 0) {
      // Si no hay nombres disponibles, usar nombres con números
      return `Bot ${this.bots.size + 1}`
    }
    
    return availableNames[Math.floor(Math.random() * availableNames.length)]
  }

  /**
   * Limpia el timer de reacción de un bot
   */
  private clearBotTimer(botId: string): void {
    const timer = this.reactionTimers.get(botId)
    if (timer) {
      window.clearTimeout(timer)
      this.reactionTimers.delete(botId)
    }
  }

  /**
   * Obtiene información de un bot
   */
  getBotInfo(botId: string): BotPlayer | undefined {
    return this.bots.get(botId)
  }

  /**
   * Obtiene todos los bots registrados
   */
  getAllBots(): BotPlayer[] {
    return Array.from(this.bots.values())
  }

  /**
   * Actualiza la dificultad de un bot
   */
  updateBotDifficulty(botId: string, newDifficulty: Difficulty): boolean {
    const bot = this.bots.get(botId)
    if (!bot) return false

    const difficultyConfig = DIFFICULTY_SETTINGS[newDifficulty]
    bot.difficulty = newDifficulty
    bot.reactionTimeRange = difficultyConfig.reactionTimeRange
    bot.errorRate = difficultyConfig.errorRate

    console.log(`🤖 ${bot.name} dificultad actualizada a ${newDifficulty}`)
    return true
  }

  /**
   * Reinicia el estado de un bot para una nueva partida
   */
  resetBot(botId: string): boolean {
    const bot = this.bots.get(botId)
    if (!bot) return false

    // Limpiar timer si existe
    this.clearBotTimer(botId)

    // Reiniciar estado
    bot.board = getRandomCards(16)
    bot.markedCards.clear()
    bot.isWinner = false

    console.log(`🤖 ${bot.name} reiniciado para nueva partida`)
    return true
  }

  /**
   * Reinicia todos los bots
   */
  resetAllBots(): void {
    this.bots.forEach((_, botId) => {
      this.resetBot(botId)
    })
  }

  /**
   * Limpia todos los timers y bots
   */
  cleanup(): void {
    // Limpiar todos los timers
    this.reactionTimers.forEach(timer => window.clearTimeout(timer))
    this.reactionTimers.clear()

    // Limpiar callbacks
    this.botReactionCallbacks.clear()

    // Limpiar animaciones de bots
    this.bots.forEach((_, botId) => {
      botAnimationManager.unregisterBotElement(botId)
    })

    // Limpiar bots
    this.bots.clear()

    console.log('🧹 BotManager limpiado')
  }

  /**
   * Registra un elemento DOM para animaciones de un bot
   */
  registerBotElement(botId: string, element: HTMLElement): boolean {
    const bot = this.bots.get(botId)
    if (!bot) return false

    botAnimationManager.registerBotElement(botId, element)
    console.log(`🎭 Elemento registrado para animaciones: ${bot.name}`)
    return true
  }

  /**
   * Desregistra un elemento DOM de un bot
   */
  unregisterBotElement(botId: string): boolean {
    const bot = this.bots.get(botId)
    if (!bot) return false

    botAnimationManager.unregisterBotElement(botId)
    console.log(`🎭 Elemento desregistrado: ${bot.name}`)
    return true
  }

  /**
   * Ejecuta una celebración manual para un bot
   */
  celebrateBot(botId: string, cardName: string): boolean {
    const bot = this.bots.get(botId)
    if (!bot) return false

    const event = botAnimationManager.celebrateBot(bot, cardName)
    return event !== null
  }

  /**
   * Obtiene estadísticas de rendimiento de los bots
   */
  getBotStats(): Array<{
    id: string
    name: string
    personality: string
    difficulty: Difficulty
    markedCards: number
    errorsMade: number
    averageReactionTime: number
    celebrationStats?: any
  }> {
    const celebrationStats = botAnimationManager.getCelebrationStats()
    
    return Array.from(this.bots.values()).map(bot => {
      const botCelebrationStats = celebrationStats.find(stats => stats.botId === bot.id)
      
      return {
        id: bot.id,
        name: bot.name,
        personality: bot.personality.name,
        difficulty: bot.difficulty,
        markedCards: bot.markedCards.size,
        errorsMade: 0, // TODO: Implementar tracking de errores
        averageReactionTime: (bot.reactionTimeRange[0] + bot.reactionTimeRange[1]) / 2,
        celebrationStats: botCelebrationStats
      }
    })
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

/**
 * Instancia singleton del BotManager
 */
export const botManager = new BotManager()

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Crea bots con configuración predeterminada (dificultad fácil para mejor balance)
 */
export function createDefaultBots(count: number = 2): BotPlayer[] {
  return botManager.createBots(count, Difficulty.EASY)
}

/**
 * Obtiene la configuración de dificultad
 */
export function getDifficultySettings(difficulty: Difficulty) {
  return DIFFICULTY_SETTINGS[difficulty]
}

/**
 * Obtiene una personalidad aleatoria
 */
export function getRandomBotPersonality(): BotPersonality {
  return BOT_PERSONALITIES[Math.floor(Math.random() * BOT_PERSONALITIES.length)]
}

/**
 * Obtiene un nombre de bot aleatorio
 */
export function getRandomBotName(): string {
  return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]
}