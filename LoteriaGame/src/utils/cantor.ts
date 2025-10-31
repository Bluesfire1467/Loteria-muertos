// Cantor - Sistema de cantado de cartas para Lotería Día de Muertos

import type { LoteriaCard } from '@/types'
import { LOTERIA_CARDS } from '@/data/loteriaCards'

export interface CantorConfig {
  /** Intervalo entre cartas en milisegundos (por defecto 5000ms = 5s) */
  cardInterval: number
  /** Si debe mezclar las cartas antes de empezar */
  shuffleCards: boolean
  /** Si debe repetir cartas cuando se acaben todas */
  repeatCards: boolean
  /** Callback cuando se canta una nueva carta */
  onCardCalled?: (card: LoteriaCard) => void
  /** Callback cuando se termina el mazo */
  onDeckFinished?: () => void
}

export interface CantorState {
  isActive: boolean
  currentCard: LoteriaCard | null
  remainingCards: LoteriaCard[]
  calledCards: LoteriaCard[]
  currentIndex: number
  intervalId: number | null
}

/**
 * Gestor del sistema de cantado de cartas
 * Maneja el anuncio automático y temporizado de cartas durante el juego
 */
export class CantorManager {
  private state: CantorState = {
    isActive: false,
    currentCard: null,
    remainingCards: [],
    calledCards: [],
    currentIndex: 0,
    intervalId: null
  }

  private config: CantorConfig = {
    cardInterval: 5000, // 5 segundos por defecto
    shuffleCards: true,
    repeatCards: false
  }

  constructor(config?: Partial<CantorConfig>) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
    this.reset()
  }

  /**
   * Inicia el cantado automático de cartas
   */
  start(): boolean {
    if (this.state.isActive) {
      console.warn('🎤 Cantor ya está activo')
      return false
    }

    if (this.state.remainingCards.length === 0) {
      console.warn('🎤 No hay cartas disponibles para cantar')
      return false
    }

    this.state.isActive = true
    console.log(`🎤 Cantor iniciado - Intervalo: ${this.config.cardInterval}ms`)
    
    // Cantar la primera carta inmediatamente
    this.callNextCard()
    
    // Configurar el intervalo para las siguientes cartas
    this.state.intervalId = window.setInterval(() => {
      this.callNextCard()
    }, this.config.cardInterval)

    return true
  }

  /**
   * Detiene el cantado de cartas
   */
  stop(): void {
    if (!this.state.isActive) {
      return
    }

    this.state.isActive = false
    
    if (this.state.intervalId !== null) {
      clearInterval(this.state.intervalId)
      this.state.intervalId = null
    }

    console.log('🎤 Cantor detenido')
  }

  /**
   * Pausa el cantado (mantiene el estado pero detiene el timer)
   */
  pause(): void {
    if (!this.state.isActive) {
      return
    }

    if (this.state.intervalId !== null) {
      clearInterval(this.state.intervalId)
      this.state.intervalId = null
    }

    console.log('🎤 Cantor pausado')
  }

  /**
   * Reanuda el cantado desde donde se pausó
   */
  resume(): void {
    if (!this.state.isActive || this.state.intervalId !== null) {
      return
    }

    this.state.intervalId = window.setInterval(() => {
      this.callNextCard()
    }, this.config.cardInterval)

    console.log('🎤 Cantor reanudado')
  }

  /**
   * Reinicia el cantor con un nuevo mazo de cartas
   */
  reset(): void {
    this.stop()
    
    // Preparar el mazo de cartas
    this.state.remainingCards = [...LOTERIA_CARDS]
    
    if (this.config.shuffleCards) {
      this.shuffleArray(this.state.remainingCards)
    }

    this.state.calledCards = []
    this.state.currentCard = null
    this.state.currentIndex = 0

    console.log(`🎤 Cantor reiniciado con ${this.state.remainingCards.length} cartas`)
  }

  /**
   * Canta la siguiente carta manualmente
   */
  callNextCard(): LoteriaCard | null {
    if (this.state.remainingCards.length === 0) {
      if (this.config.repeatCards) {
        // Reiniciar el mazo si está configurado para repetir
        this.state.remainingCards = [...this.state.calledCards]
        this.state.calledCards = []
        
        if (this.config.shuffleCards) {
          this.shuffleArray(this.state.remainingCards)
        }
        
        console.log('🎤 Mazo reiniciado para repetir cartas')
      } else {
        // Terminar el cantado
        this.stop()
        this.config.onDeckFinished?.()
        console.log('🎤 Se terminaron todas las cartas')
        return null
      }
    }

    // Tomar la siguiente carta
    const nextCard = this.state.remainingCards.shift()!
    this.state.currentCard = nextCard
    this.state.calledCards.push(nextCard)
    this.state.currentIndex++

    console.log(`🎤 Carta cantada: ${nextCard.name} (${this.state.currentIndex}/${LOTERIA_CARDS.length})`)

    // Notificar a los listeners
    this.config.onCardCalled?.(nextCard)

    return nextCard
  }

  /**
   * Obtiene la carta actual
   */
  getCurrentCard(): LoteriaCard | null {
    return this.state.currentCard
  }

  /**
   * Obtiene el estado actual del cantor
   */
  getState(): Readonly<CantorState> {
    return { ...this.state }
  }

  /**
   * Obtiene la configuración actual
   */
  getConfig(): Readonly<CantorConfig> {
    return { ...this.config }
  }

  /**
   * Actualiza la configuración del cantor
   */
  updateConfig(newConfig: Partial<CantorConfig>): void {
    const wasActive = this.state.isActive
    
    if (wasActive) {
      this.stop()
    }

    this.config = { ...this.config, ...newConfig }
    
    console.log(`🎤 Configuración actualizada:`, {
      cardInterval: this.config.cardInterval,
      shuffleCards: this.config.shuffleCards,
      repeatCards: this.config.repeatCards
    })

    if (wasActive) {
      this.start()
    }
  }

  /**
   * Obtiene estadísticas del cantado actual
   */
  getStats() {
    return {
      totalCards: LOTERIA_CARDS.length,
      calledCards: this.state.calledCards.length,
      remainingCards: this.state.remainingCards.length,
      progress: (this.state.calledCards.length / LOTERIA_CARDS.length) * 100,
      isActive: this.state.isActive,
      currentCard: this.state.currentCard?.name || null
    }
  }

  /**
   * Verifica si una carta específica ya fue cantada
   */
  wasCardCalled(cardId: number): boolean {
    return this.state.calledCards.some(card => card.id === cardId)
  }

  /**
   * Obtiene el historial de cartas cantadas
   */
  getCalledCards(): LoteriaCard[] {
    return [...this.state.calledCards]
  }

  /**
   * Obtiene las cartas restantes por cantar
   */
  getRemainingCards(): LoteriaCard[] {
    return [...this.state.remainingCards]
  }

  /**
   * Mezcla un array usando el algoritmo Fisher-Yates
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  /**
   * Limpia recursos al destruir el cantor
   */
  destroy(): void {
    this.stop()
    this.state.remainingCards = []
    this.state.calledCards = []
    this.state.currentCard = null
    console.log('🎤 Cantor destruido')
  }
}

// Instancia singleton del cantor para uso global
export const cantor = new CantorManager()

// Configuraciones predefinidas
export const CANTOR_PRESETS = {
  SLOW: { cardInterval: 8000, shuffleCards: true, repeatCards: false },
  NORMAL: { cardInterval: 5000, shuffleCards: true, repeatCards: false },
  FAST: { cardInterval: 3000, shuffleCards: true, repeatCards: false },
  RAPID: { cardInterval: 1500, shuffleCards: true, repeatCards: false }
} as const

export type CantorPreset = keyof typeof CANTOR_PRESETS