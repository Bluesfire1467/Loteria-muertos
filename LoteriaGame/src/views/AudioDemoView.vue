<template>
  <div class="audio-demo-view">
    <div class="demo-header">
      <h1>🎵 Demostración del Sistema de Audio</h1>
      <p>Prueba todas las funcionalidades de audio del juego de Lotería Día de Muertos</p>
    </div>

    <!-- Inicialización del audio -->
    <div class="audio-init" v-if="!audioInitialized">
      <div class="init-card">
        <h2>🎼 Inicializar Audio</h2>
        <p>Para probar el sistema de audio, primero necesitas inicializarlo con una interacción del usuario.</p>
        <button @click="initializeAudio" class="init-btn">
          🔊 Activar Sistema de Audio
        </button>
      </div>
    </div>

    <!-- Contenido principal cuando el audio está inicializado -->
    <div v-else class="demo-content">
      <!-- Controles de audio -->
      <div class="controls-section">
        <h2>🎛️ Controles de Audio</h2>
        <AudioControls :compact="false" />
      </div>

      <!-- Prueba básica de sonidos -->
      <div class="test-section">
        <AudioTest />
      </div>

      <!-- Demo completo mexicano -->
      <div class="mexican-section">
        <MexicanAudioDemo />
      </div>

      <!-- Información del sistema -->
      <div class="info-section">
        <h2>ℹ️ Información del Sistema</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>🔊 Estado del Audio</h3>
            <ul>
              <li><strong>Inicializado:</strong> {{ audioStatus.isInitialized ? '✅' : '❌' }}</li>
              <li><strong>Habilitado:</strong> {{ audioStatus.enabled ? '✅' : '❌' }}</li>
              <li><strong>Música reproduciéndose:</strong> {{ audioStatus.musicPlaying ? '✅' : '❌' }}</li>
              <li><strong>Volumen maestro:</strong> {{ Math.round(audioStatus.settings.masterVolume * 100) }}%</li>
            </ul>
          </div>

          <div class="info-card">
            <h3>🇲🇽 Audio Mexicano</h3>
            <ul>
              <li><strong>Sistema precargado:</strong> {{ mexicanAudioStats.isPreloaded ? '✅' : '❌' }}</li>
              <li><strong>Pistas musicales:</strong> {{ mexicanAudioStats.availableMusicTracks }}</li>
              <li><strong>Efectos culturales:</strong> {{ mexicanAudioStats.availableSounds }}</li>
              <li><strong>Contexto actual:</strong> {{ mexicanAudioStats.currentMusicContext || 'Ninguno' }}</li>
            </ul>
          </div>

          <div class="info-card">
            <h3>🎛️ Características</h3>
            <ul>
              <li>✅ Música tradicional mexicana</li>
              <li>✅ Narración de cartas en español</li>
              <li>✅ Efectos culturales auténticos</li>
              <li>✅ Sonidos sintéticos de fallback</li>
              <li>✅ Controles de volumen independientes</li>
              <li>✅ Precarga inteligente de audio</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="instructions-section">
        <h2>📖 Instrucciones</h2>
        <div class="instructions">
          <div class="instruction-group">
            <h3>🎵 Música Tradicional</h3>
            <p>El sistema incluye música mexicana auténtica para diferentes contextos del juego. 
            Usa los controles para cambiar entre música de menú, juego y victoria.</p>
          </div>

          <div class="instruction-group">
            <h3>🗣️ Narración de Cartas</h3>
            <p>Cada carta de la lotería tiene narración en español con las frases tradicionales. 
            Si los archivos de audio no están disponibles, se muestra el texto en pantalla.</p>
          </div>

          <div class="instruction-group">
            <h3>🔔 Efectos Culturales</h3>
            <p>Sonidos de instrumentos tradicionales mexicanos, campanas de iglesia, 
            y efectos ambientales del Día de Muertos enriquecen la experiencia.</p>
          </div>

          <div class="instruction-group">
            <h3>🎛️ Fallbacks Inteligentes</h3>
            <p>Cuando los archivos de audio no están disponibles, el sistema usa sonidos sintéticos 
            generados por código para mantener la funcionalidad.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAudio } from '@/composables/useAudio'
import { useMexicanAudio } from '@/composables/useMexicanAudio'
import AudioControls from '@/components/AudioControls.vue'
import AudioTest from '@/components/AudioTest.vue'
import MexicanAudioDemo from '@/components/MexicanAudioDemo.vue'

// Estado local
const audioInitialized = ref(false)

// Composables
const { initAudio, getAudioStatus } = useAudio()
const { initMexicanAudio, getAudioStats } = useMexicanAudio()

// Estado reactivo del audio
const audioStatus = ref(getAudioStatus())
const mexicanAudioStats = ref(getAudioStats())

/**
 * Inicializa todo el sistema de audio
 */
const initializeAudio = async (): Promise<void> => {
  try {
    console.log('🎼 Inicializando sistema de audio completo...')
    
    // Inicializar audio básico
    await initAudio()
    
    // Inicializar audio mexicano
    await initMexicanAudio()
    
    audioInitialized.value = true
    
    // Actualizar estados
    updateAudioStatus()
    
    console.log('✅ Sistema de audio inicializado completamente')
  } catch (error) {
    console.error('❌ Error inicializando sistema de audio:', error)
    alert('Error inicializando el sistema de audio. Algunos sonidos pueden no funcionar.')
  }
}

/**
 * Actualiza el estado del audio
 */
const updateAudioStatus = (): void => {
  audioStatus.value = getAudioStatus()
  mexicanAudioStats.value = getAudioStats()
}

// Actualizar estado cada 2 segundos
let statusInterval: number

onMounted(() => {
  // Verificar si el audio ya está inicializado
  const status = getAudioStatus()
  if (status.isInitialized) {
    audioInitialized.value = true
  }
  
  updateAudioStatus()
  
  // Actualizar estado periódicamente
  statusInterval = setInterval(updateAudioStatus, 2000)
})

// Limpiar intervalo al desmontar
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})
</script>

<style scoped>
.audio-demo-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b69 0%, #ff6b35 50%, #7209b7 100%);
  padding: 24px;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 32px;
}

.demo-header h1 {
  font-size: 3rem;
  margin: 0 0 16px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.audio-init {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.init-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  color: white;
  max-width: 500px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.init-card h2 {
  font-size: 2rem;
  margin: 0 0 16px 0;
  color: #FFD23F;
}

.init-card p {
  font-size: 1.1rem;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.5;
}

.init-btn {
  background: linear-gradient(45deg, #ff6b35, #FFD23F);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d1b69;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
}

.init-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.controls-section,
.test-section,
.mexican-section,
.info-section,
.instructions-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.controls-section h2,
.info-section h2,
.instructions-section h2 {
  color: #FFD23F;
  text-align: center;
  margin: 0 0 24px 0;
  font-size: 1.8rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-card h3 {
  color: #06ffa5;
  margin: 0 0 16px 0;
  font-size: 1.2rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  color: white;
  margin: 8px 0;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.instructions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.instruction-group {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #FFD23F;
}

.instruction-group h3 {
  color: #FFD23F;
  margin: 0 0 12px 0;
  font-size: 1.1rem;
}

.instruction-group p {
  color: white;
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .audio-demo-view {
    padding: 16px;
  }
  
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-header p {
    font-size: 1rem;
  }
  
  .init-card {
    padding: 24px;
  }
  
  .init-card h2 {
    font-size: 1.5rem;
  }
  
  .info-grid,
  .instructions {
    grid-template-columns: 1fr;
  }
}
</style>