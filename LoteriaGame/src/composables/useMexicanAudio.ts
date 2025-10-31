/**
 * Composable useMexicanAudio - Hook de Vue para audio cultural mexicano
 * Proporciona una interfaz reactiva para el MexicanAudioManager
 */

import { ref, computed, onMounted } from 'vue'
import { mexicanAudioManager } from '@/utils/mexicanAudioManager'
import type { LoteriaCard } from '@/types'
import type { MexicanAudioTrack, CardNarration } from '@/utils/mexicanAudioManager'

export function useMexicanAudio() {
  const isPreloaded = ref(false)
  const currentMusicContext = ref<'menu' | 'gameplay' | 'victory' | null>(null)
  const availableMusic = ref<MexicanAudioTrack[]>([])
  const availableSounds = ref<string[]>([])

  // Estado computado
  const hasTraditionalMusic = computed(() => availableMusic.value.length > 0)
  const hasCulturalSounds = computed(() => availableSounds.value.length > 0)

  /**
   * Inicializa el sistema de audio mexicano
   */
  const initMexicanAudio = async (): Promise<void> => {
    try {
      await mexicanAudioManager.preloadCulturalAudio()
      availableMusic.value = mexicanAudioManager.getAvailableMusic()
      availableSounds.value = mexicanAudioManager.getAvailableCulturalSounds()
      isPreloaded.value = true
      console.log('🇲🇽 Sistema de audio mexicano inicializado')
    } catch (error) {
      console.error('Error inicializando audio mexicano:', error)
    }
  }

  /**
   * Reproduce música tradicional mexicana
   */
  const playTraditionalMusic = async (context: 'menu' | 'gameplay' | 'victory', shuffle = true): Promise<void> => {
    await mexicanAudioManager.playTraditionalMusic(context, shuffle)
    currentMusicContext.value = context
  }

  /**
   * Cambia el contexto musical
   */
  const switchMusicContext = async (newContext: 'menu' | 'gameplay' | 'victory'): Promise<void> => {
    if (currentMusicContext.value !== newContext) {
      await mexicanAudioManager.switchMusicContext(newContext)
      currentMusicContext.value = newContext
    }
  }

  /**
   * Reproduce la narración completa de una carta
   */
  const narrateCard = async (card: LoteriaCard): Promise<void> => {
    await mexicanAudioManager.playFullCardNarration(card)
  }

  /**
   * Reproduce solo el nombre de la carta
   */
  const playCardName = async (cardId: number): Promise<void> => {
    await mexicanAudioManager.playCardNarration(cardId, false)
  }

  /**
   * Reproduce la narración completa (nombre + frase)
   */
  const playFullCardNarration = async (cardId: number): Promise<void> => {
    await mexicanAudioManager.playCardNarration(cardId, true)
  }

  /**
   * Reproduce sonidos culturales específicos
   */
  const playCulturalSound = async (soundId: string, volume = 0.8): Promise<void> => {
    await mexicanAudioManager.playCulturalSound(soundId, volume)
  }

  /**
   * Efectos de sonido predefinidos para eventos del juego
   */
  const gameAudioEffects = {
    // Llamadas de lotería
    callLoteria: () => mexicanAudioManager.playLoteriaCall(),
    
    // Marcado de cartas
    markCard: () => mexicanAudioManager.playCardMarked(),
    
    // Celebraciones
    celebrate: () => mexicanAudioManager.playFullCelebration(),
    victory: () => mexicanAudioManager.playVictoryCelebration(),
    
    // Instrumentos tradicionales
    playTrumpet: () => mexicanAudioManager.playInstrumentEffect('trumpet'),
    playGuitar: () => mexicanAudioManager.playInstrumentEffect('guitar'),
    playMaracas: () => mexicanAudioManager.playInstrumentEffect('maracas'),
    
    // Sonidos ambientales
    windSounds: () => mexicanAudioManager.playAmbientSounds('wind'),
    candleFlicker: () => mexicanAudioManager.playAmbientSounds('candles'),
    incenseSmoke: () => mexicanAudioManager.playAmbientSounds('incense'),
    churchBells: () => mexicanAudioManager.playAmbientSounds('bells')
  }

  /**
   * Funciones de música contextual
   */
  const musicContexts = {
    // Música de menú principal
    playMenuMusic: () => playTraditionalMusic('menu', true),
    
    // Música durante el juego
    playGameplayMusic: () => playTraditionalMusic('gameplay', true),
    
    // Música de victoria
    playVictoryMusic: () => playTraditionalMusic('victory', false),
    
    // Cambio automático de contexto
    switchToMenu: () => switchMusicContext('menu'),
    switchToGameplay: () => switchMusicContext('gameplay'),
    switchToVictory: () => switchMusicContext('victory')
  }

  /**
   * Obtiene información de narración de una carta
   */
  const getCardNarrationInfo = (cardId: number): CardNarration | undefined => {
    return mexicanAudioManager.getCardNarrationInfo(cardId)
  }

  /**
   * Reproduce una secuencia de audio para el inicio del juego
   */
  const playGameStartSequence = async (): Promise<void> => {
    console.log('🎮 Iniciando secuencia de audio de inicio de juego')
    
    // 1. Cambiar a música de juego
    await switchMusicContext('gameplay')
    
    // 2. Sonido de campanas
    setTimeout(() => gameAudioEffects.churchBells(), 1000)
    
    // 3. Grito de inicio
    setTimeout(() => playCulturalSound('grito-mexicano', 0.8), 2000)
    
    // 4. Llamada de lotería
    setTimeout(() => gameAudioEffects.callLoteria(), 3500)
  }

  /**
   * Reproduce una secuencia de audio para el final del juego
   */
  const playGameEndSequence = async (isVictory: boolean): Promise<void> => {
    console.log(`🏁 Iniciando secuencia de audio de fin de juego (Victoria: ${isVictory})`)
    
    if (isVictory) {
      await gameAudioEffects.victory()
    } else {
      // Sonido de derrota más suave
      await playCulturalSound('church-bell', 0.6)
      setTimeout(() => switchMusicContext('menu'), 2000)
    }
  }

  /**
   * Reproduce efectos ambientales aleatorios
   */
  const playRandomAmbientEffect = (): void => {
    const ambientEffects = [
      gameAudioEffects.windSounds,
      gameAudioEffects.candleFlicker,
      gameAudioEffects.incenseSmoke
    ]
    
    const randomEffect = ambientEffects[Math.floor(Math.random() * ambientEffects.length)]
    randomEffect()
  }

  /**
   * Reproduce un instrumento tradicional aleatorio
   */
  const playRandomInstrument = (): void => {
    const instruments = [
      gameAudioEffects.playTrumpet,
      gameAudioEffects.playGuitar,
      gameAudioEffects.playMaracas
    ]
    
    const randomInstrument = instruments[Math.floor(Math.random() * instruments.length)]
    randomInstrument()
  }

  /**
   * Crea una atmósfera ambiental del Día de Muertos
   */
  const createDayOfTheDeadAmbience = (): void => {
    // Reproducir efectos ambientales cada cierto tiempo
    const ambientInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% de probabilidad
        playRandomAmbientEffect()
      }
    }, 15000) // Cada 15 segundos

    // Limpiar el intervalo después de 5 minutos
    setTimeout(() => {
      clearInterval(ambientInterval)
    }, 300000)
  }

  /**
   * Reproduce celebración cuando un bot marca una carta
   */
  const playBotCelebration = async (): Promise<void> => {
    // Sonido suave de marcado
    await gameAudioEffects.markCard()
    
    // Ocasionalmente agregar un instrumento
    if (Math.random() < 0.2) { // 20% de probabilidad
      setTimeout(() => playRandomInstrument(), 500)
    }
  }

  /**
   * Reproduce celebración cuando el jugador humano marca una carta
   */
  const playPlayerCelebration = async (): Promise<void> => {
    // Sonido más prominente para el jugador
    await gameAudioEffects.markCard()
    
    // Más probabilidad de instrumento para el jugador
    if (Math.random() < 0.4) { // 40% de probabilidad
      setTimeout(() => playRandomInstrument(), 300)
    }
  }

  /**
   * Obtiene estadísticas del sistema de audio mexicano
   */
  const getAudioStats = () => {
    return {
      isPreloaded: isPreloaded.value,
      currentMusicContext: currentMusicContext.value,
      availableMusicTracks: availableMusic.value.length,
      availableSounds: availableSounds.value.length,
      hasTraditionalMusic: hasTraditionalMusic.value,
      hasCulturalSounds: hasCulturalSounds.value
    }
  }

  // Inicialización automática
  onMounted(() => {
    // Cargar información disponible sin precargar audio
    availableMusic.value = mexicanAudioManager.getAvailableMusic()
    availableSounds.value = mexicanAudioManager.getAvailableCulturalSounds()
  })

  return {
    // Estado reactivo
    isPreloaded,
    currentMusicContext,
    availableMusic,
    availableSounds,
    hasTraditionalMusic,
    hasCulturalSounds,

    // Inicialización
    initMexicanAudio,

    // Música tradicional
    playTraditionalMusic,
    switchMusicContext,
    ...musicContexts,

    // Narración de cartas
    narrateCard,
    playCardName,
    playFullCardNarration,
    getCardNarrationInfo,

    // Efectos culturales
    playCulturalSound,
    ...gameAudioEffects,

    // Secuencias de juego
    playGameStartSequence,
    playGameEndSequence,
    createDayOfTheDeadAmbience,

    // Celebraciones específicas
    playBotCelebration,
    playPlayerCelebration,

    // Efectos aleatorios
    playRandomAmbientEffect,
    playRandomInstrument,

    // Utilidades
    getAudioStats
  }
}