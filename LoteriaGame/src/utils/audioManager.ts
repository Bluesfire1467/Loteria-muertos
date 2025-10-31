/**
 * AudioManager - Sistema de gestión de audio para Lotería Día de Muertos
 * Maneja música de fondo, efectos de sonido y controles de volumen
 */

import type { AudioSettings } from '@/types'
import { audioSynthesizer } from './audioSynthesizer'

export interface AudioTrack {
  id: string
  src: string
  volume: number
  loop: boolean
  category: 'music' | 'sfx' | 'voice'
}

export interface AudioManagerOptions {
  audioSettings?: Partial<AudioSettings>
  preloadAudio?: boolean
}

export class AudioManager {
  private audioContext: AudioContext | null = null
  private musicAudio: HTMLAudioElement | null = null
  private sfxAudios: Map<string, HTMLAudioElement> = new Map()
  private voiceAudios: Map<string, HTMLAudioElement> = new Map()
  private settings: AudioSettings
  private isInitialized = false
  private preloadedTracks: Set<string> = new Set()

  constructor(options: AudioManagerOptions = {}) {
    this.settings = {
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      enabled: true,
      ...options.audioSettings
    }

    // Inicializar AudioContext cuando sea necesario
    this.initializeAudioContext()
  }

  /**
   * Inicializa el AudioContext (requiere interacción del usuario)
   */
  private async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Reanudar el contexto si está suspendido
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
      
      this.isInitialized = true
    } catch (error) {
      console.warn('AudioContext no disponible:', error)
      this.isInitialized = false
    }
  }

  /**
   * Activa el audio después de la primera interacción del usuario
   */
  async enableAudio(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeAudioContext()
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    
    this.settings.enabled = true
  }

  /**
   * Reproduce música de fondo
   */
  async playBackgroundMusic(trackId: string, src: string, loop = true): Promise<void> {
    if (!this.settings.enabled) return

    try {
      // Detener música anterior si existe
      if (this.musicAudio) {
        this.musicAudio.pause()
        this.musicAudio.currentTime = 0
      }

      this.musicAudio = new Audio(src)
      this.musicAudio.loop = loop
      this.musicAudio.volume = this.settings.musicVolume * this.settings.masterVolume
      
      // Manejar errores de carga
      this.musicAudio.addEventListener('error', (e) => {
        console.error(`Error cargando música ${trackId}:`, e)
      })

      await this.musicAudio.play()
    } catch (error) {
      console.error(`Error reproduciendo música ${trackId}:`, error)
    }
  }

  /**
   * Detiene la música de fondo
   */
  stopBackgroundMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause()
      this.musicAudio.currentTime = 0
    }
  }

  /**
   * Pausa/reanuda la música de fondo
   */
  toggleBackgroundMusic(): void {
    if (!this.musicAudio) return

    if (this.musicAudio.paused) {
      this.musicAudio.play().catch(console.error)
    } else {
      this.musicAudio.pause()
    }
  }

  /**
   * Reproduce un efecto de sonido
   */
  async playSoundEffect(effectId: string, src: string, volume = 1): Promise<void> {
    if (!this.settings.enabled) return

    try {
      let audio = this.sfxAudios.get(effectId)
      
      if (!audio) {
        audio = new Audio(src)
        this.sfxAudios.set(effectId, audio)
        
        // Manejar errores de carga con fallback sintético
        audio.addEventListener('error', () => {
          console.warn(`Archivo de audio no encontrado: ${effectId}, usando sonido sintético`)
          this.playSyntheticSound(effectId, volume)
        })
      }

      // Reiniciar el audio si ya se está reproduciendo
      audio.currentTime = 0
      audio.volume = volume * this.settings.sfxVolume * this.settings.masterVolume
      
      await audio.play()
    } catch (error) {
      console.warn(`Error reproduciendo efecto ${effectId}, usando fallback sintético:`, error)
      this.playSyntheticSound(effectId, volume)
    }
  }

  /**
   * Reproduce un sonido sintético como fallback
   */
  private playSyntheticSound(effectId: string, _volume: number): void {
    if (!audioSynthesizer.isAvailable()) return

    // Mapear IDs de efectos a sonidos sintéticos
    switch (effectId) {
      case 'cardClick':
      case 'card-click':
        audioSynthesizer.playClickSound()
        break
      case 'cardMark':
      case 'card-mark':
      case 'carta-marcada':
        audioSynthesizer.playCardMarkSound()
        break
      case 'cardError':
      case 'card-error':
        audioSynthesizer.playErrorSound()
        break
      case 'gameWin':
      case 'game-win':
      case 'victoria-grito':
        audioSynthesizer.playVictorySound()
        break
      case 'church-bell':
      case 'churchBells':
        audioSynthesizer.playBellSound()
        break
      case 'mariachi-trumpet':
        audioSynthesizer.playTrumpetSound()
        break
      case 'guitar-strum':
        audioSynthesizer.playGuitarSound()
        break
      case 'maracas-shake':
        audioSynthesizer.playMaracasSound()
        break
      case 'grito-mexicano':
        audioSynthesizer.playGritoSound()
        break
      default:
        // Sonido genérico para efectos no mapeados
        audioSynthesizer.playClickSound()
        break
    }
  }

  /**
   * Reproduce narración de voz
   */
  async playVoice(voiceId: string, src: string, volume = 1): Promise<void> {
    if (!this.settings.enabled) return

    try {
      // Detener narración anterior si existe
      this.voiceAudios.forEach(audio => {
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = 0
        }
      })

      let audio = this.voiceAudios.get(voiceId)
      
      if (!audio) {
        audio = new Audio(src)
        this.voiceAudios.set(voiceId, audio)
        
        // Manejar errores de carga
        audio.addEventListener('error', (e) => {
          console.error(`Error cargando voz ${voiceId}:`, e)
        })
      }

      audio.currentTime = 0
      audio.volume = volume * this.settings.masterVolume
      
      await audio.play()
    } catch (error) {
      console.error(`Error reproduciendo voz ${voiceId}:`, error)
    }
  }

  /**
   * Precarga un archivo de audio
   */
  async preloadAudio(trackId: string, src: string, category: 'music' | 'sfx' | 'voice' = 'sfx'): Promise<void> {
    if (this.preloadedTracks.has(trackId)) return

    try {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = src

      return new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => {
          this.preloadedTracks.add(trackId)
          
          // Almacenar según categoría
          switch (category) {
            case 'sfx':
              this.sfxAudios.set(trackId, audio)
              break
            case 'voice':
              this.voiceAudios.set(trackId, audio)
              break
            case 'music':
              // La música se maneja diferente, solo marcamos como precargada
              break
          }
          
          resolve()
        })

        audio.addEventListener('error', reject)
        
        // Timeout para evitar bloqueos
        setTimeout(() => {
          reject(new Error(`Timeout precargando ${trackId}`))
        }, 10000)
      })
    } catch (error) {
      console.error(`Error precargando audio ${trackId}:`, error)
    }
  }

  /**
   * Actualiza la configuración de audio
   */
  updateSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    
    // Aplicar nuevos volúmenes
    if (this.musicAudio) {
      this.musicAudio.volume = this.settings.musicVolume * this.settings.masterVolume
    }
    
    this.sfxAudios.forEach(audio => {
      audio.volume = this.settings.sfxVolume * this.settings.masterVolume
    })
  }

  /**
   * Obtiene la configuración actual
   */
  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  /**
   * Silencia/activa todo el audio
   */
  toggleMute(): void {
    this.settings.enabled = !this.settings.enabled
    
    if (!this.settings.enabled) {
      // Pausar toda la música y efectos
      if (this.musicAudio && !this.musicAudio.paused) {
        this.musicAudio.pause()
      }
      
      this.sfxAudios.forEach(audio => {
        if (!audio.paused) {
          audio.pause()
        }
      })
      
      this.voiceAudios.forEach(audio => {
        if (!audio.paused) {
          audio.pause()
        }
      })
    }
  }

  /**
   * Limpia todos los recursos de audio
   */
  dispose(): void {
    this.stopBackgroundMusic()
    
    this.sfxAudios.forEach(audio => {
      audio.pause()
      audio.src = ''
    })
    
    this.voiceAudios.forEach(audio => {
      audio.pause()
      audio.src = ''
    })
    
    this.sfxAudios.clear()
    this.voiceAudios.clear()
    this.preloadedTracks.clear()
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  /**
   * Verifica si el audio está disponible
   */
  isAudioAvailable(): boolean {
    return this.isInitialized && this.settings.enabled
  }

  /**
   * Obtiene información del estado actual
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      enabled: this.settings.enabled,
      musicPlaying: this.musicAudio ? !this.musicAudio.paused : false,
      preloadedTracks: Array.from(this.preloadedTracks),
      settings: this.settings
    }
  }
}

// Instancia singleton del AudioManager
export const audioManager = new AudioManager()

// Función de utilidad para inicializar el audio después de la primera interacción
export const initializeAudio = async (): Promise<void> => {
  await audioManager.enableAudio()
}