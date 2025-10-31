<template>
  <div class="audio-controls" :class="{ 'audio-controls--disabled': !isEnabled }">
    <!-- Control principal de audio -->
    <div class="audio-controls__main">
      <button 
        @click="toggleAudio"
        class="audio-controls__toggle"
        :class="{ 'audio-controls__toggle--muted': !isEnabled }"
        :title="isEnabled ? 'Desactivar audio' : 'Activar audio'"
      >
        <svg v-if="isEnabled" class="audio-controls__icon" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
        <svg v-else class="audio-controls__icon" viewBox="0 0 24 24">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      </button>

      <!-- Indicador de música reproduciéndose -->
      <div 
        v-if="isMusicPlaying && isEnabled" 
        class="audio-controls__music-indicator"
        title="Música reproduciéndose"
      >
        <div class="audio-controls__wave"></div>
        <div class="audio-controls__wave"></div>
        <div class="audio-controls__wave"></div>
      </div>
    </div>

    <!-- Controles expandidos -->
    <div v-if="showExpanded" class="audio-controls__expanded">
      <!-- Volumen maestro -->
      <div class="audio-controls__volume-group">
        <label class="audio-controls__label">
          <svg class="audio-controls__volume-icon" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          Volumen General
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          :value="masterVolume"
          @input="setMasterVolume(parseFloat($event.target.value))"
          class="audio-controls__slider"
          :disabled="!isEnabled"
        />
        <span class="audio-controls__value">{{ Math.round(masterVolume * 100) }}%</span>
      </div>

      <!-- Volumen de música -->
      <div class="audio-controls__volume-group">
        <label class="audio-controls__label">
          <svg class="audio-controls__volume-icon" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          Música
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          :value="musicVolume"
          @input="setMusicVolume(parseFloat($event.target.value))"
          class="audio-controls__slider"
          :disabled="!isEnabled"
        />
        <span class="audio-controls__value">{{ Math.round(musicVolume * 100) }}%</span>
      </div>

      <!-- Volumen de efectos -->
      <div class="audio-controls__volume-group">
        <label class="audio-controls__label">
          <svg class="audio-controls__volume-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Efectos
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          :value="sfxVolume"
          @input="setSfxVolume(parseFloat($event.target.value))"
          class="audio-controls__slider"
          :disabled="!isEnabled"
        />
        <span class="audio-controls__value">{{ Math.round(sfxVolume * 100) }}%</span>
      </div>

      <!-- Controles de música -->
      <div class="audio-controls__music-controls">
        <button
          @click="toggleBackgroundMusic"
          class="audio-controls__music-btn"
          :disabled="!isEnabled"
          :title="isMusicPlaying ? 'Pausar música' : 'Reproducir música'"
        >
          <svg v-if="isMusicPlaying" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>

        <button
          @click="stopBackgroundMusic"
          class="audio-controls__music-btn"
          :disabled="!isEnabled"
          title="Detener música"
        >
          <svg viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Botón para expandir/contraer controles -->
    <button
      @click="showExpanded = !showExpanded"
      class="audio-controls__expand"
      :class="{ 'audio-controls__expand--expanded': showExpanded }"
      title="Mostrar/ocultar controles de audio"
    >
      <svg viewBox="0 0 24 24">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAudio } from '@/composables/useAudio'

// Props
interface Props {
  compact?: boolean
  autoInit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  autoInit: true
})

// Estado local
const showExpanded = ref(!props.compact)

// Composable de audio
const {
  isEnabled,
  isMusicPlaying,
  masterVolume,
  musicVolume,
  sfxVolume,
  initAudio,
  toggleAudio,
  toggleBackgroundMusic,
  stopBackgroundMusic,
  setMasterVolume,
  setMusicVolume,
  setSfxVolume,
  playCardClick
} = useAudio()

// Inicialización
onMounted(async () => {
  if (props.autoInit) {
    try {
      await initAudio()
    } catch (error) {
      console.warn('No se pudo inicializar el audio automáticamente:', error)
    }
  }
})

// Reproducir sonido de click en los controles
const handleControlClick = () => {
  playCardClick()
}
</script>

<style scoped>
.audio-controls {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.audio-controls--disabled {
  opacity: 0.6;
}

.audio-controls__main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audio-controls__toggle {
  background: var(--primary-orange);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.audio-controls__toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
}

.audio-controls__toggle--muted {
  background: var(--error-red);
  box-shadow: 0 2px 8px rgba(255, 0, 110, 0.3);
}

.audio-controls__icon {
  width: 24px;
  height: 24px;
  fill: white;
}

.audio-controls__music-indicator {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  background: var(--accent-gold);
  border-radius: 12px;
}

.audio-controls__wave {
  width: 3px;
  height: 12px;
  background: var(--background-dark);
  border-radius: 2px;
  animation: wave 1.5s ease-in-out infinite;
}

.audio-controls__wave:nth-child(2) {
  animation-delay: 0.2s;
}

.audio-controls__wave:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

.audio-controls__expanded {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audio-controls__volume-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.audio-controls__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 100px;
}

.audio-controls__volume-icon {
  width: 16px;
  height: 16px;
  fill: var(--text-secondary);
}

.audio-controls__slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-tertiary);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.audio-controls__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-orange);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.audio-controls__slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4);
}

.audio-controls__slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.audio-controls__value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}

.audio-controls__music-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.audio-controls__music-btn {
  background: var(--secondary-purple);
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.audio-controls__music-btn:hover:not(:disabled) {
  background: var(--secondary-purple-hover, #8a2be2);
  transform: translateY(-2px);
}

.audio-controls__music-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.audio-controls__music-btn svg {
  width: 20px;
  height: 20px;
  fill: white;
}

.audio-controls__expand {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  align-self: center;
  margin-top: 8px;
}

.audio-controls__expand:hover {
  background: var(--bg-tertiary);
}

.audio-controls__expand svg {
  width: 20px;
  height: 20px;
  fill: var(--text-secondary);
  transition: transform 0.3s ease;
}

.audio-controls__expand--expanded svg {
  transform: rotate(180deg);
}

/* Responsive */
@media (max-width: 768px) {
  .audio-controls__volume-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .audio-controls__label {
    min-width: auto;
    justify-content: center;
  }
}
</style>