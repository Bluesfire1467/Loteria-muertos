<template>
  <div 
    class="player-board" 
    :class="{ 
      'is-winner': player.isWinner,
      'is-celebrating': isCelebrating,
      'is-near-victory': isNearVictory
    }"
    ref="boardElement"
  >
    <!-- Header compacto -->
    <div class="board-header">
      <div class="player-info">
        <div class="player-avatar">
          {{ getPlayerEmoji(player.name) }}
        </div>
        <div class="player-details">
          <h4 class="player-name">{{ player.name }}</h4>
          <div class="player-stats">
            <span class="progress-indicator">{{ markedCardsCount }}/16</span>
            <div class="difficulty-badge" v-if="botPlayer">
              {{ getDifficultyLabel(botPlayer.difficulty) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Indicadores de estado -->
      <div class="status-indicators">
        <div 
          v-if="player.isWinner"
          class="status-icon winner"
          v-motion
          :initial="{ scale: 0, rotate: -180 }"
          :enter="{ 
            scale: 1, 
            rotate: 0,
            transition: { duration: 600, ease: 'backOut' }
          }"
        >
          🏆
        </div>
        <div 
          v-else-if="isNearVictory"
          class="status-icon near-victory"
          v-motion
          :initial="{ scale: 0 }"
          :enter="{ 
            scale: [0, 1.2, 1],
            transition: { duration: 400 }
          }"
        >
          ⚡
        </div>
        <div 
          v-if="isCelebrating"
          class="celebration-burst"
          v-motion
          :initial="{ scale: 0, opacity: 0 }"
          :enter="{ 
            scale: [0, 1.5, 1], 
            opacity: [0, 1, 0],
            transition: { duration: 800 }
          }"
        >
          🎉
        </div>
      </div>
    </div>

    <!-- Mini grid de cartas -->
    <div class="mini-cards-grid">
      <div
        v-for="(card, index) in player.board"
        :key="card.id"
        class="mini-card"
        :class="{
          'is-marked': isCardMarked(card.id),
          'is-current': isCurrentCard(card.id)
        }"
        v-motion
        :initial="{ opacity: 0, scale: 0.5 }"
        :enter="{ 
          opacity: 1, 
          scale: 1,
          transition: { 
            delay: index * 20,
            duration: 200
          }
        }"
      >
        <!-- SVG miniatura -->
        <div class="mini-card-image">
          <CardSvg
            :card-id="card.id"
            :card-name="card.name"
            :is-marked="isCardMarked(card.id)"
            :is-current="isCurrentCard(card.id)"
            :animated="false"
            class="mini-card-svg"
          />
        </div>

        <!-- Marca de selección (solo calavera, el círculo ya está en CardSvg) -->
        <div 
          v-if="isCardMarked(card.id)"
          class="mini-card-mark"
          v-motion
          :initial="{ scale: 0, rotate: 180 }"
          :enter="{ 
            scale: 1, 
            rotate: 0,
            transition: { 
              duration: 300,
              ease: 'backOut'
            }
          }"
        >
          💀
        </div>

        <!-- Highlight para carta actual -->
        <div 
          v-if="isCurrentCard(card.id)"
          class="mini-card-highlight"
        ></div>
      </div>
    </div>

    <!-- Barra de progreso -->
    <div class="progress-section">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progressPercentage}%` }"
          v-motion
          :initial="{ width: '0%' }"
          :enter="{ 
            width: `${progressPercentage}%`,
            transition: { duration: 500, ease: 'easeOut' }
          }"
        ></div>
      </div>
      <div class="progress-text">{{ progressPercentage }}%</div>
    </div>

    <!-- Overlay de victoria -->
    <div 
      v-if="player.isWinner"
      class="victory-overlay"
      v-motion
      :initial="{ opacity: 0, scale: 0.8 }"
      :enter="{ 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration: 800,
          ease: 'backOut'
        }
      }"
    >
      <div class="victory-content">
        <div class="victory-icon">🎊</div>
        <div class="victory-text">¡GANÓ!</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores'
import CardSvg from '@/components/cards/CardSvg.vue'
import type { Player, BotPlayer, Difficulty } from '@/types'

// ============================================================================
// PROPS
// ============================================================================

interface Props {
  player: Player
  currentCardId?: number | null
  showDetailed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentCardId: null,
  showDetailed: false
})

// ============================================================================
// REFS
// ============================================================================

const boardElement = ref<HTMLElement>()
const isCelebrating = ref(false)

// ============================================================================
// COMPOSABLES
// ============================================================================

const gameStore = useGameStore()

// ============================================================================
// COMPUTED
// ============================================================================

const botPlayer = computed(() => {
  return props.player.type === 'bot' ? props.player as BotPlayer : null
})

const markedCardsCount = computed(() => {
  return props.player.markedCards.size
})

const progressPercentage = computed(() => {
  const totalCards = props.player.board.length || 16
  return Math.round((markedCardsCount.value / totalCards) * 100)
})

const isNearVictory = computed(() => {
  // Considerar "cerca de victoria" si tiene 75% o más de progreso
  return progressPercentage.value >= 75 && !props.player.isWinner
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Verifica si una carta está marcada
 */
function isCardMarked(cardId: number): boolean {
  return props.player.markedCards.has(cardId)
}

/**
 * Verifica si una carta es la carta actual siendo cantada
 */
function isCurrentCard(cardId: number): boolean {
  return props.currentCardId === cardId || gameStore.gameState.currentCard?.id === cardId
}

/**
 * Obtiene el emoji representativo del jugador basado en su nombre
 */
function getPlayerEmoji(playerName: string): string {
  const emojiMap: Record<string, string> = {
    'María': '👩',
    'José': '👨',
    'Carmen': '👵',
    'Diego': '🧔',
    'Esperanza': '👩‍🦳',
    'Miguel': '👨‍🦲',
    'Dolores': '👩‍🦱',
    'Francisco': '👨‍🦰',
    'Guadalupe': '👩‍🦳',
    'Antonio': '👨‍🦳'
  }
  
  return emojiMap[playerName] || '🎭'
}

/**
 * Obtiene la etiqueta de dificultad
 */
function getDifficultyLabel(difficulty: Difficulty): string {
  const labels = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil'
  }
  return labels[difficulty] || difficulty
}

/**
 * Inicia una celebración temporal
 */
function startCelebration(): void {
  isCelebrating.value = true
  setTimeout(() => {
    isCelebrating.value = false
  }, 1000)
}

/**
 * Registra el elemento del bot para animaciones
 */
function registerBotElement(): void {
  if (botPlayer.value && boardElement.value) {
    gameStore.registerBotElement(botPlayer.value.id, boardElement.value)
  }
}

/**
 * Desregistra el elemento del bot
 */
function unregisterBotElement(): void {
  if (botPlayer.value) {
    gameStore.unregisterBotElement(botPlayer.value.id)
  }
}

// ============================================================================
// WATCHERS
// ============================================================================

// Observar cambios en las cartas marcadas para activar celebraciones
watch(
  () => props.player.markedCards.size,
  (newCount, oldCount) => {
    if (newCount > oldCount && !props.player.isWinner) {
      startCelebration()
    }
  }
)

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  registerBotElement()
})

onUnmounted(() => {
  unregisterBotElement()
})
</script>

<style scoped>
.player-board {
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  position: relative;
  transition: all var(--transition-normal);
  min-width: 200px;
  max-width: 250px;
}

.player-board.is-winner {
  border-color: var(--success-green);
  box-shadow: 0 0 25px rgba(6, 255, 165, 0.3);
  animation: winner-glow 2s ease-in-out infinite;
}

.player-board.is-celebrating {
  animation: celebrate-shake 0.5s ease-in-out;
}

.player-board.is-near-victory {
  border-color: var(--primary-orange);
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.2);
}

@keyframes winner-glow {
  0%, 100% { box-shadow: 0 0 25px rgba(6, 255, 165, 0.3); }
  50% { box-shadow: 0 0 35px rgba(6, 255, 165, 0.5); }
}

@keyframes celebrate-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) rotate(-1deg); }
  75% { transform: translateX(2px) rotate(1deg); }
}

/* Header compacto */
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.player-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.player-avatar {
  font-size: var(--font-size-lg);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 211, 63, 0.1);
  border-radius: var(--border-radius-full);
  border: 1px solid rgba(255, 211, 63, 0.3);
}

.player-details {
  flex: 1;
  min-width: 0;
}

.player-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--accent-gold);
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.progress-indicator {
  font-size: var(--font-size-xs);
  color: var(--text-light);
  opacity: 0.8;
}

.difficulty-badge {
  font-size: var(--font-size-2xs);
  background: rgba(114, 9, 183, 0.2);
  color: var(--secondary-purple);
  padding: 1px 4px;
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(114, 9, 183, 0.3);
}

/* Indicadores de estado */
.status-indicators {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  position: relative;
}

.status-icon {
  font-size: var(--font-size-lg);
  line-height: 1;
}

.status-icon.winner {
  color: var(--success-green);
  filter: drop-shadow(0 0 8px rgba(6, 255, 165, 0.6));
}

.status-icon.near-victory {
  color: var(--primary-orange);
  filter: drop-shadow(0 0 6px rgba(255, 107, 53, 0.6));
  animation: near-victory-pulse 1s ease-in-out infinite;
}

@keyframes near-victory-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.celebration-burst {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: var(--font-size-xl);
  pointer-events: none;
}

/* Mini grid de cartas */
.mini-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  margin-bottom: var(--spacing-md);
  aspect-ratio: 1;
}

.mini-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all var(--transition-fast);
  /* Removido aspect-ratio para que se ajuste al grid cuadrado */
}

.mini-card.is-marked {
  border-color: var(--success-green);
  background: rgba(6, 255, 165, 0.1);
}

.mini-card.is-current {
  border-color: var(--primary-orange);
  box-shadow: 0 0 4px rgba(255, 107, 53, 0.4);
}

.mini-card-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.mini-card-svg {
  width: 100%;
  height: 100%;
}

.mini-card-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  z-index: 2;
  filter: drop-shadow(0 0 2px rgba(6, 255, 165, 0.8));
}

.mini-card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 107, 53, 0.3);
  border: 1px solid var(--primary-orange);
  animation: mini-highlight-pulse 1s ease-in-out infinite;
}

@keyframes mini-highlight-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Barra de progreso */
.progress-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-orange), var(--accent-gold));
  border-radius: var(--border-radius-full);
  transition: width var(--transition-normal);
}

.progress-text {
  font-size: var(--font-size-xs);
  color: var(--text-light);
  opacity: 0.7;
  font-weight: 500;
  min-width: 30px;
  text-align: right;
}

/* Overlay de victoria */
.victory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.victory-content {
  text-align: center;
  color: var(--success-green);
}

.victory-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
  animation: victory-spin 2s linear infinite;
}

@keyframes victory-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.victory-text {
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-shadow: 0 0 8px rgba(6, 255, 165, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .player-board {
    min-width: 160px;
    max-width: 180px;
    padding: var(--spacing-sm);
  }
  
  .player-avatar {
    width: 24px;
    height: 24px;
    font-size: var(--font-size-md);
  }
  
  .player-name {
    font-size: var(--font-size-xs);
  }
  
  .mini-cards-grid {
    gap: 1px;
  }
  
  .mini-card-mark {
    font-size: 0.5rem;
  }
}

@media (max-width: 480px) {
  .player-board {
    min-width: 140px;
    max-width: 160px;
  }
  
  .board-header {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .status-indicators {
    flex-direction: row;
    align-self: flex-end;
  }
}
</style>