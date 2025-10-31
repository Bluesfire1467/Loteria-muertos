<template>
  <div class="game-timer" :class="{ 
    'timer-active': isGameActive, 
    'timer-paused': isPaused,
    'timer-warning': timeComparison.status === 'slow' && currentGameDuration > 600
  }">
    <!-- Display principal del cronómetro -->
    <div class="timer-display">
      <div class="timer-icon">
        <span v-if="timerStatus === 'running'">⏱️</span>
        <span v-else-if="timerStatus === 'paused'">⏸️</span>
        <span v-else>⏹️</span>
      </div>
      
      <div class="timer-content">
        <div class="timer-main">
          <span class="timer-time">{{ formattedGameDuration }}</span>
          <span class="timer-status">{{ getStatusText() }}</span>
        </div>
        
        <!-- Información adicional cuando el juego está activo -->
        <div v-if="isGameActive" class="timer-details">
          <div class="timer-comparison" v-if="averageGameTime > 0">
            <span class="comparison-label">vs promedio:</span>
            <span class="comparison-value" :class="timeComparison.status">
              {{ timeComparison.message }}
            </span>
          </div>
          
          <div class="timer-estimate" v-if="estimatedTimeRemaining > 0">
            <span class="estimate-label">Tiempo estimado restante:</span>
            <span class="estimate-value">{{ formatTime(estimatedTimeRemaining) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles del cronómetro (solo para desarrollo/debug) -->
    <div v-if="showControls" class="timer-controls">
      <button 
        @click="startGame" 
        :disabled="isGameActive"
        class="timer-btn start-btn"
      >
        ▶️ Iniciar
      </button>
      
      <button 
        @click="togglePause" 
        :disabled="!isGameActive"
        class="timer-btn pause-btn"
      >
        {{ isPaused ? '▶️ Reanudar' : '⏸️ Pausar' }}
      </button>
      
      <button 
        @click="endGame" 
        :disabled="!isGameActive"
        class="timer-btn end-btn"
      >
        ⏹️ Finalizar
      </button>
      
      <button 
        @click="resetGame"
        class="timer-btn reset-btn"
      >
        🔄 Reiniciar
      </button>
    </div>

    <!-- Estadísticas de tiempo (modo compacto) -->
    <div v-if="showStats && !isGameActive" class="timer-stats">
      <div class="stat-item">
        <span class="stat-label">Promedio:</span>
        <span class="stat-value">{{ formatTime(averageGameTime) }}</span>
      </div>
      
      <div class="stat-item" v-if="timeStatistics.totalGames > 0">
        <span class="stat-label">Total jugado:</span>
        <span class="stat-value">{{ timeStatistics.formattedTotalTime }}</span>
      </div>
      
      <div class="stat-item" v-if="speedMetrics.category !== 'normal'">
        <span class="stat-label">Velocidad:</span>
        <span class="stat-value" :class="speedMetrics.category">
          {{ speedMetrics.description }}
        </span>
      </div>
    </div>

    <!-- Indicador de progreso visual (opcional) -->
    <div v-if="showProgress && isGameActive && averageGameTime > 0" class="timer-progress">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${Math.min(100, (currentGameDuration / averageGameTime) * 100)}%` }"
          :class="{
            'progress-normal': currentGameDuration <= averageGameTime,
            'progress-overtime': currentGameDuration > averageGameTime
          }"
        ></div>
      </div>
      <div class="progress-label">
        {{ currentGameDuration <= averageGameTime ? 'Tiempo normal' : 'Tiempo extra' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useGameTimer } from '@/composables/useGameTimer'
import { useStatisticsStore } from '@/stores/statistics'

// ============================================================================
// PROPS
// ============================================================================

interface Props {
  showControls?: boolean
  showStats?: boolean
  showProgress?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showControls: false,
  showStats: true,
  showProgress: true,
  compact: false
})

// ============================================================================
// COMPOSABLES
// ============================================================================

const {
  isGameActive,
  isPaused,
  timerStatus,
  currentGameDuration,
  formattedGameDuration,
  timeComparison,
  estimatedTimeRemaining,
  startGame,
  endGame,
  pauseGame,
  resumeGame,
  resetGame,
  formatTime
} = useGameTimer()

const statisticsStore = useStatisticsStore()

// ============================================================================
// COMPUTED
// ============================================================================

const averageGameTime = computed(() => statisticsStore.userStats.averageGameTime)

const timeStatistics = computed(() => statisticsStore.getTimeStatistics())

const speedMetrics = computed(() => statisticsStore.getSpeedMetrics())

const timeTrends = computed(() => statisticsStore.getTimeTrends())

// ============================================================================
// METHODS
// ============================================================================

function getStatusText(): string {
  switch (timerStatus.value) {
    case 'running':
      return 'En juego'
    case 'paused':
      return 'Pausado'
    case 'stopped':
      return 'Detenido'
    default:
      return ''
  }
}

function togglePause(): void {
  if (isPaused.value) {
    resumeGame()
  } else {
    pauseGame()
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Inicializar estadísticas si es necesario
  statisticsStore.initialize()
})
</script>

<style scoped>
.game-timer {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
}

.game-timer.timer-active {
  border-color: var(--success-green);
  box-shadow: 0 0 10px rgba(6, 255, 165, 0.2);
}

.game-timer.timer-paused {
  border-color: var(--accent-gold);
  box-shadow: 0 0 10px rgba(255, 211, 63, 0.2);
}

.game-timer.timer-warning {
  border-color: var(--error-red);
  box-shadow: 0 0 10px rgba(255, 0, 110, 0.2);
}

/* Timer display */
.timer-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.timer-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.timer-content {
  flex: 1;
}

.timer-main {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.timer-time {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-light);
  font-family: 'Courier New', monospace;
}

.timer-status {
  font-size: var(--font-size-sm);
  color: var(--accent-gold);
  opacity: 0.8;
}

.timer-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
}

.timer-comparison,
.timer-estimate {
  display: flex;
  gap: var(--spacing-xs);
}

.comparison-label,
.estimate-label {
  opacity: 0.7;
}

.comparison-value {
  font-weight: 500;
}

.comparison-value.fast {
  color: var(--success-green);
}

.comparison-value.slow {
  color: var(--error-red);
}

.comparison-value.normal {
  color: var(--text-light);
}

.estimate-value {
  color: var(--accent-gold);
  font-weight: 500;
}

/* Timer controls */
.timer-controls {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.timer-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.timer-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.timer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.timer-btn.start-btn:hover:not(:disabled) {
  border-color: var(--success-green);
}

.timer-btn.pause-btn:hover:not(:disabled) {
  border-color: var(--accent-gold);
}

.timer-btn.end-btn:hover:not(:disabled) {
  border-color: var(--error-red);
}

.timer-btn.reset-btn:hover:not(:disabled) {
  border-color: var(--secondary-purple);
}

/* Timer stats */
.timer-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
}

.stat-label {
  opacity: 0.7;
}

.stat-value {
  font-weight: 500;
}

.stat-value.very_fast,
.stat-value.fast {
  color: var(--success-green);
}

.stat-value.very_slow,
.stat-value.slow {
  color: var(--error-red);
}

/* Progress bar */
.timer-progress {
  margin-top: var(--spacing-sm);
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.progress-fill {
  height: 100%;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-normal);
}

.progress-fill.progress-normal {
  background: linear-gradient(90deg, var(--success-green), var(--accent-gold));
}

.progress-fill.progress-overtime {
  background: linear-gradient(90deg, var(--accent-gold), var(--error-red));
}

.progress-label {
  font-size: var(--font-size-xs);
  text-align: center;
  opacity: 0.8;
}

/* Compact mode */
.game-timer.compact {
  padding: var(--spacing-sm);
}

.game-timer.compact .timer-display {
  margin-bottom: var(--spacing-sm);
}

.game-timer.compact .timer-time {
  font-size: var(--font-size-lg);
}

.game-timer.compact .timer-details {
  display: none;
}

/* Responsive */
@media (max-width: 480px) {
  .timer-controls {
    justify-content: center;
  }
  
  .timer-btn {
    flex: 1;
    min-width: 0;
  }
  
  .timer-display {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
  
  .timer-main {
    justify-content: center;
  }
}
</style>