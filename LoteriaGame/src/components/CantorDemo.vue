<template>
  <div class="cantor-demo">
    <h1>Demo del Sistema de Cantado - Lotería Día de Muertos</h1>
    
    <!-- Componente de carta actual -->
    <CurrentCard 
      :show-controls="true"
      :show-cultural-info="true"
      :show-history="true"
      @card-called="onCardCalled"
      @cantor-started="onCantorStarted"
      @cantor-stopped="onCantorStopped"
    />

    <!-- Información de estado del juego -->
    <div class="game-info">
      <h3>Estado del Juego</h3>
      <div class="info-grid">
        <div class="info-item">
          <strong>Estado:</strong> {{ gameState.gameStatus }}
        </div>
        <div class="info-item">
          <strong>Jugadores:</strong> {{ gameState.players.length }}
        </div>
        <div class="info-item">
          <strong>Cartas cantadas:</strong> {{ gameState.cardsDrawn.length }}
        </div>
        <div class="info-item">
          <strong>Carta actual:</strong> {{ gameState.currentCard?.name || 'Ninguna' }}
        </div>
      </div>
    </div>

    <!-- Controles de demo -->
    <div class="demo-controls">
      <h3>Controles de Demo</h3>
      <div class="control-buttons">
        <button @click="startNewGame" class="demo-btn primary">
          🎮 Nueva Partida
        </button>
        <button @click="startCantor" class="demo-btn success" :disabled="!canStartCantor">
          🎤 Iniciar Cantor
        </button>
        <button @click="resetGame" class="demo-btn warning">
          🔄 Reiniciar
        </button>
      </div>
    </div>

    <!-- Log de eventos -->
    <div class="event-log">
      <h3>Log de Eventos</h3>
      <div class="log-container">
        <div 
          v-for="(event, index) in eventLog" 
          :key="index"
          class="log-entry"
          :class="event.type"
        >
          <span class="log-time">{{ formatTime(event.timestamp) }}</span>
          <span class="log-message">{{ event.message }}</span>
        </div>
      </div>
      <button @click="clearLog" class="clear-log-btn">Limpiar Log</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores'
import CurrentCard from './CurrentCard.vue'
import type { LoteriaCard } from '@/types'

// Store del juego
const gameStore = useGameStore()

// Estado reactivo
const eventLog = ref<Array<{
  timestamp: Date
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}>>([])

// Computed properties
const gameState = computed(() => gameStore.gameState)
const canStartCantor = computed(() => 
  gameState.value.gameStatus === 'playing' && gameState.value.players.length > 0
)

// Métodos
const addLogEntry = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  eventLog.value.unshift({
    timestamp: new Date(),
    message,
    type
  })
  
  // Mantener solo los últimos 20 eventos
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20)
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('es-MX', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const startNewGame = () => {
  try {
    const session = gameStore.startNewGame('Demo Player')
    addLogEntry(`Nueva partida iniciada: ${session.id}`, 'success')
    addLogEntry(`Jugadores creados: ${session.players.length}`, 'info')
  } catch (error) {
    addLogEntry(`Error al iniciar partida: ${error}`, 'error')
  }
}

const startCantor = () => {
  try {
    const success = gameStore.startCantor({
      cardInterval: 3000, // 3 segundos para demo
      shuffleCards: true,
      repeatCards: false
    })
    
    if (success) {
      addLogEntry('Cantor iniciado con éxito', 'success')
    } else {
      addLogEntry('No se pudo iniciar el cantor', 'warning')
    }
  } catch (error) {
    addLogEntry(`Error al iniciar cantor: ${error}`, 'error')
  }
}

const resetGame = () => {
  try {
    gameStore.resetGame()
    addLogEntry('Juego reiniciado', 'info')
  } catch (error) {
    addLogEntry(`Error al reiniciar: ${error}`, 'error')
  }
}

const clearLog = () => {
  eventLog.value = []
}

// Event handlers
const onCardCalled = (card: LoteriaCard) => {
  addLogEntry(`🎤 Carta cantada: ${card.name} - "${card.description}"`, 'success')
}

const onCantorStarted = () => {
  addLogEntry('▶️ Cantor iniciado/reanudado', 'info')
}

const onCantorStopped = () => {
  addLogEntry('⏸️ Cantor pausado/detenido', 'warning')
}

// Lifecycle
onMounted(() => {
  addLogEntry('Demo del Cantor cargado', 'info')
})
</script>

<style scoped>
.cantor-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.cantor-demo h1 {
  text-align: center;
  color: var(--primary-orange, #FF6B35);
  margin-bottom: 30px;
  font-size: 2rem;
}

.game-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.game-info h3 {
  margin: 0 0 16px 0;
  color: var(--secondary-purple, #7209B7);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.demo-controls {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.demo-controls h3 {
  margin: 0 0 16px 0;
  color: var(--secondary-purple, #7209B7);
}

.control-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.demo-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.demo-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.demo-btn.primary {
  background: var(--primary-orange, #FF6B35);
  color: white;
}

.demo-btn.success {
  background: var(--success-green, #06FFA5);
  color: var(--background-dark, #2D1B69);
}

.demo-btn.warning {
  background: var(--accent-gold, #FFD23F);
  color: var(--background-dark, #2D1B69);
}

.event-log {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.event-log h3 {
  margin: 0 0 16px 0;
  color: var(--secondary-purple, #7209B7);
}

.log-container {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.log-entry {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  color: rgba(255, 255, 255, 0.6);
  min-width: 80px;
}

.log-message {
  flex: 1;
}

.log-entry.info .log-message {
  color: #87CEEB;
}

.log-entry.success .log-message {
  color: var(--success-green, #06FFA5);
}

.log-entry.warning .log-message {
  color: var(--accent-gold, #FFD23F);
}

.log-entry.error .log-message {
  color: var(--error-red, #FF006E);
}

.clear-log-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.clear-log-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .cantor-demo {
    padding: 16px;
  }
  
  .cantor-demo h1 {
    font-size: 1.5rem;
  }
  
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .demo-btn {
    width: 100%;
    max-width: 250px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .log-entry {
    flex-direction: column;
    gap: 4px;
  }
  
  .log-time {
    min-width: auto;
    font-size: 0.8rem;
  }
}
</style>