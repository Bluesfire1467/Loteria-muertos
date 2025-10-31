<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title animate-cempasuchil-glow">
          🎲 Lotería Día de Muertos 💀
        </h1>
        <p class="hero-subtitle">
          Juego tradicional mexicano con temática del Día de Muertos
        </p>
        <p class="hero-description">
          Disfruta del juego tradicional mexicano con una hermosa temática del Día de Muertos.
          Compite contra bots inteligentes y desbloquea logros especiales.
        </p>
        
        <!-- Botones principales -->
        <div class="hero-actions">
          <button 
            class="btn btn-primary btn-large"
            @click="startNewGame"
            :disabled="isStartingGame"
          >
            <span class="btn-icon">🎮</span>
            {{ isStartingGame ? 'Iniciando...' : 'Nueva Partida' }}
          </button>
          
          <router-link to="/estadisticas" class="btn btn-secondary btn-large">
            <span class="btn-icon">📊</span>
            Estadísticas
          </router-link>
        </div>

        <!-- Botones secundarios -->
        <div class="secondary-actions">
          <router-link to="/logros" class="btn btn-outline">
            <span class="btn-icon">🏆</span>
            Logros
          </router-link>
          
          <router-link to="/configuracion" class="btn btn-outline">
            <span class="btn-icon">⚙️</span>
            Configuración
          </router-link>
        </div>
      </div>

      <!-- Decoración de papel picado -->
      <div class="papel-picado-decoration">
        <div class="papel-picado-line" v-for="i in 3" :key="i">
          <div 
            class="papel-picado-flag" 
            v-for="j in 8" 
            :key="j"
            :style="{ 
              animationDelay: `${(i * 8 + j) * 0.1}s`,
              backgroundColor: getPapelPicadoColor(i, j)
            }"
          ></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Características del Juego</h2>
        
        <div class="features-grid">
          <div 
            class="feature-card"
            v-for="(feature, index) in features"
            :key="feature.title"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: index * 200,
                duration: 600,
                ease: 'easeOut'
              }
            }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Stats Section -->
    <section class="stats-section" v-if="userStats">
      <div class="container">
        <h2 class="section-title">Tu Progreso</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ userStats.totalGames }}</div>
            <div class="stat-label">Partidas Jugadas</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ userStats.winPercentage }}%</div>
            <div class="stat-label">Porcentaje de Victoria</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ userStats.longestWinStreak }}</div>
            <div class="stat-label">Mejor Racha</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ formatPlayTime(userStats.totalPlayTime) }}</div>
            <div class="stat-label">Tiempo Total</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cultural Info Section -->
    <section class="cultural-section">
      <div class="container">
        <div class="cultural-content">
          <div class="cultural-text">
            <h2 class="section-title">Día de Muertos</h2>
            <p>
              El Día de Muertos es una celebración mexicana que honra a los seres queridos que han fallecido. 
              Esta tradición combina rituales prehispánicos con festividades católicas, creando una celebración 
              única que ve la muerte no como un final, sino como una continuación natural de la vida.
            </p>
            <p>
              La Lotería Mexicana, conocida como "El juego de la suerte", es un juego tradicional similar al bingo 
              que ha sido parte de la cultura mexicana durante siglos. Nuestro juego combina estas dos tradiciones 
              para crear una experiencia cultural auténtica.
            </p>
          </div>
          
          <div class="cultural-decoration">
            <div class="cempasuchil-flower">🌼</div>
            <div class="calavera-icon">💀</div>
            <div class="copal-smoke">💨</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const gameStore = useGameStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const isStartingGame = ref(false)

// ============================================================================
// COMPUTED
// ============================================================================

const userStats = computed(() => {
  // Aquí se obtendría las estadísticas del usuario desde el store
  // Por ahora retornamos datos de ejemplo
  return {
    totalGames: 42,
    winPercentage: 68,
    longestWinStreak: 7,
    totalPlayTime: 3600 // en segundos
  }
})

const features = computed(() => [
  {
    icon: '🎨',
    title: 'Auténtica Cultura Mexicana',
    description: 'Cartas tradicionales con elementos del Día de Muertos y diseño culturalmente auténtico.'
  },
  {
    icon: '🤖',
    title: 'Bots Inteligentes',
    description: 'Compite contra oponentes con personalidades únicas y dificultad adaptativa.'
  },
  {
    icon: '🏆',
    title: 'Sistema de Logros',
    description: 'Desbloquea reconocimientos especiales y celebra tus victorias.'
  },
  {
    icon: '📊',
    title: 'Estadísticas Detalladas',
    description: 'Sigue tu progreso con métricas completas y análisis de rendimiento.'
  },
  {
    icon: '🎵',
    title: 'Audio Inmersivo',
    description: 'Música tradicional mexicana y efectos de sonido temáticos.'
  },
  {
    icon: '📱',
    title: 'Diseño Responsive',
    description: 'Juega en cualquier dispositivo con una experiencia optimizada.'
  }
])

// ============================================================================
// METHODS
// ============================================================================

/**
 * Inicia una nueva partida
 */
async function startNewGame(): Promise<void> {
  isStartingGame.value = true
  
  try {
    // Iniciar nueva partida en el store
    gameStore.startNewGame('Jugador')
    
    // Navegar a la vista del juego
    await router.push('/juego')
  } catch (error) {
    console.error('Error al iniciar nueva partida:', error)
    // Aquí se podría mostrar un mensaje de error al usuario
  } finally {
    isStartingGame.value = false
  }
}

/**
 * Obtiene colores para el papel picado
 */
function getPapelPicadoColor(line: number, flag: number): string {
  const colors = [
    'var(--primary-orange)',
    'var(--secondary-purple)', 
    'var(--accent-gold)',
    '#FF006E', // Rosa mexicano
    '#06FFA5', // Verde
    '#4ECDC4'  // Turquesa
  ]
  
  return colors[(line * 8 + flag) % colors.length]
}

/**
 * Formatea el tiempo de juego
 */
function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  console.log('🏠 Vista de inicio cargada')
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--secondary-purple) 100%);
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  padding: var(--spacing-2xl);
  z-index: 2;
  position: relative;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  text-shadow: 0 0 30px rgba(255, 211, 63, 0.5);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.hero-description {
  font-size: clamp(1rem, 3vw, 1.2rem);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.secondary-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
  min-width: 200px;
}

.btn-icon {
  margin-right: var(--spacing-sm);
  font-size: 1.2em;
}

/* Papel Picado Decoration */
.papel-picado-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.papel-picado-line {
  position: absolute;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.papel-picado-line:nth-child(1) { top: 10%; }
.papel-picado-line:nth-child(2) { top: 30%; }
.papel-picado-line:nth-child(3) { top: 70%; }

.papel-picado-flag {
  width: 40px;
  height: 50px;
  clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
  opacity: 0.6;
  animation: papel-picado-wave 3s ease-in-out infinite;
}

@keyframes papel-picado-wave {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

/* Features Section */
.features-section {
  padding: var(--spacing-4xl) 0;
  background: rgba(255, 255, 255, 0.02);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section-title {
  font-size: clamp(2rem, 5vw, 2.5rem);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  color: var(--accent-gold);
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  text-align: center;
  border: 1px solid rgba(255, 211, 63, 0.2);
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent-gold);
  box-shadow: 0 10px 30px rgba(255, 211, 63, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
  display: block;
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--accent-gold);
}

.feature-description {
  line-height: 1.6;
  opacity: 0.8;
}

/* Stats Section */
.stats-section {
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-purple) 100%);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-value {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: var(--font-size-md);
  opacity: 0.9;
  font-weight: 500;
}

/* Cultural Section */
.cultural-section {
  padding: var(--spacing-4xl) 0;
  background: rgba(0, 0, 0, 0.2);
}

.cultural-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.cultural-text p {
  font-size: var(--font-size-lg);
  line-height: 1.7;
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
}

.cultural-decoration {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  font-size: 4rem;
}

.cempasuchil-flower {
  animation: float 3s ease-in-out infinite;
}

.calavera-icon {
  animation: float 3s ease-in-out infinite reverse;
  animation-delay: 1s;
}

.copal-smoke {
  animation: float 3s ease-in-out infinite;
  animation-delay: 2s;
  opacity: 0.7;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .secondary-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-large {
    min-width: auto;
    width: 100%;
    max-width: 300px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cultural-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .cultural-decoration {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-content {
    padding: var(--spacing-xl);
  }
}
</style>