<template>
  <div class="game-view">
    <!-- Header del juego -->
    <header class="game-header">
      <div class="game-info">
        <h1 class="game-title">Lotería Día de Muertos</h1>
        <div class="game-status">
          <span class="status-indicator" :class="gameStatusClass">
            {{ gameStatusText }}
          </span>
          <div class="game-timer" v-if="gameStore.isGameActive">
            ⏱️ {{ formatTime(gameStore.currentGameDuration) }}
          </div>
        </div>
      </div>
      
      <div class="game-controls">
        <button 
          class="btn btn-outline btn-sm"
          @click="togglePause"
          v-if="gameStore.isGameActive"
        >
          {{ gameStore.gameState.gameStatus === 'playing' ? '⏸️ Pausar' : '▶️ Continuar' }}
        </button>
        
        <button 
          class="btn btn-secondary btn-sm"
          @click="showExitConfirm = true"
        >
          🚪 Salir
        </button>
      </div>
    </header>

    <!-- Layout principal del juego -->
    <main class="game-main" v-if="gameStore.gameState.currentGame">
      <!-- Tableros de bots (izquierda) -->
      <aside class="bots-sidebar left-sidebar">
        <div class="sidebar-title">Oponentes</div>
        <div class="bot-boards">
          <PlayerBoard
            v-for="bot in leftBots"
            :key="bot.id"
            :player="bot"
            :current-card-id="gameStore.gameState.currentCard?.id"
            class="bot-board"
          />
        </div>
      </aside>

      <!-- Área central -->
      <section class="game-center">
        <!-- Carta actual -->
        <div class="current-card-section">
          <CurrentCard
            :show-controls="true"
            :show-cultural-info="true"
            :show-history="false"
            @card-called="onCardCalled"
            @cantor-started="onCantorStarted"
            @cantor-stopped="onCantorStopped"
          />
        </div>

        <!-- Tablero del jugador -->
        <div class="player-board-section">
          <GameBoard
            v-if="humanPlayer"
            :player="humanPlayer"
            :is-player-board="true"
            :board-cards="humanPlayer.board"
            :marked-cards="humanPlayer.markedCards"
            :current-card-id="gameStore.gameState.currentCard?.id"
            @card-clicked="onPlayerCardClick"
            @card-marked="onPlayerCardMarked"
            class="main-game-board"
          />
        </div>
      </section>

      <!-- Tableros de bots (derecha) -->
      <aside class="bots-sidebar right-sidebar">
        <div class="sidebar-title">Oponentes</div>
        <div class="bot-boards">
          <PlayerBoard
            v-for="bot in rightBots"
            :key="bot.id"
            :player="bot"
            :current-card-id="gameStore.gameState.currentCard?.id"
            class="bot-board"
          />
        </div>
      </aside>
    </main>

    <!-- Estado de carga o sin juego -->
    <div v-else class="no-game-state">
      <div class="no-game-content">
        <div class="no-game-icon">🎲</div>
        <h2>No hay partida activa</h2>
        <p>Inicia una nueva partida para comenzar a jugar</p>
        <router-link to="/" class="btn btn-primary">
          🏠 Volver al Inicio
        </router-link>
      </div>
    </div>

    <!-- Modal de confirmación de salida -->
    <div v-if="showExitConfirm" class="modal-overlay" @click="showExitConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>¿Salir de la partida?</h3>
        <p>Se perderá el progreso de la partida actual.</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showExitConfirm = false">
            Cancelar
          </button>
          <button class="btn btn-primary" @click="exitGame">
            Salir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de victoria -->
    <div v-if="gameStore.isGameFinished && gameStore.gameState.winner && gameStore.gameState.cardsDrawn.length >= 4" class="victory-modal">
      <div class="victory-content">
        <div class="victory-animation">
          <div class="victory-icon">🏆</div>
          <div class="victory-confetti">
            <span v-for="i in 20" :key="i" class="confetti-piece"></span>
          </div>
        </div>
        
        <h2 class="victory-title">
          {{ gameStore.gameState.winner.type === 'human' ? '¡LOTERÍA!' : '¡Partida Terminada!' }}
        </h2>
        
        <p class="victory-message">
          {{ getVictoryMessage() }}
        </p>
        
        <div class="victory-stats">
          <div class="victory-stat">
            <span class="stat-label">Duración:</span>
            <span class="stat-value">{{ formatTime(gameStore.currentGameDuration) }}</span>
          </div>
          <div class="victory-stat">
            <span class="stat-label">Cartas cantadas:</span>
            <span class="stat-value">{{ gameStore.gameState.cardsDrawn.length }}</span>
          </div>
        </div>
        
        <div class="victory-actions">
          <button class="btn btn-primary" @click="startNewGame">
            🎮 Nueva Partida
          </button>
          <router-link to="/" class="btn btn-outline">
            🏠 Inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores'
import GameBoard from '@/components/GameBoard.vue'
import PlayerBoard from '@/components/PlayerBoard.vue'
import CurrentCard from '@/components/CurrentCard.vue'
import type { LoteriaCard, BotPlayer } from '@/types'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const gameStore = useGameStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const showExitConfirm = ref(false)
const lastScrollPosition = ref(0)

// ============================================================================
// COMPUTED
// ============================================================================

const humanPlayer = computed(() => gameStore.humanPlayer)

const botPlayers = computed(() => gameStore.botPlayers)

const leftBots = computed(() => {
  const bots = botPlayers.value
  return bots.slice(0, Math.ceil(bots.length / 2))
})

const rightBots = computed(() => {
  const bots = botPlayers.value
  return bots.slice(Math.ceil(bots.length / 2))
})

const gameStatusClass = computed(() => {
  const status = gameStore.gameState.gameStatus
  return {
    'status-waiting': status === 'waiting',
    'status-playing': status === 'playing',
    'status-finished': status === 'finished'
  }
})

const gameStatusText = computed(() => {
  const status = gameStore.gameState.gameStatus
  switch (status) {
    case 'waiting': return 'Esperando'
    case 'playing': return 'En juego'
    case 'finished': return 'Terminado'
    default: return 'Desconocido'
  }
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Maneja el click en una carta del jugador
 */
function onPlayerCardClick(cardId: number): void {
  console.log(`🎯 Jugador hizo click en carta: ${cardId}`)
}

/**
 * Maneja cuando el jugador marca una carta
 */
function onPlayerCardMarked(cardId: number): void {
  console.log(`✅ Jugador marcó carta: ${cardId}`)
  
  // Verificar si el jugador ganó
  if (humanPlayer.value?.isWinner) {
    console.log('🏆 ¡El jugador humano ha ganado!')
  }
}

/**
 * Maneja cuando se canta una nueva carta
 */
function onCardCalled(card: LoteriaCard): void {
  console.log(`🎤 Nueva carta cantada: ${card.name}`)
}

/**
 * Maneja cuando se inicia el cantor
 */
function onCantorStarted(): void {
  console.log('🎤 Cantor iniciado')
}

/**
 * Maneja cuando se detiene el cantor
 */
function onCantorStopped(): void {
  console.log('🎤 Cantor detenido')
}

/**
 * Alterna entre pausar y reanudar el juego
 */
function togglePause(): void {
  gameStore.togglePause()
}

/**
 * Sale del juego actual
 */
function exitGame(): void {
  gameStore.resetGame()
  showExitConfirm.value = false
  router.push('/')
}

/**
 * Inicia una nueva partida
 */
function startNewGame(): void {
  gameStore.resetGame()
  gameStore.startNewGame('Jugador')
}

/**
 * Obtiene el mensaje de victoria apropiado
 */
function getVictoryMessage(): string {
  const winner = gameStore.gameState.winner
  if (!winner) return ''
  
  if (winner.type === 'human') {
    return '¡Felicidades! Has ganado esta partida de lotería.'
  } else {
    return `${winner.name} ha ganado esta partida. ¡Mejor suerte la próxima vez!`
  }
}

/**
 * Formatea el tiempo en formato mm:ss
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Verifica si hay un juego activo al cargar la vista
 */
function checkGameState(): void {
  // Solo redirigir si no hay juego Y no hay ganador (es decir, nunca hubo un juego)
  if (!gameStore.gameState.currentGame && !gameStore.gameState.winner) {
    console.log('⚠️ No hay juego activo, redirigiendo al inicio')
    router.push('/')
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

// Watcher para detectar cambios inesperados en el estado del juego
watch(() => gameStore.gameState.gameStatus, (newStatus, oldStatus) => {
  console.log(`🎮 Estado del juego cambió: ${oldStatus} → ${newStatus}`)
  
  if (newStatus === 'finished' && oldStatus === 'playing') {
    console.log(`🏁 Juego terminado - Ganador: ${gameStore.gameState.winner?.name || 'Ninguno'}`)
    console.log(`📊 Cartas cantadas: ${gameStore.gameState.cardsDrawn.length}`)
  }
})

// Watcher para prevenir scroll automático cuando cambia la carta actual
watch(() => gameStore.gameState.currentCard, (newCard, oldCard) => {
  if (newCard && oldCard && newCard.id !== oldCard.id) {
    // Guardar posición actual del scroll
    lastScrollPosition.value = window.scrollY
    
    // Restaurar posición después del próximo tick (después del re-render)
    nextTick(() => {
      if (Math.abs(window.scrollY - lastScrollPosition.value) > 50) {
        // Solo restaurar si el scroll cambió significativamente
        window.scrollTo({
          top: lastScrollPosition.value,
          behavior: 'instant' // Sin animación para evitar conflictos
        })
        console.log(`📜 Scroll restaurado a posición: ${lastScrollPosition.value}`)
      }
    })
  }
})

/**
 * Maneja el evento de scroll para guardar la posición
 */
function handleScroll(): void {
  lastScrollPosition.value = window.scrollY
}

onMounted(() => {
  console.log('🎮 Vista de juego cargada')
  console.log(`🎮 Estado inicial: ${gameStore.gameState.gameStatus}`)
  checkGameState()
  
  // Agregar listener para el scroll
  window.addEventListener('scroll', handleScroll, { passive: true })
  lastScrollPosition.value = window.scrollY
})

onUnmounted(() => {
  console.log('🎮 Vista de juego desmontada')
  
  // Remover listener del scroll
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--secondary-purple) 100%);
  display: flex;
  flex-direction: column;
  /* Prevenir scroll automático durante actualizaciones */
  scroll-behavior: auto;
  overflow-anchor: none;
}

/* Header del juego */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 211, 63, 0.2);
}

.game-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.game-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--accent-gold);
  margin: 0;
}

.game-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.status-indicator {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.status-indicator.status-waiting {
  background: rgba(255, 211, 63, 0.2);
  color: var(--accent-gold);
}

.status-indicator.status-playing {
  background: rgba(6, 255, 165, 0.2);
  color: var(--success-green);
}

.status-indicator.status-finished {
  background: rgba(255, 107, 53, 0.2);
  color: var(--primary-orange);
}

.game-timer {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--text-light);
}

.game-controls {
  display: flex;
  gap: var(--spacing-sm);
}

/* Layout principal */
.game-main {
  flex: 1;
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  min-height: 0;
  /* Estabilizar el layout para prevenir reflows */
  contain: layout style;
  will-change: auto;
}

.bots-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.sidebar-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--accent-gold);
  text-align: center;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
}

.bot-boards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.bot-board {
  flex-shrink: 0;
}

/* Área central */
.game-center {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-height: 0;
  /* Prevenir scroll automático durante animaciones */
  contain: layout;
}

.current-card-section {
  flex-shrink: 0;
  /* Estabilizar el componente de carta actual */
  contain: layout style;
  /* Hacer más compacto */
  margin-bottom: var(--spacing-sm);
}

.player-board-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.main-game-board {
  max-width: 600px;
  width: 100%;
}

/* Estado sin juego */
.no-game-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
}

.no-game-content {
  text-align: center;
  max-width: 400px;
}

.no-game-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.no-game-content h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
  color: var(--accent-gold);
}

.no-game-content p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.8;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--background-dark);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-2xl);
  max-width: 400px;
  width: 90%;
  text-align: center;
  border: 2px solid var(--accent-gold);
}

.modal-content h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--accent-gold);
}

.modal-content p {
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

/* Modal de victoria */
.victory-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.victory-content {
  background: linear-gradient(135deg, var(--primary-orange), var(--secondary-purple));
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-2xl);
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.victory-animation {
  position: relative;
  margin-bottom: var(--spacing-xl);
}

.victory-icon {
  font-size: 4rem;
  animation: victory-bounce 1s ease-in-out infinite;
}

@keyframes victory-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

.victory-confetti {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--accent-gold);
  animation: confetti-fall 3s linear infinite;
}

.confetti-piece:nth-child(odd) {
  background: var(--success-green);
}

.confetti-piece:nth-child(3n) {
  background: var(--primary-orange);
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(400px) rotate(360deg);
    opacity: 0;
  }
}

.victory-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.victory-message {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.victory-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
}

.victory-stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--accent-gold);
}

.victory-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .game-main {
    grid-template-columns: 200px 1fr 200px;
  }
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .game-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .left-sidebar {
    order: 1;
  }
  
  .game-center {
    order: 2;
  }
  
  .right-sidebar {
    order: 3;
  }
  
  .bots-sidebar {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }
  
  .bot-boards {
    flex-direction: row;
    min-width: max-content;
  }
  
  .bot-board {
    flex-shrink: 0;
    width: 180px;
  }
}

@media (max-width: 480px) {
  .game-main {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
  
  .victory-actions {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

/* Animaciones de entrada */
.game-view {
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>