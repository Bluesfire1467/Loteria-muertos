// Tests para el sistema de Cantor
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CantorManager, CANTOR_PRESETS } from '../cantor'
import type { LoteriaCard } from '@/types'

// Mock de las cartas para testing
const mockCards: LoteriaCard[] = [
  { id: 1, name: 'La Muerte', image: '/test1.jpg', description: 'Test 1' },
  { id: 2, name: 'El Corazón', image: '/test2.jpg', description: 'Test 2' },
  { id: 3, name: 'La Rosa', image: '/test3.jpg', description: 'Test 3' }
]

// Mock del módulo de cartas antes de importar
vi.mock('@/data/loteriaCards', () => ({
  LOTERIA_CARDS: [
    { id: 1, name: 'La Muerte', image: '/test1.jpg', description: 'Test 1' },
    { id: 2, name: 'El Corazón', image: '/test2.jpg', description: 'Test 2' },
    { id: 3, name: 'La Rosa', image: '/test3.jpg', description: 'Test 3' }
  ]
}))

describe('CantorManager', () => {
  let cantor: CantorManager
  let onCardCalledSpy: ReturnType<typeof vi.fn>
  let onDeckFinishedSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    onCardCalledSpy = vi.fn()
    onDeckFinishedSpy = vi.fn()
    
    cantor = new CantorManager({
      cardInterval: 1000,
      shuffleCards: false, // Desactivar para tests predecibles
      repeatCards: false,
      onCardCalled: onCardCalledSpy,
      onDeckFinished: onDeckFinishedSpy
    })
  })

  afterEach(() => {
    cantor.destroy()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('Inicialización', () => {
    it('debe inicializarse con configuración por defecto', () => {
      const defaultCantor = new CantorManager()
      const config = defaultCantor.getConfig()
      
      expect(config.cardInterval).toBe(5000)
      expect(config.shuffleCards).toBe(true)
      expect(config.repeatCards).toBe(false)
      
      defaultCantor.destroy()
    })

    it('debe inicializarse con configuración personalizada', () => {
      const config = cantor.getConfig()
      
      expect(config.cardInterval).toBe(1000)
      expect(config.shuffleCards).toBe(false)
      expect(config.repeatCards).toBe(false)
    })

    it('debe tener el estado inicial correcto', () => {
      const state = cantor.getState()
      
      expect(state.isActive).toBe(false)
      expect(state.currentCard).toBe(null)
      expect(state.remainingCards).toHaveLength(mockCards.length)
      expect(state.calledCards).toHaveLength(0)
      expect(state.currentIndex).toBe(0)
      expect(state.intervalId).toBe(null)
    })
  })

  describe('Control de cantado', () => {
    it('debe iniciar el cantado correctamente', () => {
      const success = cantor.start()
      
      expect(success).toBe(true)
      expect(cantor.getState().isActive).toBe(true)
      expect(onCardCalledSpy).toHaveBeenCalledTimes(1)
      expect(onCardCalledSpy).toHaveBeenCalledWith(mockCards[0])
    })

    it('no debe permitir iniciar si ya está activo', () => {
      cantor.start()
      const success = cantor.start()
      
      expect(success).toBe(false)
    })

    it('debe detener el cantado correctamente', () => {
      cantor.start()
      cantor.stop()
      
      expect(cantor.getState().isActive).toBe(false)
      expect(cantor.getState().intervalId).toBe(null)
    })

    it('debe pausar y reanudar correctamente', () => {
      cantor.start()
      
      cantor.pause()
      expect(cantor.getState().intervalId).toBe(null)
      expect(cantor.getState().isActive).toBe(true)
      
      cantor.resume()
      expect(cantor.getState().intervalId).not.toBe(null)
    })
  })

  describe('Cantado de cartas', () => {
    it('debe cantar cartas en secuencia', () => {
      cantor.start()
      
      // Primera carta ya fue cantada al iniciar
      expect(cantor.getCurrentCard()).toEqual(mockCards[0])
      
      // Avanzar tiempo para la siguiente carta
      vi.advanceTimersByTime(1000)
      expect(onCardCalledSpy).toHaveBeenCalledTimes(2)
      expect(onCardCalledSpy).toHaveBeenLastCalledWith(mockCards[1])
      
      // Tercera carta
      vi.advanceTimersByTime(1000)
      expect(onCardCalledSpy).toHaveBeenCalledTimes(3)
      expect(onCardCalledSpy).toHaveBeenLastCalledWith(mockCards[2])
    })

    it('debe terminar cuando se acaben las cartas', () => {
      cantor.start()
      
      // Avanzar hasta que se acaben todas las cartas
      vi.advanceTimersByTime(3000)
      
      expect(onDeckFinishedSpy).toHaveBeenCalledTimes(1)
      expect(cantor.getState().isActive).toBe(false)
    })

    it('debe permitir cantar la siguiente carta manualmente', () => {
      const card = cantor.callNextCard()
      
      expect(card).toEqual(mockCards[0])
      expect(onCardCalledSpy).toHaveBeenCalledWith(mockCards[0])
      expect(cantor.getState().calledCards).toHaveLength(1)
      expect(cantor.getState().remainingCards).toHaveLength(2)
    })
  })

  describe('Estadísticas y estado', () => {
    it('debe proporcionar estadísticas correctas', () => {
      cantor.callNextCard()
      cantor.callNextCard()
      
      const stats = cantor.getStats()
      
      expect(stats.totalCards).toBe(mockCards.length)
      expect(stats.calledCards).toBe(2)
      expect(stats.remainingCards).toBe(1)
      expect(stats.progress).toBe((2 / mockCards.length) * 100)
      expect(stats.currentCard).toBe(mockCards[1].name)
    })

    it('debe verificar si una carta fue cantada', () => {
      cantor.callNextCard() // Canta la primera carta
      
      expect(cantor.wasCardCalled(1)).toBe(true)
      expect(cantor.wasCardCalled(2)).toBe(false)
    })

    it('debe proporcionar historial de cartas cantadas', () => {
      cantor.callNextCard()
      cantor.callNextCard()
      
      const calledCards = cantor.getCalledCards()
      expect(calledCards).toHaveLength(2)
      expect(calledCards[0]).toEqual(mockCards[0])
      expect(calledCards[1]).toEqual(mockCards[1])
    })

    it('debe proporcionar cartas restantes', () => {
      cantor.callNextCard()
      
      const remainingCards = cantor.getRemainingCards()
      expect(remainingCards).toHaveLength(2)
      expect(remainingCards[0]).toEqual(mockCards[1])
      expect(remainingCards[1]).toEqual(mockCards[2])
    })
  })

  describe('Configuración', () => {
    it('debe actualizar la configuración correctamente', () => {
      cantor.updateConfig({ cardInterval: 2000 })
      
      expect(cantor.getConfig().cardInterval).toBe(2000)
    })

    it('debe reiniciar si está activo al actualizar configuración', () => {
      cantor.start()
      const wasActive = cantor.getState().isActive
      
      cantor.updateConfig({ cardInterval: 2000 })
      
      expect(wasActive).toBe(true)
      expect(cantor.getState().isActive).toBe(true)
      expect(cantor.getConfig().cardInterval).toBe(2000)
    })
  })

  describe('Reset y limpieza', () => {
    it('debe reiniciar correctamente', () => {
      cantor.callNextCard()
      cantor.callNextCard()
      
      cantor.reset()
      
      const state = cantor.getState()
      expect(state.currentCard).toBe(null)
      expect(state.calledCards).toHaveLength(0)
      expect(state.remainingCards).toHaveLength(mockCards.length)
      expect(state.currentIndex).toBe(0)
    })

    it('debe destruir correctamente', () => {
      cantor.start()
      cantor.destroy()
      
      const state = cantor.getState()
      expect(state.isActive).toBe(false)
      expect(state.remainingCards).toHaveLength(0)
      expect(state.calledCards).toHaveLength(0)
      expect(state.currentCard).toBe(null)
    })
  })

  describe('Presets', () => {
    it('debe tener presets predefinidos', () => {
      expect(CANTOR_PRESETS.SLOW.cardInterval).toBe(8000)
      expect(CANTOR_PRESETS.NORMAL.cardInterval).toBe(5000)
      expect(CANTOR_PRESETS.FAST.cardInterval).toBe(3000)
      expect(CANTOR_PRESETS.RAPID.cardInterval).toBe(1500)
    })
  })
})