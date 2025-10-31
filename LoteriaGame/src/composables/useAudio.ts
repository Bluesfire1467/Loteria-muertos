/**
 * Composable useAudio - Hook de Vue para gestión de audio
 * Proporciona una interfaz reactiva para el AudioManager
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { audioManager } from '@/utils/audioManager'
import type { AudioSettings } from '@/types'

export function useAudio() {
  const isInitialized = ref(false)
  const settings = ref<AudioSettings>(audioManager.getSettings())
  const isMusicPlaying = ref(false)
  
  // Estado reactivo del audio
  const isEnabled = computed(() => settings.value.enabled)
  const masterVolume = computed(() => settings.value.masterVolume)
  const musicVolume = computed(() => settings.value.musicVolume)
  const sfxVolume = computed(() => settings.value.sfxVolume)

  /**
   * Inicializa el sistema de audio
   */
  const initAudio = async (): Promise<void> => {
    try {
      await audioManager.enableAudio()
      isInitialized.value = true
      updateStatus()
    } catch (error) {
      console.error('Error inicializando audio:', error)
    }
  }

  /**
   * Reproduce música de fondo
   */
  const playBackgroundMusic = async (trackId: string, src: string, loop = true): Promise<void> => {
    await audioManager.playBackgroundMusic(trackId, src, loop)
    updateStatus()
  }

  /**
   * Detiene la música de fondo
   */
  const stopBackgroundMusic = (): void => {
    audioManager.stopBackgroundMusic()
    updateStatus()
  }

  /**
   * Pausa/reanuda la música de fondo
   */
  const toggleBackgroundMusic = (): void => {
    audioManager.toggleBackgroundMusic()
    updateStatus()
  }

  /**
   * Reproduce un efecto de sonido
   */
  const playSoundEffect = async (effectId: string, src: string, volume = 1): Promise<void> => {
    await audioManager.playSoundEffect(effectId, src, volume)
  }

  /**
   * Reproduce narración de voz
   */
  const playVoice = async (voiceId: string, src: string, volume = 1): Promise<void> => {
    await audioManager.playVoice(voiceId, src, volume)
  }

  /**
   * Precarga archivos de audio
   */
  const preloadAudio = async (trackId: string, src: string, category: 'music' | 'sfx' | 'voice' = 'sfx'): Promise<void> => {
    await audioManager.preloadAudio(trackId, src, category)
  }

  /**
   * Actualiza la configuración de audio
   */
  const updateAudioSettings = (newSettings: Partial<AudioSettings>): void => {
    audioManager.updateSettings(newSettings)
    settings.value = audioManager.getSettings()
  }

  /**
   * Cambia el volumen maestro
   */
  const setMasterVolume = (volume: number): void => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    updateAudioSettings({ masterVolume: clampedVolume })
  }

  /**
   * Cambia el volumen de la música
   */
  const setMusicVolume = (volume: number): void => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    updateAudioSettings({ musicVolume: clampedVolume })
  }

  /**
   * Cambia el volumen de efectos de sonido
   */
  const setSfxVolume = (volume: number): void => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    updateAudioSettings({ sfxVolume: clampedVolume })
  }

  /**
   * Silencia/activa todo el audio
   */
  const toggleMute = (): void => {
    audioManager.toggleMute()
    settings.value = audioManager.getSettings()
    updateStatus()
  }

  /**
   * Habilita/deshabilita el audio
   */
  const toggleAudio = (): void => {
    updateAudioSettings({ enabled: !settings.value.enabled })
  }

  /**
   * Actualiza el estado interno
   */
  const updateStatus = (): void => {
    const status = audioManager.getStatus()
    isInitialized.value = status.isInitialized
    isMusicPlaying.value = status.musicPlaying
    settings.value = status.settings
  }

  /**
   * Obtiene el estado completo del audio
   */
  const getAudioStatus = () => {
    return audioManager.getStatus()
  }

  // Efectos de sonido predefinidos para el juego
  const gameAudioEffects = {
    // Efectos de interfaz
    cardClick: '/audio/sfx/card-click.mp3',
    cardMark: '/audio/sfx/card-mark.mp3',
    cardError: '/audio/sfx/card-error.mp3',
    
    // Efectos de juego
    gameStart: '/audio/sfx/game-start.mp3',
    gameWin: '/audio/sfx/game-win.mp3',
    gameLose: '/audio/sfx/game-lose.mp3',
    
    // Efectos de logros
    achievementUnlock: '/audio/sfx/achievement-unlock.mp3',
    
    // Efectos de bots
    botCelebration: '/audio/sfx/bot-celebration.mp3',
    botMark: '/audio/sfx/bot-mark.mp3'
  }

  // Música de fondo predefinida
  const gameBackgroundMusic = {
    menu: '/audio/music/menu-background.mp3',
    gameplay: '/audio/music/gameplay-background.mp3',
    victory: '/audio/music/victory-theme.mp3'
  }

  // Narración de cartas en español
  const cardVoices = {
    // Se generarán dinámicamente basado en las cartas disponibles
    getCardVoice: (cardName: string) => `/audio/voices/cards/${cardName.toLowerCase().replace(/\s+/g, '-')}.mp3`
  }

  /**
   * Funciones de conveniencia para efectos comunes del juego
   */
  const playCardClick = () => playSoundEffect('cardClick', gameAudioEffects.cardClick, 0.6)
  const playCardMark = () => playSoundEffect('cardMark', gameAudioEffects.cardMark, 0.8)
  const playCardError = () => playSoundEffect('cardError', gameAudioEffects.cardError, 0.7)
  const playGameStart = () => playSoundEffect('gameStart', gameAudioEffects.gameStart, 0.9)
  const playGameWin = () => playSoundEffect('gameWin', gameAudioEffects.gameWin, 1.0)
  const playGameLose = () => playSoundEffect('gameLose', gameAudioEffects.gameLose, 0.8)
  const playAchievementUnlock = () => playSoundEffect('achievementUnlock', gameAudioEffects.achievementUnlock, 0.9)
  const playBotCelebration = () => playSoundEffect('botCelebration', gameAudioEffects.botCelebration, 0.7)
  const playBotMark = () => playSoundEffect('botMark', gameAudioEffects.botMark, 0.5)

  /**
   * Reproduce la narración de una carta
   */
  const playCardVoice = async (cardName: string): Promise<void> => {
    const voiceSrc = cardVoices.getCardVoice(cardName)
    await playVoice(`card-${cardName}`, voiceSrc, 0.9)
  }

  /**
   * Inicia la música de fondo del menú
   */
  const playMenuMusic = () => playBackgroundMusic('menu', gameBackgroundMusic.menu, true)

  /**
   * Inicia la música de fondo del juego
   */
  const playGameplayMusic = () => playBackgroundMusic('gameplay', gameBackgroundMusic.gameplay, true)

  /**
   * Inicia la música de victoria
   */
  const playVictoryMusic = () => playBackgroundMusic('victory', gameBackgroundMusic.victory, false)

  /**
   * Precarga todos los efectos de sonido esenciales
   */
  const preloadGameAudio = async (): Promise<void> => {
    const preloadPromises = [
      // Efectos de sonido
      ...Object.entries(gameAudioEffects).map(([id, src]) => 
        preloadAudio(id, src, 'sfx')
      ),
      
      // Música de fondo
      ...Object.entries(gameBackgroundMusic).map(([id, src]) => 
        preloadAudio(id, src, 'music')
      )
    ]

    try {
      await Promise.allSettled(preloadPromises)
      console.log('Audio del juego precargado exitosamente')
    } catch (error) {
      console.warn('Algunos archivos de audio no se pudieron precargar:', error)
    }
  }

  // Inicialización y limpieza
  onMounted(() => {
    updateStatus()
  })

  onUnmounted(() => {
    // No llamamos dispose aquí porque el audioManager es singleton
    // y puede ser usado por otros componentes
  })

  return {
    // Estado reactivo
    isInitialized,
    isEnabled,
    isMusicPlaying,
    settings,
    masterVolume,
    musicVolume,
    sfxVolume,

    // Métodos principales
    initAudio,
    playBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    playSoundEffect,
    playVoice,
    preloadAudio,

    // Configuración
    updateAudioSettings,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    toggleMute,
    toggleAudio,

    // Estado y utilidades
    updateStatus,
    getAudioStatus,

    // Efectos predefinidos del juego
    playCardClick,
    playCardMark,
    playCardError,
    playGameStart,
    playGameWin,
    playGameLose,
    playAchievementUnlock,
    playBotCelebration,
    playBotMark,
    playCardVoice,

    // Música predefinida
    playMenuMusic,
    playGameplayMusic,
    playVictoryMusic,

    // Precarga
    preloadGameAudio,

    // Referencias a los recursos
    gameAudioEffects,
    gameBackgroundMusic,
    cardVoices
  }
}