/**
 * MexicanAudioManager - Sistema de audio cultural mexicano para Lotería Día de Muertos
 * Maneja música tradicional, efectos temáticos y narración en español
 */

import { audioManager } from './audioManager'
import { audioSynthesizer } from './audioSynthesizer'
import { LOTERIA_CARDS } from '@/data/loteriaCards'
import type { LoteriaCard } from '@/types'

export interface MexicanAudioTrack {
  id: string
  name: string
  src: string
  category: 'traditional' | 'mariachi' | 'folk' | 'ambient'
  description: string
  duration?: number
}

export interface CardNarration {
  cardId: number
  cardName: string
  phrase: string
  audioSrc: string
  culturalContext?: string
}

export class MexicanAudioManager {
  private traditionalMusic: Map<string, MexicanAudioTrack> = new Map()
  private cardNarrations: Map<number, CardNarration> = new Map()
  private culturalSounds: Map<string, string> = new Map()
  private currentMusicCategory: string | null = null

  constructor() {
    this.initializeTraditionalMusic()
    this.initializeCardNarrations()
    this.initializeCulturalSounds()
  }

  /**
   * Inicializa la música tradicional mexicana
   */
  private initializeTraditionalMusic(): void {
    const traditionalTracks: MexicanAudioTrack[] = [
      // Música de menú - Ambiente festivo
      {
        id: 'menu-jarabe-tapatio',
        name: 'Jarabe Tapatío (Instrumental)',
        src: '/audio/music/traditional/jarabe-tapatio-instrumental.mp3',
        category: 'mariachi',
        description: 'Versión instrumental del famoso jarabe tapatío para el menú principal',
        duration: 180
      },
      {
        id: 'menu-la-llorona',
        name: 'La Llorona (Ambiente)',
        src: '/audio/music/traditional/la-llorona-ambient.mp3',
        category: 'folk',
        description: 'Versión ambiental de La Llorona para crear atmósfera del Día de Muertos',
        duration: 240
      },

      // Música de juego - Ritmos suaves
      {
        id: 'gameplay-cielito-lindo',
        name: 'Cielito Lindo (Suave)',
        src: '/audio/music/traditional/cielito-lindo-soft.mp3',
        category: 'traditional',
        description: 'Versión suave de Cielito Lindo para acompañar el juego',
        duration: 200
      },
      {
        id: 'gameplay-las-mañanitas',
        name: 'Las Mañanitas (Instrumental)',
        src: '/audio/music/traditional/las-mananitas-instrumental.mp3',
        category: 'traditional',
        description: 'Las Mañanitas instrumental para celebrar victorias',
        duration: 150
      },
      {
        id: 'gameplay-dia-muertos-ambient',
        name: 'Día de Muertos (Ambiental)',
        src: '/audio/music/traditional/dia-muertos-ambient.mp3',
        category: 'ambient',
        description: 'Música ambiental específica del Día de Muertos',
        duration: 300
      },

      // Música de victoria - Celebración
      {
        id: 'victory-mariachi-celebration',
        name: 'Celebración Mariachi',
        src: '/audio/music/traditional/mariachi-celebration.mp3',
        category: 'mariachi',
        description: 'Mariachi festivo para celebrar victorias',
        duration: 120
      },
      {
        id: 'victory-viva-mexico',
        name: '¡Viva México!',
        src: '/audio/music/traditional/viva-mexico.mp3',
        category: 'mariachi',
        description: 'Grito de celebración mexicana',
        duration: 90
      }
    ]

    traditionalTracks.forEach(track => {
      this.traditionalMusic.set(track.id, track)
    })
  }

  /**
   * Inicializa las narraciones de cartas en español
   */
  private initializeCardNarrations(): void {
    const narrations: CardNarration[] = LOTERIA_CARDS.map(card => ({
      cardId: card.id,
      cardName: card.name,
      phrase: card.description,
      audioSrc: `/audio/voices/cards/${this.getCardAudioFileName(card.name)}.mp3`,
      culturalContext: card.culturalSignificance
    }))

    narrations.forEach(narration => {
      this.cardNarrations.set(narration.cardId, narration)
    })
  }

  /**
   * Inicializa sonidos culturales temáticos
   */
  private initializeCulturalSounds(): void {
    const culturalSounds = new Map([
      // Instrumentos tradicionales
      ['mariachi-trumpet', '/audio/sfx/cultural/mariachi-trumpet.mp3'],
      ['guitar-strum', '/audio/sfx/cultural/guitar-strum.mp3'],
      ['maracas-shake', '/audio/sfx/cultural/maracas-shake.mp3'],
      ['church-bell', '/audio/sfx/cultural/church-bell.mp3'],
      
      // Sonidos ambientales del Día de Muertos
      ['papel-picado-wind', '/audio/sfx/cultural/papel-picado-wind.mp3'],
      ['candle-flicker', '/audio/sfx/cultural/candle-flicker.mp3'],
      ['copal-incense', '/audio/sfx/cultural/copal-incense.mp3'],
      
      // Celebraciones
      ['grito-mexicano', '/audio/sfx/cultural/grito-mexicano.mp3'],
      ['applause-mariachi', '/audio/sfx/cultural/applause-mariachi.mp3'],
      ['fiesta-whistle', '/audio/sfx/cultural/fiesta-whistle.mp3'],
      
      // Efectos específicos del juego
      ['loteria-call', '/audio/sfx/cultural/loteria-call.mp3'],
      ['carta-marcada', '/audio/sfx/cultural/carta-marcada.mp3'],
      ['victoria-grito', '/audio/sfx/cultural/victoria-grito.mp3']
    ])

    this.culturalSounds = culturalSounds
  }

  /**
   * Convierte el nombre de carta a nombre de archivo de audio
   */
  private getCardAudioFileName(cardName: string): string {
    return cardName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9-]/g, '')
  }

  /**
   * Reproduce música tradicional mexicana de fondo
   */
  async playTraditionalMusic(context: 'menu' | 'gameplay' | 'victory', shuffle = true): Promise<void> {
    const contextTracks = Array.from(this.traditionalMusic.values())
      .filter(track => {
        switch (context) {
          case 'menu':
            return track.id.startsWith('menu-')
          case 'gameplay':
            return track.id.startsWith('gameplay-')
          case 'victory':
            return track.id.startsWith('victory-')
          default:
            return false
        }
      })

    if (contextTracks.length === 0) {
      console.warn(`No se encontraron pistas para el contexto: ${context}`)
      return
    }

    const selectedTrack = shuffle 
      ? contextTracks[Math.floor(Math.random() * contextTracks.length)]
      : contextTracks[0]

    this.currentMusicCategory = context
    await audioManager.playBackgroundMusic(selectedTrack.id, selectedTrack.src, true)
    
    console.log(`🎵 Reproduciendo música tradicional: ${selectedTrack.name}`)
  }

  /**
   * Reproduce la narración de una carta en español
   */
  async playCardNarration(cardId: number, includePhrase = true): Promise<void> {
    const narration = this.cardNarrations.get(cardId)
    if (!narration) {
      console.warn(`No se encontró narración para la carta ID: ${cardId}`)
      return
    }

    try {
      // Intentar reproducir el nombre de la carta
      await audioManager.playVoice(`card-${cardId}`, narration.audioSrc, 0.9)
      
      // Si se incluye la frase, reproducirla después de una pausa
      if (includePhrase) {
        setTimeout(async () => {
          const phraseAudioSrc = `/audio/voices/phrases/${this.getCardAudioFileName(narration.phrase)}.mp3`
          try {
            await audioManager.playVoice(`phrase-${cardId}`, phraseAudioSrc, 0.8)
          } catch (error) {
            console.warn(`Frase de audio no disponible para carta ${cardId}, usando sonido sintético`)
            // Usar un sonido sintético como indicador
            audioSynthesizer.playBellSound()
          }
        }, 1500) // Pausa de 1.5 segundos entre nombre y frase
      }

      console.log(`🗣️ Narrando carta: ${narration.cardName} - "${narration.phrase}"`)
    } catch (error) {
      console.warn(`Narración de audio no disponible para carta ${cardId}, usando fallback visual`)
      // En lugar de audio, podríamos mostrar el texto en pantalla
      this.showCardTextFallback(narration)
    }
  }

  /**
   * Muestra el texto de la carta como fallback cuando no hay audio
   */
  private showCardTextFallback(narration: CardNarration): void {
    // Crear una notificación visual temporal
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 107, 53, 0.95);
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 2px solid #FFD23F;
      animation: fadeInOut 3s ease-in-out;
    `
    
    notification.innerHTML = `
      <div style="font-size: 1.8rem; margin-bottom: 8px;">${narration.cardName}</div>
      <div style="font-size: 1.2rem; font-style: italic; opacity: 0.9;">"${narration.phrase}"</div>
    `

    // Agregar animación CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(notification)

    // Remover después de la animación
    setTimeout(() => {
      document.body.removeChild(notification)
      document.head.removeChild(style)
    }, 3000)

    // Reproducir un sonido sintético para acompañar
    audioSynthesizer.playBellSound()
    
    console.log(`📝 Mostrando texto de carta como fallback: ${narration.cardName}`)
  }

  /**
   * Reproduce un sonido cultural específico
   */
  async playCulturalSound(soundId: string, volume = 0.8): Promise<void> {
    const soundSrc = this.culturalSounds.get(soundId)
    if (!soundSrc) {
      console.warn(`Sonido cultural no encontrado: ${soundId}, usando fallback sintético`)
      this.playSyntheticCulturalSound(soundId)
      return
    }

    try {
      await audioManager.playSoundEffect(soundId, soundSrc, volume)
      console.log(`🔔 Reproduciendo sonido cultural: ${soundId}`)
    } catch (error) {
      console.warn(`Error reproduciendo sonido cultural ${soundId}, usando fallback:`, error)
      this.playSyntheticCulturalSound(soundId)
    }
  }

  /**
   * Reproduce un sonido cultural sintético como fallback
   */
  private playSyntheticCulturalSound(soundId: string): void {
    if (!audioSynthesizer.isAvailable()) {
      console.log(`🔇 Audio sintético no disponible para: ${soundId}`)
      return
    }

    console.log(`🎵 Reproduciendo sonido sintético para: ${soundId}`)
    
    switch (soundId) {
      case 'mariachi-trumpet':
        audioSynthesizer.playTrumpetSound()
        break
      case 'guitar-strum':
        audioSynthesizer.playGuitarSound()
        break
      case 'maracas-shake':
        audioSynthesizer.playMaracasSound()
        break
      case 'church-bell':
        audioSynthesizer.playBellSound()
        break
      case 'grito-mexicano':
        audioSynthesizer.playGritoSound()
        break
      case 'loteria-call':
        audioSynthesizer.playGritoSound()
        break
      case 'carta-marcada':
        audioSynthesizer.playCardMarkSound()
        break
      case 'victoria-grito':
        audioSynthesizer.playVictorySound()
        break
      default:
        // Sonido genérico para efectos no mapeados
        audioSynthesizer.playClickSound()
        break
    }
  }

  /**
   * Reproduce el grito tradicional de "¡Lotería!"
   */
  async playLoteriaCall(): Promise<void> {
    await this.playCulturalSound('loteria-call', 1.0)
  }

  /**
   * Reproduce sonido cuando se marca una carta
   */
  async playCardMarked(): Promise<void> {
    await this.playCulturalSound('carta-marcada', 0.7)
  }

  /**
   * Reproduce celebración de victoria con grito mexicano
   */
  async playVictoryCelebration(): Promise<void> {
    // Reproducir grito de victoria
    await this.playCulturalSound('victoria-grito', 1.0)
    
    // Seguido de música de celebración
    setTimeout(() => {
      this.playTraditionalMusic('victory', false)
    }, 2000)
  }

  /**
   * Reproduce sonidos ambientales del Día de Muertos
   */
  async playAmbientSounds(soundType: 'wind' | 'candles' | 'incense' | 'bells'): Promise<void> {
    const soundMap = {
      wind: 'papel-picado-wind',
      candles: 'candle-flicker',
      incense: 'copal-incense',
      bells: 'church-bell'
    }

    const soundId = soundMap[soundType]
    if (soundId) {
      await this.playCulturalSound(soundId, 0.4) // Volumen bajo para ambiente
    }
  }

  /**
   * Reproduce efectos de instrumentos tradicionales
   */
  async playInstrumentEffect(instrument: 'trumpet' | 'guitar' | 'maracas'): Promise<void> {
    const instrumentMap = {
      trumpet: 'mariachi-trumpet',
      guitar: 'guitar-strum',
      maracas: 'maracas-shake'
    }

    const soundId = instrumentMap[instrument]
    if (soundId) {
      await this.playCulturalSound(soundId, 0.8)
    }
  }

  /**
   * Precarga todos los archivos de audio cultural
   */
  async preloadCulturalAudio(): Promise<void> {
    console.log('🎼 Precargando audio cultural mexicano...')
    
    const preloadPromises: Promise<void>[] = []

    // Precargar música tradicional
    for (const track of this.traditionalMusic.values()) {
      preloadPromises.push(
        audioManager.preloadAudio(track.id, track.src, 'music')
      )
    }

    // Precargar narraciones de cartas
    for (const narration of this.cardNarrations.values()) {
      preloadPromises.push(
        audioManager.preloadAudio(`card-${narration.cardId}`, narration.audioSrc, 'voice')
      )
    }

    // Precargar sonidos culturales
    for (const [soundId, soundSrc] of this.culturalSounds.entries()) {
      preloadPromises.push(
        audioManager.preloadAudio(soundId, soundSrc, 'sfx')
      )
    }

    try {
      await Promise.allSettled(preloadPromises)
      console.log('✅ Audio cultural mexicano precargado exitosamente')
    } catch (error) {
      console.warn('⚠️ Algunos archivos de audio cultural no se pudieron precargar:', error)
    }
  }

  /**
   * Obtiene información sobre una carta y su narración
   */
  getCardNarrationInfo(cardId: number): CardNarration | undefined {
    return this.cardNarrations.get(cardId)
  }

  /**
   * Obtiene todas las pistas musicales disponibles
   */
  getAvailableMusic(): MexicanAudioTrack[] {
    return Array.from(this.traditionalMusic.values())
  }

  /**
   * Obtiene todos los sonidos culturales disponibles
   */
  getAvailableCulturalSounds(): string[] {
    return Array.from(this.culturalSounds.keys())
  }

  /**
   * Cambia la música según el contexto del juego
   */
  async switchMusicContext(newContext: 'menu' | 'gameplay' | 'victory'): Promise<void> {
    if (this.currentMusicCategory !== newContext) {
      await this.playTraditionalMusic(newContext, true)
    }
  }

  /**
   * Reproduce una secuencia de narración completa para una carta
   */
  async playFullCardNarration(card: LoteriaCard): Promise<void> {
    console.log(`🎭 Iniciando narración completa para: ${card.name}`)
    
    // 1. Sonido de llamada de lotería
    await this.playLoteriaCall()
    
    // 2. Pausa dramática
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 3. Narración de la carta con frase
    await this.playCardNarration(card.id, true)
    
    // 4. Efecto de instrumento tradicional aleatorio
    setTimeout(() => {
      const instruments: ('trumpet' | 'guitar' | 'maracas')[] = ['trumpet', 'guitar', 'maracas']
      const randomInstrument = instruments[Math.floor(Math.random() * instruments.length)]
      this.playInstrumentEffect(randomInstrument)
    }, 3000)
  }

  /**
   * Reproduce una celebración cultural completa
   */
  async playFullCelebration(): Promise<void> {
    console.log('🎉 Iniciando celebración cultural completa')
    
    // 1. Grito mexicano
    await this.playCulturalSound('grito-mexicano', 1.0)
    
    // 2. Aplausos con mariachi
    setTimeout(() => {
      this.playCulturalSound('applause-mariachi', 0.9)
    }, 1000)
    
    // 3. Silbato de fiesta
    setTimeout(() => {
      this.playCulturalSound('fiesta-whistle', 0.8)
    }, 2000)
    
    // 4. Música de victoria
    setTimeout(() => {
      this.playTraditionalMusic('victory', false)
    }, 3000)
  }
}

// Instancia singleton del MexicanAudioManager
export const mexicanAudioManager = new MexicanAudioManager()

// Funciones de utilidad para fácil acceso
export const playMexicanMusic = (context: 'menu' | 'gameplay' | 'victory') => 
  mexicanAudioManager.playTraditionalMusic(context)

export const narrateCard = (cardId: number, includePhrase = true) => 
  mexicanAudioManager.playCardNarration(cardId, includePhrase)

export const playCulturalEffect = (soundId: string, volume = 0.8) => 
  mexicanAudioManager.playCulturalSound(soundId, volume)

export const celebrateVictory = () => 
  mexicanAudioManager.playFullCelebration()

export const preloadMexicanAudio = () => 
  mexicanAudioManager.preloadCulturalAudio()