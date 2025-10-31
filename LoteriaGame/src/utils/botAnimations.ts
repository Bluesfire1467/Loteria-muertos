// Sistema de animaciones de celebración para bots
// Maneja diferentes estilos de celebración basados en personalidades

import { CelebrationStyle } from '@/types'
import type { BotPlayer } from '@/types'

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================

interface CelebrationAnimation {
  id: string
  name: string
  duration: number
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
}

interface BotCelebrationEvent {
  botId: string
  botName: string
  celebrationStyle: CelebrationStyle
  cardName: string
  timestamp: Date
  animationId: string
}

interface CelebrationConfig {
  [CelebrationStyle.SUBTLE]: CelebrationAnimation[]
  [CelebrationStyle.ANIMATED]: CelebrationAnimation[]
  [CelebrationStyle.ENTHUSIASTIC]: CelebrationAnimation[]
}

// ============================================================================
// CONFIGURACIÓN DE ANIMACIONES
// ============================================================================

/**
 * Configuración de animaciones por estilo de celebración
 */
const CELEBRATION_ANIMATIONS: CelebrationConfig = {
  [CelebrationStyle.SUBTLE]: [
    {
      id: 'subtle_glow',
      name: 'Brillo Sutil',
      duration: 1000,
      keyframes: [
        { boxShadow: '0 0 0 rgba(255, 215, 0, 0)', transform: 'scale(1)' },
        { boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)', transform: 'scale(1.02)' },
        { boxShadow: '0 0 0 rgba(255, 215, 0, 0)', transform: 'scale(1)' }
      ],
      options: {
        duration: 1000,
        easing: 'ease-in-out',
        iterations: 1
      }
    },
    {
      id: 'subtle_pulse',
      name: 'Pulso Discreto',
      duration: 800,
      keyframes: [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.9, transform: 'scale(1.01)' },
        { opacity: 1, transform: 'scale(1)' }
      ],
      options: {
        duration: 800,
        easing: 'ease-out',
        iterations: 2
      }
    }
  ],

  [CelebrationStyle.ANIMATED]: [
    {
      id: 'bounce_celebration',
      name: 'Rebote Animado',
      duration: 1200,
      keyframes: [
        { transform: 'translateY(0) scale(1)', backgroundColor: 'transparent' },
        { transform: 'translateY(-10px) scale(1.05)', backgroundColor: 'rgba(255, 165, 0, 0.2)' },
        { transform: 'translateY(0) scale(1.02)', backgroundColor: 'rgba(255, 165, 0, 0.1)' },
        { transform: 'translateY(-5px) scale(1.03)', backgroundColor: 'rgba(255, 165, 0, 0.15)' },
        { transform: 'translateY(0) scale(1)', backgroundColor: 'transparent' }
      ],
      options: {
        duration: 1200,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        iterations: 1
      }
    },
    {
      id: 'wiggle_dance',
      name: 'Baile Ondulante',
      duration: 1500,
      keyframes: [
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(2deg) scale(1.02)' },
        { transform: 'rotate(-2deg) scale(1.01)' },
        { transform: 'rotate(1deg) scale(1.02)' },
        { transform: 'rotate(-1deg) scale(1.01)' },
        { transform: 'rotate(0deg) scale(1)' }
      ],
      options: {
        duration: 1500,
        easing: 'ease-in-out',
        iterations: 1
      }
    }
  ],

  [CelebrationStyle.ENTHUSIASTIC]: [
    {
      id: 'explosive_celebration',
      name: 'Celebración Explosiva',
      duration: 2000,
      keyframes: [
        { 
          transform: 'scale(1) rotate(0deg)', 
          boxShadow: '0 0 0 rgba(255, 69, 0, 0)',
          backgroundColor: 'transparent'
        },
        { 
          transform: 'scale(1.15) rotate(5deg)', 
          boxShadow: '0 0 30px rgba(255, 69, 0, 0.8)',
          backgroundColor: 'rgba(255, 215, 0, 0.3)'
        },
        { 
          transform: 'scale(1.1) rotate(-3deg)', 
          boxShadow: '0 0 25px rgba(255, 69, 0, 0.6)',
          backgroundColor: 'rgba(255, 215, 0, 0.2)'
        },
        { 
          transform: 'scale(1.12) rotate(2deg)', 
          boxShadow: '0 0 35px rgba(255, 69, 0, 0.7)',
          backgroundColor: 'rgba(255, 215, 0, 0.25)'
        },
        { 
          transform: 'scale(1) rotate(0deg)', 
          boxShadow: '0 0 0 rgba(255, 69, 0, 0)',
          backgroundColor: 'transparent'
        }
      ],
      options: {
        duration: 2000,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        iterations: 1
      }
    },
    {
      id: 'party_spin',
      name: 'Giro de Fiesta',
      duration: 1800,
      keyframes: [
        { 
          transform: 'rotate(0deg) scale(1)', 
          filter: 'hue-rotate(0deg) brightness(1)',
          borderRadius: '0%'
        },
        { 
          transform: 'rotate(180deg) scale(1.1)', 
          filter: 'hue-rotate(90deg) brightness(1.2)',
          borderRadius: '20%'
        },
        { 
          transform: 'rotate(360deg) scale(1.05)', 
          filter: 'hue-rotate(180deg) brightness(1.1)',
          borderRadius: '10%'
        },
        { 
          transform: 'rotate(540deg) scale(1)', 
          filter: 'hue-rotate(0deg) brightness(1)',
          borderRadius: '0%'
        }
      ],
      options: {
        duration: 1800,
        easing: 'ease-in-out',
        iterations: 1
      }
    }
  ]
}

/**
 * Frases de celebración por personalidad
 */
const CELEBRATION_PHRASES = {
  [CelebrationStyle.SUBTLE]: [
    '¡Bien!', 'Perfecto', 'Excelente', 'Muy bien'
  ],
  [CelebrationStyle.ANIMATED]: [
    '¡Órale!', '¡Qué bueno!', '¡Así se hace!', '¡Genial!'
  ],
  [CelebrationStyle.ENTHUSIASTIC]: [
    '¡SÍÍÍÍ!', '¡VAMOS!', '¡QUÉ EMOCIÓN!', '¡ARRIBA!', '¡WEEEEY!'
  ]
}

// ============================================================================
// CLASE BOT ANIMATION MANAGER
// ============================================================================

export class BotAnimationManager {
  private activeAnimations: Map<string, Animation> = new Map()
  private celebrationHistory: BotCelebrationEvent[] = []
  private animationElements: Map<string, HTMLElement> = new Map()

  /**
   * Registra un elemento DOM para animaciones de bot
   */
  registerBotElement(botId: string, element: HTMLElement): void {
    this.animationElements.set(botId, element)
    console.log(`🎭 Elemento registrado para bot: ${botId}`)
  }

  /**
   * Desregistra un elemento DOM de bot
   */
  unregisterBotElement(botId: string): void {
    // Cancelar animación activa si existe
    this.stopCelebration(botId)
    
    // Remover elemento
    this.animationElements.delete(botId)
    console.log(`🎭 Elemento desregistrado para bot: ${botId}`)
  }

  /**
   * Ejecuta una celebración para un bot específico
   */
  celebrateBot(bot: BotPlayer, cardName: string): BotCelebrationEvent | null {
    const element = this.animationElements.get(bot.id)
    if (!element) {
      console.warn(`⚠️ No hay elemento registrado para bot: ${bot.id}`)
      return null
    }

    // Detener animación anterior si existe
    this.stopCelebration(bot.id)

    // Seleccionar animación basada en personalidad
    const animation = this.selectCelebrationAnimation(bot.personality.celebrationStyle)
    
    // Crear evento de celebración
    const celebrationEvent: BotCelebrationEvent = {
      botId: bot.id,
      botName: bot.name,
      celebrationStyle: bot.personality.celebrationStyle,
      cardName,
      timestamp: new Date(),
      animationId: animation.id
    }

    // Ejecutar animación
    this.executeAnimation(bot.id, element, animation, celebrationEvent)

    // Mostrar frase de celebración
    this.showCelebrationPhrase(bot, cardName)

    // Registrar evento
    this.celebrationHistory.push(celebrationEvent)

    console.log(`🎉 ${bot.name} celebra: ${cardName} (${animation.name})`)
    return celebrationEvent
  }

  /**
   * Selecciona una animación aleatoria basada en el estilo de celebración
   */
  private selectCelebrationAnimation(style: CelebrationStyle): CelebrationAnimation {
    const animations = CELEBRATION_ANIMATIONS[style]
    return animations[Math.floor(Math.random() * animations.length)]
  }

  /**
   * Ejecuta la animación en el elemento DOM
   */
  private executeAnimation(
    botId: string,
    element: HTMLElement,
    animation: CelebrationAnimation,
    event: BotCelebrationEvent
  ): void {
    try {
      // Crear y ejecutar animación Web API
      const webAnimation = element.animate(animation.keyframes, animation.options)
      
      // Guardar referencia
      this.activeAnimations.set(botId, webAnimation)

      // Manejar finalización
      webAnimation.addEventListener('finish', () => {
        this.activeAnimations.delete(botId)
        console.log(`✨ Animación completada: ${event.botName} - ${animation.name}`)
      })

      // Manejar cancelación
      webAnimation.addEventListener('cancel', () => {
        this.activeAnimations.delete(botId)
        console.log(`🚫 Animación cancelada: ${event.botName} - ${animation.name}`)
      })

    } catch (error) {
      console.error(`❌ Error ejecutando animación para ${botId}:`, error)
    }
  }

  /**
   * Muestra una frase de celebración temporal
   */
  private showCelebrationPhrase(bot: BotPlayer, cardName: string): void {
    const phrases = CELEBRATION_PHRASES[bot.personality.celebrationStyle]
    const phrase = phrases[Math.floor(Math.random() * phrases.length)]
    
    // Crear elemento de frase temporal
    const phraseElement = document.createElement('div')
    phraseElement.textContent = phrase
    phraseElement.className = 'bot-celebration-phrase'
    phraseElement.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 215, 0, 0.9);
      color: #2D1B69;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      z-index: 1000;
      pointer-events: none;
      animation: celebrationPhrase 2s ease-out forwards;
    `

    // Agregar estilos de animación si no existen
    this.ensurePhraseStyles()

    // Agregar al elemento del bot
    const botElement = this.animationElements.get(bot.id)
    if (botElement) {
      botElement.style.position = 'relative'
      botElement.appendChild(phraseElement)

      // Remover después de la animación
      setTimeout(() => {
        if (phraseElement.parentNode) {
          phraseElement.parentNode.removeChild(phraseElement)
        }
      }, 2000)
    }

    console.log(`💬 ${bot.name}: "${phrase}" (por ${cardName})`)
  }

  /**
   * Asegura que los estilos CSS para frases estén disponibles
   */
  private ensurePhraseStyles(): void {
    const styleId = 'bot-celebration-phrase-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes celebrationPhrase {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(10px) scale(0.8);
        }
        20% {
          opacity: 1;
          transform: translateX(-50%) translateY(-5px) scale(1.1);
        }
        80% {
          opacity: 1;
          transform: translateX(-50%) translateY(-10px) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px) scale(0.9);
        }
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Detiene la celebración activa de un bot
   */
  stopCelebration(botId: string): boolean {
    const animation = this.activeAnimations.get(botId)
    if (animation) {
      animation.cancel()
      this.activeAnimations.delete(botId)
      console.log(`🛑 Celebración detenida para bot: ${botId}`)
      return true
    }
    return false
  }

  /**
   * Detiene todas las celebraciones activas
   */
  stopAllCelebrations(): void {
    this.activeAnimations.forEach((animation, botId) => {
      animation.cancel()
      console.log(`🛑 Celebración detenida para bot: ${botId}`)
    })
    this.activeAnimations.clear()
  }

  /**
   * Obtiene el historial de celebraciones
   */
  getCelebrationHistory(): BotCelebrationEvent[] {
    return [...this.celebrationHistory]
  }

  /**
   * Obtiene estadísticas de celebraciones por bot
   */
  getCelebrationStats(): Array<{
    botId: string
    botName: string
    totalCelebrations: number
    celebrationsByStyle: Record<CelebrationStyle, number>
    lastCelebration?: Date
  }> {
    const stats = new Map<string, any>()

    this.celebrationHistory.forEach(event => {
      if (!stats.has(event.botId)) {
        stats.set(event.botId, {
          botId: event.botId,
          botName: event.botName,
          totalCelebrations: 0,
          celebrationsByStyle: {
            [CelebrationStyle.SUBTLE]: 0,
            [CelebrationStyle.ANIMATED]: 0,
            [CelebrationStyle.ENTHUSIASTIC]: 0
          },
          lastCelebration: undefined
        })
      }

      const botStats = stats.get(event.botId)
      botStats.totalCelebrations++
      botStats.celebrationsByStyle[event.celebrationStyle]++
      botStats.lastCelebration = event.timestamp
    })

    return Array.from(stats.values())
  }

  /**
   * Limpia el historial de celebraciones
   */
  clearHistory(): void {
    this.celebrationHistory = []
    console.log('🧹 Historial de celebraciones limpiado')
  }

  /**
   * Obtiene las animaciones disponibles para un estilo
   */
  getAvailableAnimations(style: CelebrationStyle): CelebrationAnimation[] {
    return [...CELEBRATION_ANIMATIONS[style]]
  }

  /**
   * Verifica si un bot tiene una celebración activa
   */
  isCelebrating(botId: string): boolean {
    return this.activeAnimations.has(botId)
  }

  /**
   * Obtiene información sobre celebraciones activas
   */
  getActiveCelebrations(): Array<{
    botId: string
    animationId: string
    startTime: Date
    isRunning: boolean
  }> {
    const active: Array<{
      botId: string
      animationId: string
      startTime: Date
      isRunning: boolean
    }> = []

    this.activeAnimations.forEach((animation, botId) => {
      // Buscar el evento más reciente para este bot
      const recentEvent = this.celebrationHistory
        .filter(event => event.botId === botId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]

      if (recentEvent) {
        active.push({
          botId,
          animationId: recentEvent.animationId,
          startTime: recentEvent.timestamp,
          isRunning: animation.playState === 'running'
        })
      }
    })

    return active
  }

  /**
   * Limpia todos los recursos
   */
  cleanup(): void {
    this.stopAllCelebrations()
    this.animationElements.clear()
    this.celebrationHistory = []
    console.log('🧹 BotAnimationManager limpiado')
  }
}

// ============================================================================
// INSTANCIA SINGLETON
// ============================================================================

/**
 * Instancia singleton del BotAnimationManager
 */
export const botAnimationManager = new BotAnimationManager()

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Celebra una acción de bot con animación
 */
export function celebrateBotAction(bot: BotPlayer, cardName: string): BotCelebrationEvent | null {
  return botAnimationManager.celebrateBot(bot, cardName)
}

/**
 * Registra un elemento para animaciones de bot
 */
export function registerBotForAnimations(botId: string, element: HTMLElement): void {
  botAnimationManager.registerBotElement(botId, element)
}

/**
 * Desregistra un elemento de animaciones de bot
 */
export function unregisterBotFromAnimations(botId: string): void {
  botAnimationManager.unregisterBotElement(botId)
}

/**
 * Obtiene una frase de celebración aleatoria para un estilo
 */
export function getRandomCelebrationPhrase(style: CelebrationStyle): string {
  const phrases = CELEBRATION_PHRASES[style]
  return phrases[Math.floor(Math.random() * phrases.length)]
}

/**
 * Verifica si las animaciones Web API están soportadas
 */
export function isAnimationSupported(): boolean {
  return typeof Element !== 'undefined' && 'animate' in Element.prototype
}

/**
 * Obtiene la configuración de animaciones
 */
export function getCelebrationConfig(): CelebrationConfig {
  return { ...CELEBRATION_ANIMATIONS }
}