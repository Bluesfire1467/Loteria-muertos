<template>
  <Teleport to="body">
    <Transition
      name="achievement-notification"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="visible && achievement"
        class="achievement-notification"
        :class="[
          `achievement-${achievement.category}`,
          { 'achievement-celebrating': isCelebrating }
        ]"
        @click="handleClick"
      >
        <!-- Fondo decorativo -->
        <div class="achievement-background">
          <div class="papel-picado"></div>
          <div class="cempasuchil-pattern"></div>
        </div>

        <!-- Contenido principal -->
        <div class="achievement-content">
          <!-- Icono del logro -->
          <div class="achievement-icon" ref="iconRef">
            <span class="icon-emoji">{{ achievement.icon }}</span>
            <div class="icon-glow"></div>
          </div>

          <!-- Información del logro -->
          <div class="achievement-info">
            <div class="achievement-header">
              <span class="achievement-label">¡Logro Desbloqueado!</span>
              <button 
                class="close-button"
                @click.stop="handleClose"
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>
            
            <h3 class="achievement-name">{{ achievement.name }}</h3>
            <p class="achievement-description">{{ achievement.description }}</p>
            
            <!-- Categoría y fecha -->
            <div class="achievement-meta">
              <span class="achievement-category">
                {{ getCategoryLabel(achievement.category) }}
              </span>
              <span class="achievement-date">
                {{ formatUnlockDate(achievement.unlockedAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Efectos de celebración -->
        <div class="celebration-effects" ref="celebrationRef">
          <div class="confetti-container">
            <div 
              v-for="i in 12" 
              :key="`confetti-${i}`"
              class="confetti-piece"
              :style="getConfettiStyle(i)"
            ></div>
          </div>
          
          <div class="sparkles-container">
            <div 
              v-for="i in 8" 
              :key="`sparkle-${i}`"
              class="sparkle"
              :style="getSparkleStyle(i)"
            >
              ✨
            </div>
          </div>
        </div>

        <!-- Barra de progreso (para logros con progreso) -->
        <div 
          v-if="achievement.maxProgress > 1"
          class="achievement-progress"
        >
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: '100%' }"
            ></div>
          </div>
          <span class="progress-text">
            {{ achievement.progress }} / {{ achievement.maxProgress }}
          </span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useMotion } from '@vueuse/motion'
import type { Achievement, AchievementCategory } from '@/types'

// ============================================================================
// PROPS Y EMITS
// ============================================================================

interface Props {
  achievement: Achievement | null
  visible: boolean
  autoHide?: boolean
  duration?: number
  playSound?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'click', achievement: Achievement): void
}

const props = withDefaults(defineProps<Props>(), {
  autoHide: true,
  duration: 5000,
  playSound: true
})

const emit = defineEmits<Emits>()

// ============================================================================
// ESTADO REACTIVO
// ============================================================================

const isCelebrating = ref(false)
const iconRef = ref<HTMLElement>()
const celebrationRef = ref<HTMLElement>()
const autoHideTimer = ref<number>()

// ============================================================================
// COMPUTED
// ============================================================================

const categoryColors = computed(() => ({
  gameplay: '#FF6B35',
  milestone: '#7209B7', 
  seasonal: '#FFD23F'
}))

// ============================================================================
// MÉTODOS
// ============================================================================

/**
 * Obtiene la etiqueta de la categoría en español
 */
function getCategoryLabel(category: AchievementCategory): string {
  const labels = {
    gameplay: 'Jugabilidad',
    milestone: 'Hito',
    seasonal: 'Estacional'
  }
  return labels[category] || category
}

/**
 * Formatea la fecha de desbloqueo
 */
function formatUnlockDate(date?: Date): string {
  if (!date) return ''
  
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 1) return 'Ahora mismo'
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours}h`
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

/**
 * Genera estilos aleatorios para confetti
 */
function getConfettiStyle(index: number): Record<string, string> {
  const colors = ['#FF6B35', '#7209B7', '#FFD23F', '#06FFA5', '#FF006E']
  const randomColor = colors[index % colors.length]
  const randomDelay = Math.random() * 0.5
  const randomDuration = 1 + Math.random() * 0.5
  const randomX = Math.random() * 100
  
  return {
    '--confetti-color': randomColor,
    '--confetti-delay': `${randomDelay}s`,
    '--confetti-duration': `${randomDuration}s`,
    '--confetti-x': `${randomX}%`
  }
}

/**
 * Genera estilos aleatorios para sparkles
 */
function getSparkleStyle(index: number): Record<string, string> {
  const randomDelay = Math.random() * 1
  const randomDuration = 0.8 + Math.random() * 0.4
  const randomX = 10 + Math.random() * 80
  const randomY = 10 + Math.random() * 80
  
  return {
    '--sparkle-delay': `${randomDelay}s`,
    '--sparkle-duration': `${randomDuration}s`,
    '--sparkle-x': `${randomX}%`,
    '--sparkle-y': `${randomY}%`
  }
}

/**
 * Maneja el clic en la notificación
 */
function handleClick(): void {
  if (props.achievement) {
    emit('click', props.achievement)
  }
}

/**
 * Maneja el cierre de la notificación
 */
function handleClose(): void {
  clearAutoHideTimer()
  emit('close')
}

/**
 * Configura el timer de auto-ocultado
 */
function setupAutoHide(): void {
  if (props.autoHide && props.duration > 0) {
    autoHideTimer.value = window.setTimeout(() => {
      handleClose()
    }, props.duration)
  }
}

/**
 * Limpia el timer de auto-ocultado
 */
function clearAutoHideTimer(): void {
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
    autoHideTimer.value = undefined
  }
}

/**
 * Reproduce sonido de celebración
 */
function playCelebrationSound(): void {
  if (!props.playSound) return
  
  try {
    // Crear un sonido simple usando Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Crear una secuencia de tonos para el sonido de logro
    const frequencies = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
      oscillator.type = 'sine'
      
      const startTime = audioContext.currentTime + (index * 0.1)
      const endTime = startTime + 0.2
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime)
      
      oscillator.start(startTime)
      oscillator.stop(endTime)
    })
  } catch (error) {
    console.warn('No se pudo reproducir el sonido de logro:', error)
  }
}

/**
 * Inicia las animaciones de celebración
 */
function startCelebration(): void {
  isCelebrating.value = true
  
  nextTick(() => {
    // Animar el icono
    if (iconRef.value) {
      const { apply } = useMotion(iconRef.value, {
        initial: { scale: 1, rotate: 0 },
        celebration: {
          scale: [1, 1.3, 1.1, 1.2, 1],
          rotate: [0, -10, 10, -5, 0],
          transition: {
            duration: 1000,
            ease: 'easeOut'
          }
        }
      })
      
      apply('celebration')
    }
    
    // Reproducir sonido
    playCelebrationSound()
    
    // Detener celebración después de un tiempo
    setTimeout(() => {
      isCelebrating.value = false
    }, 2000)
  })
}

/**
 * Animación de entrada
 */
function onEnter(el: Element): void {
  const element = el as HTMLElement
  
  const { apply } = useMotion(element, {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      x: 100
    },
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 600
      }
    }
  })
  
  apply('enter')
  
  // Iniciar celebración después de la entrada
  setTimeout(() => {
    startCelebration()
  }, 300)
  
  // Configurar auto-hide
  setupAutoHide()
}

/**
 * Animación de salida
 */
function onLeave(el: Element): void {
  const element = el as HTMLElement
  
  const { apply } = useMotion(element, {
    initial: {
      opacity: 1,
      scale: 1,
      x: 0
    },
    leave: {
      opacity: 0,
      scale: 0.9,
      x: 100,
      transition: {
        duration: 400,
        ease: 'easeIn'
      }
    }
  })
  
  apply('leave')
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Configurar auto-hide si la notificación ya está visible
  if (props.visible) {
    setupAutoHide()
  }
})

onUnmounted(() => {
  clearAutoHideTimer()
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS BASE
   ============================================================================ */

.achievement-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-width: calc(100vw - 40px);
  background: linear-gradient(135deg, #2D1B69 0%, #1a0f3d 100%);
  border: 2px solid #FFD23F;
  border-radius: 16px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 210, 63, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  cursor: pointer;
  z-index: 9999;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease;
}

.achievement-notification:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(255, 210, 63, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* ============================================================================
   FONDO DECORATIVO
   ============================================================================ */

.achievement-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  pointer-events: none;
}

.papel-picado {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  height: 20px;
  background: repeating-linear-gradient(
    45deg,
    #FF6B35 0px,
    #FF6B35 10px,
    #7209B7 10px,
    #7209B7 20px,
    #FFD23F 20px,
    #FFD23F 30px
  );
  clip-path: polygon(
    0% 0%, 10% 100%, 20% 0%, 30% 100%, 40% 0%, 50% 100%,
    60% 0%, 70% 100%, 80% 0%, 90% 100%, 100% 0%, 100% 100%, 0% 100%
  );
}

.cempasuchil-pattern {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, #FFD23F 30%, transparent 70%);
  border-radius: 50%;
}

.cempasuchil-pattern::before {
  content: '🌺';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  opacity: 0.3;
}

/* ============================================================================
   CONTENIDO PRINCIPAL
   ============================================================================ */

.achievement-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  z-index: 2;
}

.achievement-icon {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFD23F 0%, #FF6B35 100%);
  border-radius: 50%;
  box-shadow: 
    0 4px 12px rgba(255, 210, 63, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.icon-emoji {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.icon-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: radial-gradient(circle, rgba(255, 210, 63, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: glow-pulse 2s ease-in-out infinite;
}

.achievement-celebrating .icon-glow {
  opacity: 1;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.achievement-label {
  font-size: 12px;
  font-weight: 600;
  color: #FFD23F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.achievement-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.achievement-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.achievement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.achievement-category {
  background: rgba(255, 210, 63, 0.2);
  color: #FFD23F;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.achievement-date {
  color: rgba(255, 255, 255, 0.6);
}

/* ============================================================================
   EFECTOS DE CELEBRACIÓN
   ============================================================================ */

.celebration-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 16px;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--confetti-color, #FFD23F);
  top: -10px;
  left: var(--confetti-x, 50%);
  opacity: 0;
  border-radius: 2px;
  animation: confetti-fall var(--confetti-duration, 1.5s) var(--confetti-delay, 0s) ease-out;
}

.achievement-celebrating .confetti-piece {
  animation-play-state: running;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(-10px) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(200px) rotate(360deg);
  }
}

.sparkles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sparkle {
  position: absolute;
  font-size: 16px;
  top: var(--sparkle-y, 50%);
  left: var(--sparkle-x, 50%);
  opacity: 0;
  animation: sparkle-twinkle var(--sparkle-duration, 1s) var(--sparkle-delay, 0s) ease-in-out;
}

.achievement-celebrating .sparkle {
  animation-play-state: running;
}

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* ============================================================================
   BARRA DE PROGRESO
   ============================================================================ */

.achievement-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 16px;
  position: relative;
  z-index: 2;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD23F 0%, #FF6B35 100%);
  border-radius: 3px;
  transition: width 0.8s ease;
  animation: progress-glow 2s ease-in-out infinite;
}

@keyframes progress-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 210, 63, 0.3); }
  50% { box-shadow: 0 0 15px rgba(255, 210, 63, 0.6); }
}

.progress-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

/* ============================================================================
   VARIACIONES POR CATEGORÍA
   ============================================================================ */

.achievement-gameplay {
  border-color: #FF6B35;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 107, 53, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.achievement-milestone {
  border-color: #7209B7;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(114, 9, 183, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.achievement-seasonal {
  border-color: #FFD23F;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 210, 63, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* ============================================================================
   TRANSICIONES
   ============================================================================ */

.achievement-notification-enter-active,
.achievement-notification-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.achievement-notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.achievement-notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 480px) {
  .achievement-notification {
    top: 10px;
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
  }
  
  .achievement-content {
    padding: 16px;
    gap: 12px;
  }
  
  .achievement-icon {
    width: 50px;
    height: 50px;
  }
  
  .icon-emoji {
    font-size: 24px;
  }
  
  .achievement-name {
    font-size: 16px;
  }
  
  .achievement-description {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .achievement-notification,
  .confetti-piece,
  .sparkle,
  .icon-glow,
  .progress-fill {
    animation: none !important;
    transition: none !important;
  }
  
  .achievement-notification-enter-active,
  .achievement-notification-leave-active {
    transition: opacity 0.3s ease !important;
  }
}
</style>