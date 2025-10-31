/**
 * AudioSynthesizer - Generador de audio sintético para pruebas
 * Crea sonidos básicos cuando los archivos de audio no están disponibles
 */

export class AudioSynthesizer {
  private audioContext: AudioContext | null = null

  constructor() {
    this.initializeContext()
  }

  private async initializeContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }
    } catch (error) {
      console.warn('No se pudo inicializar AudioContext para síntesis:', error)
    }
  }

  /**
   * Genera un tono simple
   */
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      let value = 0

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t)
          break
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
          break
        case 'triangle':
          value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
          break
        case 'sawtooth':
          value = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
          break
      }

      // Aplicar envelope para evitar clicks
      const envelope = Math.min(1, Math.min(i / (sampleRate * 0.01), (length - i) / (sampleRate * 0.01)))
      data[i] = value * envelope * 0.3 // Volumen reducido
    }

    return buffer
  }

  /**
   * Reproduce un buffer de audio
   */
  private playBuffer(buffer: AudioBuffer, volume = 0.5): void {
    if (!this.audioContext || !buffer) return

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    
    source.buffer = buffer
    gainNode.gain.value = volume
    
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    source.start()
  }

  /**
   * Genera y reproduce un sonido de click
   */
  playClickSound(): void {
    const buffer = this.createTone(800, 0.1, 'square')
    if (buffer) this.playBuffer(buffer, 0.3)
  }

  /**
   * Genera y reproduce un sonido de marca de carta
   */
  playCardMarkSound(): void {
    // Sonido de dos tonos ascendentes
    setTimeout(() => {
      const buffer1 = this.createTone(600, 0.15, 'sine')
      if (buffer1) this.playBuffer(buffer1, 0.4)
    }, 0)
    
    setTimeout(() => {
      const buffer2 = this.createTone(800, 0.15, 'sine')
      if (buffer2) this.playBuffer(buffer2, 0.4)
    }, 100)
  }

  /**
   * Genera y reproduce un sonido de error
   */
  playErrorSound(): void {
    const buffer = this.createTone(200, 0.3, 'sawtooth')
    if (buffer) this.playBuffer(buffer, 0.2)
  }

  /**
   * Genera y reproduce un sonido de victoria
   */
  playVictorySound(): void {
    // Secuencia de tonos ascendentes
    const notes = [523, 659, 784, 1047] // Do, Mi, Sol, Do (octava superior)
    
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const buffer = this.createTone(frequency, 0.3, 'sine')
        if (buffer) this.playBuffer(buffer, 0.5)
      }, index * 150)
    })
  }

  /**
   * Genera y reproduce un sonido de campana
   */
  playBellSound(): void {
    // Simula una campana con múltiples frecuencias
    const frequencies = [800, 1000, 1200]
    
    frequencies.forEach((frequency, index) => {
      setTimeout(() => {
        const buffer = this.createTone(frequency, 1.0, 'sine')
        if (buffer) this.playBuffer(buffer, 0.2 - index * 0.05)
      }, index * 50)
    })
  }

  /**
   * Genera y reproduce un sonido de trompeta sintética
   */
  playTrumpetSound(): void {
    const buffer = this.createTone(440, 0.5, 'sawtooth')
    if (buffer) this.playBuffer(buffer, 0.4)
  }

  /**
   * Genera y reproduce un sonido de guitarra sintética
   */
  playGuitarSound(): void {
    // Simula un acorde con múltiples frecuencias
    const chord = [330, 415, 494] // Acorde de Mi mayor
    
    chord.forEach((frequency) => {
      const buffer = this.createTone(frequency, 0.8, 'triangle')
      if (buffer) this.playBuffer(buffer, 0.2)
    })
  }

  /**
   * Genera y reproduce un sonido de maracas sintéticas
   */
  playMaracasSound(): void {
    // Ruido blanco filtrado para simular maracas
    if (!this.audioContext) return

    const duration = 0.3
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      // Ruido blanco con envelope
      const noise = (Math.random() * 2 - 1)
      const envelope = Math.exp(-i / (sampleRate * 0.1)) // Decay exponencial
      data[i] = noise * envelope * 0.1
    }

    this.playBuffer(buffer, 0.3)
  }

  /**
   * Genera y reproduce un grito mexicano sintético
   */
  playGritoSound(): void {
    // Sonido ascendente que simula un grito
    if (!this.audioContext) return

    const duration = 1.0
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      const frequency = 400 + (t * 600) // Frecuencia ascendente de 400 a 1000 Hz
      const value = Math.sin(2 * Math.PI * frequency * t)
      
      // Envelope con vibrato
      const envelope = Math.sin(t * Math.PI) * Math.exp(-t * 2)
      const vibrato = 1 + 0.1 * Math.sin(2 * Math.PI * 6 * t) // Vibrato de 6 Hz
      
      data[i] = value * envelope * vibrato * 0.3
    }

    this.playBuffer(buffer, 0.6)
  }

  /**
   * Verifica si el sintetizador está disponible
   */
  isAvailable(): boolean {
    return this.audioContext !== null
  }
}

// Instancia singleton del sintetizador
export const audioSynthesizer = new AudioSynthesizer()