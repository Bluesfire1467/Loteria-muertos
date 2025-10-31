<template>
  <div 
    class="responsive-game-layout"
    :class="[
      `layout-${gameConfig.gameLayout}`,
      `breakpoint-${breakpoint}`,
      {
        'touch-device': isTouchDevice,
        'no-hover': !supportsHover,
        'compact-mode': gameConfig.compactMode
      }
    ]"
  >
    <!-- Header con papel picado (solo desktop/tablet) -->
    <header v-if="!isMobile" class="game-header">
      <PapelPicado 
        :animated="gameConfig.showAnimations" 
        :count="gameConfig.papelPicadoCount"
        height="80"
      />
    </header>
    
    <!-- Layout principal del juego -->
    <main class="game-main" :style="mainStyles">
      
      <!-- Tableros de bots - Lado izquierdo (desktop) -->
      <aside 
        v-if="gameConfig.visibleBotBoards > 0 && gameConfig.botBoardPosition === 'sides'"
        class="bot-boards-left"
      >
        <div 
          v-for="(bot, index) in leftBots" 
          :key="`left-bot-${bot.id}`"
          class="bot-board-container"
          :style="{ transform: `scale(${gameConfig.botBoardScale})` }"
        >
          <PlayerBoard
            :player="bot"
            :cards="bot.board"
            :marked-cards="bot.markedCards"
            :is-winner="bot.isWinner"
            :compact="true"
            :show-name="gameConfig.showPlayerNames"
          />
        </div>
      </aside>
      
      <!-- Área central del juego -->
      <section class="game-center">
        
        <!-- Carta actual -->
        <div class="current-card-section">
          <CurrentCard
            v-if="currentCard"
            :card="currentCard"
            :show-description="!isMobile"
            :size="isMobile ? 'small' : 'medium'"
          />
        </div>
        
        <!-- Tablero del jugador principal -->
        <div class="player-board-section">
          <GameBoard
            :cards="playerBoard"
            :marked-cards="markedCards"
            :card-size="gameConfig.cardSize"
            :gap="gameConfig.cardGap"
            @card-click="onCardClick"
          />
        </div>
        
        <!-- Controles del juego (móvil) -->
        <div v-if="isMobile" class="mobile-controls">
          <div class="control-buttons">
            <button 
              class="btn btn-primary"
              @click="onPauseGame"
              :disabled="!gameActive"
            >
              {{ gameActive ? 'Pausar' : 'Continuar' }}
            </button>
            <button 
              class="btn btn-secondary"
              @click="onShowStats"
            >
              Stats
            </button>
          </div>
        </div>
        
      </section>
      
      <!-- Tableros de bots - Lado derecho (desktop) -->
      <aside 
        v-if="gameConfig.visibleBotBoards > 1 && gameConfig.botBoardPosition === 'sides'"
        class="bot-boards-right"
      >
        <div 
          v-for="(bot, index) in rightBots" 
          :key="`right-bot-${bot.id}`"
          class="bot-board-container"
          :style="{ transform: `scale(${gameConfig.botBoardScale})` }"
        >
          <PlayerBoard
            :player="bot"
            :cards="bot.board"
            :marked-cards="bot.markedCards"
            :is-winner="bot.isWinner"
            :compact="true"
            :show-name="gameConfig.showPlayerNames"
          />
        </div>
      </aside>
      
    </main>
    
    <!-- Tableros de bots - Parte inferior (tablet/móvil) -->
    <footer 
      v-if="gameConfig.visibleBotBoards > 0 && gameConfig.botBoardPosition === 'bottom'"
      class="bot-boards-bottom"
    >
      <div class="bot-boards-scroll">
        <div 
          v-for="bot in visibleBots" 
          :key="`bottom-bot-${bot.id}`"
          class="bot-board-container"
          :style="{ transform: `scale(${gameConfig.botBoardScale})` }"
        >
          <PlayerBoard
            :player="bot"
            :cards="bot.board"
            :marked-cards="bot.markedCards"
            :is-winner="bot.isWinner"
            :compact="true"
            :show-name="gameConfig.showPlayerNames"
          />
        </div>
      </div>
    </footer>
    
    <!-- Panel de información lateral (desktop) -->
    <aside v-if="isDesktop && gameConfig.showFullControls" class="info-panel">
      <div class="game-info">
        <div class="timer-section">
          <GameTimer />
        </div>
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-label">Cartas cantadas:</span>
            <span class="stat-value">{{ cardsDrawn }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tiempo:</span>
            <span class="stat-value">{{ gameTime }}</span>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Overlay para móvil cuando se muestran estadísticas -->
    <div 
      v-if="showMobileOverlay" 
      class="mobile-overlay"
      @click="closeMobileOverlay"
    >
      <div class="overlay-content" @click.stop>
        <button class="close-btn" @click="closeMobileOverlay">×</button>
        <div class="overlay-stats">
          <!-- Contenido de estadísticas móvil -->
          <slot name="mobile-stats" />
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGameResponsive } from '@/composables/useResponsive';
import PapelPicado from './PapelPicado.vue';
import PlayerBoard from './PlayerBoard.vue';
import GameBoard from './GameBoard.vue';
import CurrentCard from './CurrentCard.vue';
import GameTimer from './GameTimer.vue';
import type { Player, LoteriaCard } from '@/types';

interface Props {
  playerBoard: LoteriaCard[];
  markedCards: Set<number>;
  bots: Player[];
  currentCard?: LoteriaCard;
  gameActive: boolean;
  cardsDrawn: number;
  gameTime: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cardClick: [cardId: number];
  pauseGame: [];
  showStats: [];
}>();

const { 
  isMobile, 
  isTablet, 
  isDesktop, 
  breakpoint, 
  isTouchDevice, 
  supportsHover,
  gameConfig 
} = useGameResponsive();

const showMobileOverlay = ref(false);

// Distribución de bots según el layout
const leftBots = computed(() => {
  const half = Math.ceil(props.bots.length / 2);
  return props.bots.slice(0, half);
});

const rightBots = computed(() => {
  const half = Math.ceil(props.bots.length / 2);
  return props.bots.slice(half);
});

const visibleBots = computed(() => {
  return props.bots.slice(0, gameConfig.value.visibleBotBoards);
});

// Estilos dinámicos para el layout principal
const mainStyles = computed(() => {
  const styles: Record<string, string> = {};
  
  if (isMobile.value) {
    styles.padding = 'var(--spacing-sm)';
    styles.gap = 'var(--spacing-sm)';
  } else if (isTablet.value) {
    styles.padding = 'var(--spacing-md)';
    styles.gap = 'var(--spacing-md)';
  } else {
    styles.padding = 'var(--spacing-lg)';
    styles.gap = 'var(--spacing-lg)';
  }
  
  return styles;
});

// Event handlers
const onCardClick = (cardId: number) => {
  emit('cardClick', cardId);
};

const onPauseGame = () => {
  emit('pauseGame');
};

const onShowStats = () => {
  if (isMobile.value) {
    showMobileOverlay.value = true;
  }
  emit('showStats');
};

const closeMobileOverlay = () => {
  showMobileOverlay.value = false;
};
</script>

<style scoped>
.responsive-game-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--gradient-night);
  position: relative;
}

/* Header */
.game-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(45, 27, 105, 0.9);
  backdrop-filter: blur(10px);
}

/* Layout principal */
.game-main {
  display: grid;
  flex: 1;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

/* Layouts por breakpoint */
.layout-full .game-main {
  grid-template-columns: 200px 1fr 200px 150px;
  grid-template-areas: "left-bots center right-bots info";
}

.layout-compact .game-main {
  grid-template-columns: 150px 1fr 150px;
  grid-template-areas: "left-bots center right-bots";
}

.layout-stack .game-main {
  grid-template-columns: 1fr;
  grid-template-areas: "center";
}

/* Áreas del grid */
.bot-boards-left {
  grid-area: left-bots;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.game-center {
  grid-area: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  max-width: 600px;
  margin: 0 auto;
}

.bot-boards-right {
  grid-area: right-bots;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.info-panel {
  grid-area: info;
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-primary);
}

/* Secciones del centro */
.current-card-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.player-board-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Controles móviles */
.mobile-controls {
  width: 100%;
  margin-top: var(--spacing-md);
}

.control-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

.control-buttons .btn {
  flex: 1;
  max-width: 120px;
}

/* Tableros de bots en la parte inferior */
.bot-boards-bottom {
  background: rgba(45, 27, 105, 0.9);
  backdrop-filter: blur(10px);
  padding: var(--spacing-sm);
  border-top: 1px solid var(--border-primary);
}

.bot-boards-scroll {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding: var(--spacing-xs) 0;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-gold) transparent;
}

.bot-boards-scroll::-webkit-scrollbar {
  height: 4px;
}

.bot-boards-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.bot-boards-scroll::-webkit-scrollbar-thumb {
  background: var(--accent-gold);
  border-radius: 2px;
}

/* Contenedores de tableros de bots */
.bot-board-container {
  flex-shrink: 0;
  transition: transform var(--transition-normal);
  transform-origin: center;
}

.bot-board-container:hover {
  transform: scale(calc(var(--scale, 0.5) * 1.05)) !important;
}

/* Panel de información */
.game-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.timer-section {
  text-align: center;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  color: var(--accent-gold);
  font-weight: 600;
}

/* Overlay móvil */
.mobile-overlay {
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
  padding: var(--spacing-md);
}

.overlay-content {
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-primary);
}

.close-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  transition: background-color var(--transition-normal);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .layout-full .game-main {
    grid-template-columns: 120px 1fr 120px;
    grid-template-areas: "left-bots center right-bots";
  }
}

@media (max-width: 768px) {
  .game-main {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
  
  .game-center {
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .game-main {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }
  
  .game-center {
    gap: var(--spacing-sm);
  }
  
  .overlay-content {
    padding: var(--spacing-md);
  }
}

/* Touch device optimizations */
.touch-device .bot-board-container:hover {
  transform: scale(var(--scale, 0.5)) !important;
}

.touch-device .control-buttons .btn {
  min-height: 48px;
}

/* No hover device optimizations */
.no-hover .bot-board-container:hover {
  transform: scale(var(--scale, 0.5)) !important;
}
</style>