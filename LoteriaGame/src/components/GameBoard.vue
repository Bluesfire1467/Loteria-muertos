<template>
  <div 
    class="game-board" 
    :class="{ 
      'is-player-board': isPlayerBoard,
      'is-bot-board': !isPlayerBoard,
      'is-winner': player?.isWinner
    }"
  >
    <!-- Header del tablero -->
    <div class="board-header">
      <h3 class="player-name">{{ player?.name || 'Jugador' }}</h3>
      <div class="player-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ markedCardsCount }}/{{ boardCards.length }}</span>
      </div>
    </div>

    <!-- Grid de cartas 4x4 -->
    <div class="cards-grid">
      <div
        v-for="(card, index) in boardCards"
        :key="card.id"
        class="card-slot"
        :class="{
          'is-marked': isCardMarked(card.id),
          'is-current': isCurrentCard(card.id),
          'is-clickable': isPlayerBoard && canMarkCard(card.id)
        }"
        @click="handleCardClick(card.id)"
        v-motion
        :initial="{ opacity: 0, scale: 0.8 }"
        :enter="{ 
          opacity: 1, 
          scale: 1,
          transition: { 
            delay: index * 50,
            duration: 300,
            ease: 'easeOut'
          }
        }"
      >
        <!-- SVG de la carta -->
        <div class="card-image">
          <CardSvg
            :card-id="card.id"
            :card-name="card.name"
            :is-marked="isCardMarked(card.id)"
            :is-current="isCurrentCard(card.id)"
            :animated="true"
            class="card-svg"
          />
        </div>

        <!-- Overlay de marca (solo calavera, ya que el círculo está en CardSvg) -->
        <div 
          v-if="isCardMarked(card.id)"
          class="card-mark"
          v-motion
          :initial="{ scale: 0, rotate: -180 }"
          :enter="{ 
            scale: 1, 
            rotate: 0,
            transition: { 
              duration: 500,
              ease: 'backOut'
            }
          }"
        >
          <div class="mark-icon">💀</div>
        </div>

        <!-- Highlight para carta actual -->
        <div 
          v-if="isCurrentCard(card.id)"
          class="card-highlight"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ 
            opacity: 1,
            transition: { 
              duration: 300,
              repeat: Infinity,
              repeatType: 'reverse'
            }
          }"
        ></div>
      </div>
    </div>

    <!-- Indicador de victoria -->
    <div 
      v-if="player?.isWinner"
      class="victory-indicator"
      v-motion
      :initial="{ scale: 0, opacity: 0 }"
      :enter="{ 
        scale: 1, 
        opacity: 1,
        transition: { 
          duration: 600,
          ease: 'backOut'
        }
      }"
    >
      <div class="victory-content">
        <div class="victory-icon">🏆</div>
        <div class="victory-text">¡LOTERÍA!</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores'
import CardSvg from '@/components/cards/CardSvg.vue'
import type { Player, LoteriaCard } from '@/types'

// ============================================================================
// PROPS
// ============================================================================

interface Props {
  player?: Player
  isPlayerBoard?: boolean
  boardCards?: LoteriaCard[]
  markedCards?: Set<number>
  currentCardId?: number | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPlayerBoard: false,
  boardCards: () => [],
  markedCards: () => new Set(),
  currentCardId: null,
  disabled: false
})

// ============================================================================
// EMITS
// ============================================================================

interface Emits {
  cardClicked: [cardId: number]
  cardMarked: [cardId: number]
}

const emit = defineEmits<Emits>()

// ============================================================================
// COMPOSABLES
// ============================================================================

const gameStore = useGameStore()

// ============================================================================
// COMPUTED
// ============================================================================

const markedCardsCount = computed(() => {
  return props.player?.markedCards.size || props.markedCards.size || 0
})

const progressPercentage = computed(() => {
  const totalCards = props.boardCards.length || 16
  return Math.round((markedCardsCount.value / totalCards) * 100)
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Verifica si una carta está marcada
 */
function isCardMarked(cardId: number): boolean {
  return props.player?.markedCards.has(cardId) || props.markedCards.has(cardId) || false
}

/**
 * Verifica si una carta es la carta actual siendo cantada
 */
function isCurrentCard(cardId: number): boolean {
  return props.currentCardId === cardId || gameStore.gameState.currentCard?.id === cardId
}

/**
 * Verifica si se puede marcar una carta
 */
function canMarkCard(cardId: number): boolean {
  if (props.disabled || !props.isPlayerBoard) return false
  if (isCardMarked(cardId)) return false
  
  // Solo se puede marcar si es la carta actual
  const currentCard = gameStore.gameState.currentCard
  return currentCard?.id === cardId
}

/**
 * Maneja el click en una carta
 */
function handleCardClick(cardId: number): void {
  if (!canMarkCard(cardId)) return
  
  emit('cardClicked', cardId)
  
  // Si es el tablero del jugador, intentar marcar la carta
  if (props.isPlayerBoard && props.player) {
    const result = gameStore.markCard(props.player.id, cardId)
    if (result.success) {
      emit('cardMarked', cardId)
    }
  }
}
</script>

<style scoped>
.game-board {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-lg);
  border: 2px solid rgba(255, 211, 63, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  transition: all var(--transition-normal);
}

.game-board.is-player-board {
  border-color: var(--accent-gold);
  box-shadow: 0 0 30px rgba(255, 211, 63, 0.2);
}

.game-board.is-bot-board {
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(0.8);
}

.game-board.is-winner {
  border-color: var(--success-green);
  box-shadow: 0 0 40px rgba(6, 255, 165, 0.4);
  animation: victory-pulse 2s ease-in-out infinite;
}

@keyframes victory-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Header del tablero */
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 211, 63, 0.2);
}

.player-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--accent-gold);
  margin: 0;
}

.player-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-bar {
  width: 80px;
  height: 8px;
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
  font-size: var(--font-size-sm);
  color: var(--text-light);
  opacity: 0.8;
  font-weight: 500;
}

/* Grid de cartas */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
  aspect-ratio: 1;
}

.card-slot {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: default;
  /* Removido aspect-ratio para que se ajuste al grid cuadrado */
  /* Asegurar que nada se salga del contenedor */
  contain: layout style paint;
}

.card-slot.is-clickable {
  cursor: pointer;
}

.card-slot.is-clickable:hover {
  /* Removido translateY para evitar que las cartas se salgan del contenedor */
  border-color: var(--accent-gold);
  box-shadow: 0 4px 15px rgba(255, 211, 63, 0.2);
}

.card-slot.is-marked {
  border-color: var(--success-green);
  background: rgba(6, 255, 165, 0.1);
}

.card-slot.is-current {
  border-color: var(--primary-orange);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
}

/* SVG de la carta */
.card-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; /* Ocupar todo el espacio, el nombre ya está en el SVG */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-svg {
  width: 100%;
  height: 100%;
  transition: transform var(--transition-normal);
}

.card-slot:hover .card-svg {
  /* Removido el scale para evitar que las cartas se salgan del contenedor */
}

/* Nombre de la carta - Ya no se usa porque está incluido en el SVG */

/* Marca de carta seleccionada */
.card-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.mark-icon {
  font-size: 1.5rem; /* Reducido para que no se salga del contenedor */
  filter: drop-shadow(0 0 10px rgba(6, 255, 165, 0.8));
  animation: mark-glow 2s ease-in-out infinite;
}

@keyframes mark-glow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(6, 255, 165, 0.8)); }
  50% { filter: drop-shadow(0 0 20px rgba(6, 255, 165, 1)); }
}

/* Highlight para carta actual */
.card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 107, 53, 0.2);
  border: 2px solid var(--primary-orange);
  border-radius: var(--border-radius-md);
  pointer-events: none;
}

/* Indicador de victoria */
.victory-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  background: rgba(0, 0, 0, 0.9);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  border: 3px solid var(--success-green);
  box-shadow: 0 0 40px rgba(6, 255, 165, 0.6);
}

.victory-content {
  text-align: center;
  color: var(--success-green);
}

.victory-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-sm);
  animation: victory-bounce 1s ease-in-out infinite;
}

@keyframes victory-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.victory-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  text-shadow: 0 0 10px rgba(6, 255, 165, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .game-board.is-bot-board {
    transform: scale(0.7);
  }
  
  .cards-grid {
    gap: var(--spacing-xs);
  }
  
  .card-name {
    font-size: var(--font-size-2xs);
    padding: 2px;
  }
  
  .mark-icon {
    font-size: 1rem; /* Más pequeño en móviles */
  }
}

@media (max-width: 480px) {
  .board-header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }
  
  .player-progress {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .progress-bar {
    flex: 1;
    margin-right: var(--spacing-sm);
  }
}
</style>