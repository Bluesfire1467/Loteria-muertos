<template>
  <div class="current-card-container">
    <!-- Carta actual compacta -->
    <div v-if="currentCard" class="compact-card-display" :class="{ 
      'highlighted': isHighlighted,
      'pulsing': cantorState.isActive 
    }">
      <!-- Imagen y información en línea -->
      <div class="card-content-horizontal">
        <!-- SVG de la carta -->
        <div class="card-image-container">
          <CardSvg
            :card-id="currentCard.id"
            :card-name="currentCard.name"
            :size="60"
            :is-current="isHighlighted"
            :animated="true"
            class="card-svg"
          />
          <div class="card-overlay" :class="{ visible: isHighlighted }"></div>
        </div>

        <!-- Información de la carta -->
        <div class="card-info">
          <h3 class="card-name">{{ currentCard.name }}</h3>
          <p class="card-description">"{{ currentCard.description }}"</p>
          
          <!-- Estado y progreso en línea -->
          <div class="card-meta">
            <span class="cantor-status" :class="{ active: cantorState.isActive }">
              {{ cantorState.isActive ? '🎤 Cantando...' : '⏸️ Detenido' }}
            </span>
            <span class="progress-text">
              {{ cantorStats.calledCards }} / {{ cantorStats.totalCards }}
            </span>
          </div>
        </div>

        <!-- Controles compactos -->
        <div class="compact-controls" v-if="showControls">
          <button 
            class="control-btn compact"
            :class="{ active: cantorState.isActive }"
            @click="toggleCantor"
            :disabled="!canControlCantor"
            :title="cantorState.isActive ? 'Pausar' : 'Iniciar'"
          >
            {{ cantorState.isActive ? '⏸️' : '▶️' }}
          </button>
          
          <button 
            class="control-btn compact"
            @click="callNextCardManually"
            :disabled="!cantorState.isActive"
            title="Siguiente carta"
          >
            ⏭️
          </button>

          <select 
            v-model="selectedSpeed" 
            @change="updateCantorSpeed"
            class="speed-select compact"
            title="Velocidad"
          >
            <option value="SLOW">Lento</option>
            <option value="NORMAL">Normal</option>
            <option value="FAST">Rápido</option>
            <option value="RAPID">Muy Rápido</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Estado de espera compacto -->
    <div v-else class="compact-waiting-state">
      <div class="waiting-content">
        <span class="waiting-icon">🎲</span>
        <span class="waiting-text">Esperando primera carta...</span>
        <button 
          v-if="!cantorState.isActive && canStartCantor" 
          class="start-cantor-btn compact"
          @click="startCantorManually"
        >
          ▶️ Iniciar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores'
import CardSvg from '@/components/cards/CardSvg.vue'
import type { LoteriaCard } from '@/types'
import type { CantorPreset } from '@/utils/cantor'

// Props del componente
interface Props {
  /** Mostrar controles del cantor */
  showControls?: boolean
  /** Mostrar información cultural */
  showCulturalInfo?: boolean
  /** Mostrar historial de cartas */
  showHistory?: boolean
  /** Permitir iniciar el cantor manualmente */
  canStartCantor?: boolean
  /** Permitir controlar el cantor */
  canControlCantor?: boolean
  /** Duración del resaltado en ms */
  highlightDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  showControls: true,
  showCulturalInfo: true,
  showHistory: false,
  canStartCantor: true,
  canControlCantor: true,
  highlightDuration: 3000
})

// Emits
const emit = defineEmits<{
  cardCalled: [card: LoteriaCard]
  cantorStarted: []
  cantorStopped: []
}>()

// Store del juego
const gameStore = useGameStore()

// Estado reactivo
const showCulturalDetails = ref(false)
const isHighlighted = ref(false)
const selectedSpeed = ref<CantorPreset>('NORMAL')
const highlightTimeout = ref<number | null>(null)

// Computed properties
const currentCard = computed(() => gameStore.gameState.currentCard)
const cantorState = computed(() => gameStore.getCantorState())
const cantorStats = computed(() => gameStore.getCantorStats())
const calledCards = computed(() => gameStore.gameState.cardsDrawn)

// Métodos
const toggleCulturalInfo = () => {
  showCulturalDetails.value = !showCulturalDetails.value
}

// Removed handleImageError since we're using SVGs now

const startCantorManually = () => {
  const success = gameStore.startCantor()
  if (success) {
    emit('cantorStarted')
  }
}

const toggleCantor = () => {
  if (cantorState.value.isActive) {
    gameStore.pauseCantor()
    emit('cantorStopped')
  } else {
    gameStore.resumeCantor()
    emit('cantorStarted')
  }
}

const callNextCardManually = () => {
  const card = gameStore.callNextCard()
  if (card) {
    triggerHighlight()
  }
}

const updateCantorSpeed = () => {
  gameStore.setCantorPreset(selectedSpeed.value)
}

const triggerHighlight = () => {
  // Limpiar timeout anterior si existe
  if (highlightTimeout.value) {
    clearTimeout(highlightTimeout.value)
  }

  // Activar resaltado
  isHighlighted.value = true

  // Desactivar después del tiempo especificado
  highlightTimeout.value = window.setTimeout(() => {
    isHighlighted.value = false
    highlightTimeout.value = null
  }, props.highlightDuration)
}

// Watchers
watch(currentCard, (newCard, oldCard) => {
  if (newCard && newCard !== oldCard) {
    triggerHighlight()
    emit('cardCalled', newCard)
  }
})

// Lifecycle hooks
onMounted(() => {
  console.log('🎤 Componente CurrentCard montado')
})

onUnmounted(() => {
  // Limpiar timeouts
  if (highlightTimeout.value) {
    clearTimeout(highlightTimeout.value)
  }
})
</script>

<style scoped>
.current-card-container {
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-purple) 100%);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  color: var(--text-light);
  width: 100%;
  max-width: none;
}

/* Diseño compacto horizontal */
.compact-card-display {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.compact-card-display.highlighted {
  border-color: var(--accent-gold);
  box-shadow: 0 0 15px rgba(255, 210, 63, 0.4);
}

.compact-card-display.pulsing {
  animation: subtle-pulse 3s infinite;
}

.card-content-horizontal {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-image-container {
  position: relative;
  flex-shrink: 0;
}

.card-svg {
  width: 60px;
  height: 84px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, var(--accent-gold), transparent);
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-overlay.visible {
  opacity: 0.3;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 4px 0;
  color: var(--accent-gold);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.card-description {
  font-size: 0.9rem;
  font-style: italic;
  margin: 0 0 6px 0;
  opacity: 0.9;
  line-height: 1.3;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
}

.cantor-status {
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.cantor-status.active {
  background: var(--success-green);
  color: var(--background-dark);
}

.progress-text {
  opacity: 0.8;
  font-weight: 500;
}

/* Controles compactos */
.compact-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.control-btn.compact {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: var(--text-light);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  min-width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn.compact:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.control-btn.compact:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.compact.active {
  background: var(--success-green);
  color: var(--background-dark);
}

.speed-select.compact {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--text-light);
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  min-width: 80px;
  height: 32px;
}

/* Estado de espera compacto */
.compact-waiting-state {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
}

.waiting-content {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.waiting-icon {
  font-size: 1.5rem;
  animation: bounce 2s infinite;
}

.waiting-text {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
}

.start-cantor-btn.compact {
  background: var(--accent-gold);
  color: var(--background-dark);
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-cantor-btn.compact:hover {
  background: var(--success-green);
  transform: translateY(-1px);
}

/* Animaciones esenciales */
@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-2px); }
}

/* Responsive */
@media (max-width: 768px) {
  .current-card-container {
    padding: 8px;
  }
  
  .card-content-horizontal {
    gap: 8px;
  }
  
  .card-svg {
    width: 50px;
    height: 70px;
  }
  
  .card-name {
    font-size: 1rem;
  }
  
  .card-description {
    font-size: 0.8rem;
  }
  
  .compact-controls {
    gap: 4px;
  }
  
  .control-btn.compact {
    padding: 4px 6px;
    min-width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  .speed-select.compact {
    min-width: 60px;
    height: 28px;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .card-content-horizontal {
    flex-direction: column;
    text-align: center;
    gap: 6px;
  }
  
  .compact-controls {
    justify-content: center;
  }
  
  .waiting-content {
    flex-direction: column;
    gap: 8px;
  }
}
</style>