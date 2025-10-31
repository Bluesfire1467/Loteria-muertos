<template>
  <div class="mexican-audio-demo">
    <div class="demo-header">
      <h2 class="demo-title">🇲🇽 Audio Cultural Mexicano</h2>
      <p class="demo-subtitle">Demostración del sistema de audio tradicional</p>
      
      <!-- Estado del sistema -->
      <div class="demo-status" :class="{ 'demo-status--loaded': isPreloaded }">
        <span class="status-indicator"></span>
        {{ isPreloaded ? 'Sistema cargado' : 'Cargando sistema...' }}
      </div>
    </div>

    <!-- Controles de música tradicional -->
    <div class="demo-section">
      <h3 class="section-title">🎵 Música Tradicional</h3>
      <div class="music-controls">
        <button 
          @click="playMenuMusic" 
          class="demo-btn demo-btn--music"
          :disabled="!isPreloaded"
        >
          🏠 Música de Menú
        </button>
        <button 
          @click="playGameplayMusic" 
          class="demo-btn demo-btn--music"
          :disabled="!isPreloaded"
        >
          🎮 Música de Juego
        </button>
        <button 
          @click="playVictoryMusic" 
          class="demo-btn demo-btn--music"
          :disabled="!isPreloaded"
        >
          🏆 Música de Victoria
        </button>
      </div>
      
      <div class="current-context" v-if="currentMusicContext">
        <span class="context-label">Contexto actual:</span>
        <span class="context-value">{{ getMusicContextLabel(currentMusicContext) }}</span>
      </div>
    </div>

    <!-- Narración de cartas -->
    <div class="demo-section">
      <h3 class="section-title">🗣️ Narración de Cartas</h3>
      <div class="card-narration">
        <div class="card-selector">
          <label for="card-select">Seleccionar carta:</label>
          <select 
            id="card-select" 
            v-model="selectedCardId" 
            class="card-select"
            :disabled="!isPreloaded"
          >
            <option value="">-- Selecciona una carta --</option>
            <option 
              v-for="card in sampleCards" 
              :key="card.id" 
              :value="card.id"
            >
              {{ card.name }} - "{{ card.description }}"
            </option>
          </select>
        </div>
        
        <div class="narration-controls" v-if="selectedCardId">
          <button 
            @click="playCardName(selectedCardId)" 
            class="demo-btn demo-btn--voice"
            :disabled="!isPreloaded"
          >
            📢 Solo Nombre
          </button>
          <button 
            @click="playFullCardNarration(selectedCardId)" 
            class="demo-btn demo-btn--voice"
            :disabled="!isPreloaded"
          >
            🎭 Narración Completa
          </button>
          <button 
            @click="narrateSelectedCard" 
            class="demo-btn demo-btn--voice demo-btn--primary"
            :disabled="!isPreloaded"
          >
            ✨ Narración Teatral
          </button>
        </div>

        <!-- Información de la carta seleccionada -->
        <div class="card-info" v-if="selectedCard">
          <div class="card-info__content">
            <h4 class="card-name">{{ selectedCard.name }}</h4>
            <p class="card-description">"{{ selectedCard.description }}"</p>
            <p class="card-cultural" v-if="selectedCard.culturalSignificance">
              <strong>Significado cultural:</strong> {{ selectedCard.culturalSignificance }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Efectos culturales -->
    <div class="demo-section">
      <h3 class="section-title">🔔 Efectos Culturales</h3>
      <div class="cultural-effects">
        <div class="effect-group">
          <h4 class="group-title">Llamadas de Juego</h4>
          <button @click="callLoteria" class="demo-btn demo-btn--effect" :disabled="!isPreloaded">
            📢 ¡Lotería!
          </button>
          <button @click="markCard" class="demo-btn demo-btn--effect" :disabled="!isPreloaded">
            ✅ Marcar Carta
          </button>
        </div>

        <div class="effect-group">
          <h4 class="group-title">Instrumentos</h4>
          <button @click="playTrumpet" class="demo-btn demo-btn--instrument" :disabled="!isPreloaded">
            🎺 Trompeta
          </button>
          <button @click="playGuitar" class="demo-btn demo-btn--instrument" :disabled="!isPreloaded">
            🎸 Guitarra
          </button>
          <button @click="playMaracas" class="demo-btn demo-btn--instrument" :disabled="!isPreloaded">
            🥁 Maracas
          </button>
        </div>

        <div class="effect-group">
          <h4 class="group-title">Ambiente</h4>
          <button @click="windSounds" class="demo-btn demo-btn--ambient" :disabled="!isPreloaded">
            💨 Viento
          </button>
          <button @click="candleFlicker" class="demo-btn demo-btn--ambient" :disabled="!isPreloaded">
            🕯️ Velas
          </button>
          <button @click="churchBells" class="demo-btn demo-btn--ambient" :disabled="!isPreloaded">
            🔔 Campanas
          </button>
        </div>

        <div class="effect-group">
          <h4 class="group-title">Celebraciones</h4>
          <button @click="celebrate" class="demo-btn demo-btn--celebration" :disabled="!isPreloaded">
            🎉 Celebrar
          </button>
          <button @click="victory" class="demo-btn demo-btn--celebration" :disabled="!isPreloaded">
            🏆 Victoria
          </button>
        </div>
      </div>
    </div>

    <!-- Secuencias de juego -->
    <div class="demo-section">
      <h3 class="section-title">🎬 Secuencias de Juego</h3>
      <div class="game-sequences">
        <button 
          @click="playGameStartSequence" 
          class="demo-btn demo-btn--sequence"
          :disabled="!isPreloaded"
        >
          🚀 Inicio de Juego
        </button>
        <button 
          @click="() => playGameEndSequence(true)" 
          class="demo-btn demo-btn--sequence"
          :disabled="!isPreloaded"
        >
          🎊 Final Victorioso
        </button>
        <button 
          @click="() => playGameEndSequence(false)" 
          class="demo-btn demo-btn--sequence"
          :disabled="!isPreloaded"
        >
          😔 Final de Derrota
        </button>
        <button 
          @click="createDayOfTheDeadAmbience" 
          class="demo-btn demo-btn--sequence"
          :disabled="!isPreloaded"
        >
          🌙 Ambiente Día de Muertos
        </button>
      </div>
    </div>

    <!-- Estadísticas del sistema -->
    <div class="demo-section">
      <h3 class="section-title">📊 Estadísticas del Sistema</h3>
      <div class="audio-stats">
        <div class="stat-item">
          <span class="stat-label">Pistas musicales:</span>
          <span class="stat-value">{{ availableMusic.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Efectos culturales:</span>
          <span class="stat-value">{{ availableSounds.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Sistema precargado:</span>
          <span class="stat-value" :class="{ 'stat-value--success': isPreloaded }">
            {{ isPreloaded ? 'Sí' : 'No' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Botón de inicialización -->
    <div class="demo-actions" v-if="!isPreloaded">
      <button @click="initMexicanAudio" class="demo-btn demo-btn--init">
        🎼 Inicializar Sistema de Audio
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMexicanAudio } from '@/composables/useMexicanAudio'
import { LOTERIA_CARDS } from '@/data/loteriaCards'
import type { LoteriaCard } from '@/types'

// Composable de audio mexicano
const {
  isPreloaded,
  currentMusicContext,
  availableMusic,
  availableSounds,
  initMexicanAudio,
  playMenuMusic,
  playGameplayMusic,
  playVictoryMusic,
  narrateCard,
  playCardName,
  playFullCardNarration,
  callLoteria,
  markCard,
  celebrate,
  victory,
  playTrumpet,
  playGuitar,
  playMaracas,
  windSounds,
  candleFlicker,
  churchBells,
  playGameStartSequence,
  playGameEndSequence,
  createDayOfTheDeadAmbience
} = useMexicanAudio()

// Estado local
const selectedCardId = ref<number | ''>('')

// Cartas de muestra para la demostración
const sampleCards = LOTERIA_CARDS.slice(0, 10) // Primeras 10 cartas

// Carta seleccionada computada
const selectedCard = computed((): LoteriaCard | undefined => {
  if (!selectedCardId.value) return undefined
  return LOTERIA_CARDS.find(card => card.id === selectedCardId.value)
})

// Funciones de utilidad
const getMusicContextLabel = (context: string): string => {
  const labels = {
    menu: '🏠 Menú Principal',
    gameplay: '🎮 Durante el Juego',
    victory: '🏆 Celebración de Victoria'
  }
  return labels[context as keyof typeof labels] || context
}

const narrateSelectedCard = async (): Promise<void> => {
  if (selectedCard.value) {
    await narrateCard(selectedCard.value)
  }
}

// Inicialización
onMounted(async () => {
  // Intentar inicializar automáticamente
  try {
    await initMexicanAudio()
  } catch (error) {
    console.log('Inicialización automática fallida, esperando interacción del usuario')
  }
})
</script>

<style scoped>
.mexican-audio-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-purple) 100%);
  border-radius: 16px;
  color: white;
  font-family: 'Arial', sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 32px;
}

.demo-title {
  font-size: 2.5rem;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 16px 0;
}

.demo-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.demo-status--loaded {
  background: rgba(6, 255, 165, 0.2);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff006e;
  animation: pulse 2s infinite;
}

.demo-status--loaded .status-indicator {
  background: #06ffa5;
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.demo-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 1.4rem;
  margin: 0 0 16px 0;
  color: var(--accent-gold);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.music-controls, .cultural-effects, .game-sequences {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.demo-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-btn--music {
  background: rgba(255, 107, 53, 0.3);
  border-color: var(--primary-orange);
}

.demo-btn--voice {
  background: rgba(114, 9, 183, 0.3);
  border-color: var(--secondary-purple);
}

.demo-btn--effect {
  background: rgba(255, 210, 63, 0.3);
  border-color: var(--accent-gold);
}

.demo-btn--instrument {
  background: rgba(6, 255, 165, 0.3);
  border-color: var(--success-green);
}

.demo-btn--ambient {
  background: rgba(45, 27, 105, 0.5);
  border-color: var(--background-dark);
}

.demo-btn--celebration {
  background: rgba(255, 0, 110, 0.3);
  border-color: var(--error-red);
}

.demo-btn--sequence {
  background: linear-gradient(45deg, var(--primary-orange), var(--secondary-purple));
  border-color: var(--accent-gold);
  font-size: 1rem;
  padding: 12px 20px;
}

.demo-btn--primary {
  background: var(--accent-gold);
  color: var(--background-dark);
  border-color: var(--accent-gold);
  font-weight: 700;
}

.demo-btn--init {
  background: var(--success-green);
  color: var(--background-dark);
  border-color: var(--success-green);
  font-size: 1.1rem;
  padding: 16px 32px;
}

.current-context {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
}

.context-label {
  opacity: 0.8;
  margin-right: 8px;
}

.context-value {
  font-weight: 600;
  color: var(--accent-gold);
}

.card-selector {
  margin-bottom: 16px;
}

.card-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.card-select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
}

.card-select option {
  background: var(--background-dark);
  color: white;
}

.narration-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.card-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid var(--accent-gold);
}

.card-name {
  font-size: 1.2rem;
  margin: 0 0 8px 0;
  color: var(--accent-gold);
}

.card-description {
  font-style: italic;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.card-cultural {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
  line-height: 1.4;
}

.effect-group {
  margin-bottom: 20px;
}

.group-title {
  font-size: 1rem;
  margin: 0 0 12px 0;
  color: var(--accent-gold);
  font-weight: 600;
}

.audio-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-label {
  font-weight: 600;
  opacity: 0.9;
}

.stat-value {
  font-weight: 700;
  color: var(--accent-gold);
}

.stat-value--success {
  color: var(--success-green);
}

.demo-actions {
  text-align: center;
  margin-top: 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .mexican-audio-demo {
    padding: 16px;
  }
  
  .demo-title {
    font-size: 2rem;
  }
  
  .music-controls, .cultural-effects, .game-sequences {
    flex-direction: column;
  }
  
  .demo-btn {
    width: 100%;
    text-align: center;
  }
  
  .audio-stats {
    grid-template-columns: 1fr;
  }
}
</style>