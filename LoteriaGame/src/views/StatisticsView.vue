<template>
  <div class="statistics-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <router-link to="/" class="back-button">
          ← Volver
        </router-link>
        <h1 class="page-title">📊 Estadísticas</h1>
        <div class="header-actions">
          <button 
            class="btn btn-outline btn-sm"
            @click="refreshStats"
            title="Refrescar estadísticas"
          >
            🔄 Refrescar
          </button>
          <button 
            class="btn btn-secondary btn-sm"
            @click="testStats"
            title="Probar estadísticas (Debug)"
            v-if="isDevelopment"
          >
            🧪 Test
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="statistics-main">
      <div class="container">
        <!-- Debug info (solo en desarrollo) -->
        <section v-if="isDevelopment" class="debug-section">
          <h2 class="section-title">🔧 Debug Info</h2>
          <div class="debug-card">
            <div class="debug-info">
              <div class="debug-item">
                <strong>Última actualización:</strong> 
                {{ userStats.lastUpdated ? new Date(userStats.lastUpdated).toLocaleString() : 'Nunca' }}
              </div>
              <div class="debug-item">
                <strong>Datos en localStorage:</strong> 
                <button class="btn-link" @click="checkLocalStorage">Verificar</button>
              </div>
              <div class="debug-item">
                <strong>Store inicializado:</strong> 
                {{ statisticsStore ? 'Sí' : 'No' }}
              </div>
            </div>
          </div>
        </section>

        <!-- Resumen general -->
        <section class="stats-overview">
          <h2 class="section-title">Resumen General</h2>
          <div class="overview-grid">
            <div class="stat-card primary">
              <div class="stat-icon">🎮</div>
              <div class="stat-content">
                <div class="stat-value">{{ userStats.totalGames }}</div>
                <div class="stat-label">Partidas Jugadas</div>
              </div>
            </div>
            
            <div class="stat-card success">
              <div class="stat-icon">🏆</div>
              <div class="stat-content">
                <div class="stat-value">{{ userStats.wins }}</div>
                <div class="stat-label">Victorias</div>
              </div>
            </div>
            
            <div class="stat-card warning">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <div class="stat-value">{{ preciseWinRate }}%</div>
                <div class="stat-label">Porcentaje de Victoria</div>
              </div>
            </div>
            
            <div class="stat-card info">
              <div class="stat-icon">⚡</div>
              <div class="stat-content">
                <div class="stat-value">{{ userStats.longestWinStreak }}</div>
                <div class="stat-label">Mejor Racha</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Estadísticas detalladas -->
        <section class="detailed-stats">
          <h2 class="section-title">Estadísticas Detalladas</h2>
          
          <div class="stats-grid">
            <!-- Tiempo de juego -->
            <div class="stats-card">
              <h3 class="card-title">⏱️ Tiempo de Juego</h3>
              <div class="stats-list">
                <div class="stat-item">
                  <span class="stat-name">Tiempo Total:</span>
                  <span class="stat-value">{{ formatPlayTime(userStats.totalPlayTime) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Tiempo Promedio por Partida:</span>
                  <span class="stat-value">{{ formatPlayTime(userStats.averageGameTime) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Partida más Rápida:</span>
                  <span class="stat-value">{{ formatPlayTime(additionalStats.fastestGame) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Partida más Larga:</span>
                  <span class="stat-value">{{ formatPlayTime(additionalStats.longestGame) }}</span>
                </div>
              </div>
            </div>

            <!-- Rendimiento -->
            <div class="stats-card">
              <h3 class="card-title">🎯 Rendimiento</h3>
              <div class="stats-list">
                <div class="stat-item">
                  <span class="stat-name">Racha Actual:</span>
                  <span class="stat-value" :class="{ 
                    'positive': streakAnalysis.isPositive,
                    'negative': streakAnalysis.isNegative 
                  }">
                    {{ streakAnalysis.isPositive ? '+' : '' }}{{ userStats.currentWinStreak }}
                    <small>({{ streakAnalysis.streakType }})</small>
                  </span>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Derrotas:</span>
                  <span class="stat-value">{{ userStats.losses }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Partidas Abandonadas:</span>
                  <span class="stat-value">{{ additionalStats.abandonedGames }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-name">Precisión de Marcado:</span>
                  <span class="stat-value">{{ additionalStats.markingAccuracy.toFixed(1) }}%</span>
                </div>
              </div>
            </div>

            <!-- Estadísticas mensuales -->
            <div class="stats-card full-width">
              <h3 class="card-title">📅 Progreso Mensual</h3>
              <div class="monthly-stats">
                <div class="month-selector">
                  <button 
                    v-for="month in availableMonths"
                    :key="month.key"
                    class="month-button"
                    :class="{ active: selectedMonth === month.key }"
                    @click="selectMonth(month.key)"
                  >
                    {{ month.label }}
                  </button>
                </div>
                
                <div class="monthly-data" v-if="currentMonthData">
                  <div class="monthly-overview">
                    <div class="monthly-stat">
                      <div class="monthly-value">{{ currentMonthData.gamesPlayed }}</div>
                      <div class="monthly-label">Partidas</div>
                    </div>
                    <div class="monthly-stat">
                      <div class="monthly-value">{{ currentMonthData.wins }}</div>
                      <div class="monthly-label">Victorias</div>
                    </div>
                    <div class="monthly-stat">
                      <div class="monthly-value">{{ currentMonthData.winPercentage }}%</div>
                      <div class="monthly-label">% Victoria</div>
                    </div>
                    <div class="monthly-stat">
                      <div class="monthly-value">{{ formatPlayTime(currentMonthData.averageGameTime) }}</div>
                      <div class="monthly-label">Tiempo Prom.</div>
                    </div>
                  </div>
                  
                  <!-- Comparación mensual -->
                  <div class="monthly-comparison" v-if="monthOverMonthComparison.hasComparison">
                    <h4 class="comparison-title">📊 Comparación con el Mes Anterior</h4>
                    <div class="comparison-grid">
                      <div class="comparison-item">
                        <span class="comparison-label">Partidas:</span>
                        <span class="comparison-value" :class="{
                          'positive': monthOverMonthComparison.gamesChange > 0,
                          'negative': monthOverMonthComparison.gamesChange < 0
                        }">
                          {{ monthOverMonthComparison.gamesChange > 0 ? '+' : '' }}{{ monthOverMonthComparison.gamesChange }}
                        </span>
                      </div>
                      <div class="comparison-item">
                        <span class="comparison-label">% Victoria:</span>
                        <span class="comparison-value" :class="{
                          'positive': monthOverMonthComparison.winRateChange > 0,
                          'negative': monthOverMonthComparison.winRateChange < 0
                        }">
                          {{ monthOverMonthComparison.winRateChange > 0 ? '+' : '' }}{{ monthOverMonthComparison.winRateChange.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Análisis de rendimiento -->
        <section class="performance-analysis">
          <h2 class="section-title">📈 Análisis de Rendimiento</h2>
          
          <div class="analysis-grid">
            <!-- Ranking del jugador -->
            <div class="analysis-card">
              <h3 class="card-title">🏅 Tu Ranking</h3>
              <div class="ranking-display">
                <div class="ranking-badge" :class="playerRanking.league.toLowerCase()">
                  <div class="ranking-league">{{ playerRanking.league }}</div>
                  <div class="ranking-position">#{{ playerRanking.position }}</div>
                </div>
                <div class="ranking-details">
                  <div class="ranking-score">{{ playerRanking.score }} puntos</div>
                  <div class="ranking-percentile">Top {{ 100 - playerRanking.percentile }}%</div>
                </div>
              </div>
            </div>

            <!-- Tendencia de 6 meses -->
            <div class="analysis-card">
              <h3 class="card-title">📊 Tendencia (6 meses)</h3>
              <div class="trend-display">
                <div class="trend-indicator" :class="sixMonthTrend.trend">
                  <div class="trend-icon">
                    {{ sixMonthTrend.trend === 'improving' ? '📈' : 
                       sixMonthTrend.trend === 'declining' ? '📉' : '➡️' }}
                  </div>
                  <div class="trend-text">{{ sixMonthTrend.description }}</div>
                </div>
              </div>
            </div>

            <!-- Rendimiento reciente -->
            <div class="analysis-card">
              <h3 class="card-title">⚡ Rendimiento Reciente</h3>
              <div class="recent-performance">
                <div class="performance-stat">
                  <span class="perf-label">Últimas 10 partidas:</span>
                  <span class="perf-value">{{ recentPerformance.recentWinRate }}%</span>
                </div>
                <div class="performance-stat">
                  <span class="perf-label">Tendencia:</span>
                  <span class="perf-value" :class="recentPerformance.trend">
                    {{ recentPerformance.trend === 'improving' ? '↗️ Mejorando' : 
                       recentPerformance.trend === 'declining' ? '↘️ Bajando' : '➡️ Estable' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Evaluación de rendimiento -->
            <div class="analysis-card">
              <h3 class="card-title">⭐ Evaluación</h3>
              <div class="performance-rating">
                <div class="rating-badge" :class="performanceRating.color">
                  <div class="rating-icon">{{ performanceRating.icon }}</div>
                  <div class="rating-text">{{ performanceRating.rating }}</div>
                </div>
                <div class="rating-description">
                  Basado en {{ preciseWinRate }}% de victorias
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Estadísticas de sesión actual -->
        <section class="session-stats" v-if="sessionStats.gamesPlayed > 0">
          <h2 class="section-title">🎯 Sesión Actual</h2>
          <div class="session-overview">
            <div class="session-stat">
              <div class="session-value">{{ sessionStats.gamesPlayed }}</div>
              <div class="session-label">Partidas</div>
            </div>
            <div class="session-stat">
              <div class="session-value">{{ sessionStats.wins }}</div>
              <div class="session-label">Victorias</div>
            </div>
            <div class="session-stat">
              <div class="session-value">{{ sessionStats.sessionWinRate }}%</div>
              <div class="session-label">% Victoria</div>
            </div>
            <div class="session-stat">
              <div class="session-value">{{ formatPlayTime(sessionStats.duration) }}</div>
              <div class="session-label">Tiempo</div>
            </div>
          </div>
        </section>

        <!-- Logros relacionados -->
        <section class="achievements-preview">
          <h2 class="section-title">🏆 Logros Relacionados</h2>
          <div class="achievements-grid">
            <div 
              v-for="achievement in relatedAchievements"
              :key="achievement.id"
              class="achievement-card"
              :class="{ unlocked: achievement.isUnlocked }"
            >
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-content">
                <h4 class="achievement-name">{{ achievement.name }}</h4>
                <p class="achievement-description">{{ achievement.description }}</p>
                <div class="achievement-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }"
                    ></div>
                  </div>
                  <span class="progress-text">
                    {{ achievement.progress }} / {{ achievement.maxProgress }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="achievements-link">
            <router-link to="/logros" class="btn btn-outline">
              Ver Todos los Logros →
            </router-link>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import { useStatistics } from '@/composables/useStatistics'
import { useMonthlyStats } from '@/composables/useMonthlyStats'

// ============================================================================
// STORES Y COMPOSABLES
// ============================================================================

const statisticsStore = useStatisticsStore()
const { 
  preciseWinRate, 
  streakAnalysis, 
  playerRanking,
  compareWithPreviousPeriod,
  projectFutureStats
} = useStatistics()
const { 
  selectedMonth,
  currentMonthData,
  availableMonths,
  monthOverMonthComparison,
  sixMonthTrend,
  selectMonth
} = useMonthlyStats()

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const userStats = computed(() => statisticsStore.userStats)

const performanceRating = computed(() => statisticsStore.performanceRating)

const relatedAchievements = computed(() => 
  statisticsStore.getStatisticsAchievements()
)

const sessionStats = computed(() => statisticsStore.getSessionStatistics())

const recentPerformance = computed(() => statisticsStore.getRecentPerformance())

const trendAnalysis = computed(() => {
  const comparison = compareWithPreviousPeriod('month')
  const trend = sixMonthTrend.value
  
  return {
    monthOverMonth: comparison,
    sixMonthTrend: trend,
    recentPerformance: recentPerformance.value
  }
})

// Estadísticas adicionales simuladas (para características no implementadas aún)
const additionalStats = computed(() => ({
  fastestGame: Math.max(60, userStats.value.averageGameTime - 120),
  longestGame: userStats.value.averageGameTime + 300,
  abandonedGames: Math.floor(userStats.value.totalGames * 0.02), // 2% estimado
  markingAccuracy: Math.min(98, 85 + (preciseWinRate.value / 10)) // Basado en win rate
}))

// ============================================================================
// METHODS
// ============================================================================

/**
 * Formatea el tiempo de juego usando la función del store
 */
function formatPlayTime(seconds: number): string {
  return statisticsStore.formatPlayTime(seconds)
}

// ============================================================================
// FUNCIONES
// ============================================================================

/**
 * Verifica si estamos en modo desarrollo
 */
const isDevelopment = computed(() => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development'
})

/**
 * Refresca las estadísticas desde localStorage
 */
async function refreshStats() {
  try {
    console.log('🔄 Refrescando estadísticas...')
    await statisticsStore.loadStatistics()
    console.log('✅ Estadísticas refrescadas')
  } catch (error) {
    console.error('❌ Error al refrescar estadísticas:', error)
  }
}

/**
 * Función de prueba para agregar estadísticas de ejemplo
 */
function testStats() {
  try {
    console.log('🧪 Agregando estadísticas de prueba...')
    
    // Crear una sesión de juego de prueba
    const testSession = {
      id: `test_${Date.now()}`,
      startTime: new Date(Date.now() - 300000), // 5 minutos atrás
      endTime: new Date(),
      duration: 300, // 5 minutos
      players: [],
      cardsDrawn: [],
      winner: undefined
    }
    
    // Crear jugador de prueba (victoria)
    const testPlayer = {
      id: 'test_player',
      name: 'Jugador Test',
      type: 'human' as const,
      board: [],
      markedCards: new Set(),
      isWinner: Math.random() > 0.5 // 50% probabilidad de victoria
    }
    
    // Registrar el resultado
    statisticsStore.recordGameResult(testSession, testPlayer)
    
    console.log(`✅ Estadística de prueba agregada: ${testPlayer.isWinner ? 'Victoria' : 'Derrota'}`)
    console.log(`📊 Nuevas estadísticas - Total: ${statisticsStore.userStats.totalGames}`)
  } catch (error) {
    console.error('❌ Error en prueba de estadísticas:', error)
  }
}

/**
 * Verifica el estado de localStorage
 */
function checkLocalStorage() {
  try {
    const key = 'loteria_dia_muertos_statistics'
    const data = localStorage.getItem(key)
    
    if (data) {
      const parsed = JSON.parse(data)
      console.log('📦 Datos en localStorage:', parsed)
      alert(`Datos encontrados en localStorage:\nTotal juegos: ${parsed.totalGames || 0}\nVictorias: ${parsed.wins || 0}\nÚltima actualización: ${parsed.lastUpdated || 'N/A'}`)
    } else {
      console.log('📦 No hay datos en localStorage')
      alert('No se encontraron datos de estadísticas en localStorage')
    }
  } catch (error) {
    console.error('❌ Error al verificar localStorage:', error)
    alert('Error al verificar localStorage: ' + error.message)
  }
}

/**
 * Inicializa el componente
 */
onMounted(() => {
  // Asegurar que las estadísticas estén cargadas
  statisticsStore.initialize()
})
</script>

<style scoped>
.statistics-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--secondary-purple) 100%);
}

/* Header */
.page-header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 211, 63, 0.2);
  padding: var(--spacing-lg);
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  color: var(--accent-gold);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.back-button:hover {
  color: var(--text-light);
  transform: translateX(-4px);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--accent-gold);
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

/* Debug section */
.debug-section {
  margin-bottom: var(--spacing-xl);
}

.debug-card {
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid var(--primary-orange);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
}

.debug-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.debug-item {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent-gold);
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin-left: var(--spacing-xs);
}

.btn-link:hover {
  color: var(--text-light);
}

.header-spacer {
  width: 60px; /* Para balancear el botón de volver */
}

/* Main content */
.statistics-main {
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

/* Stats overview */
.stats-overview {
  margin-bottom: var(--spacing-4xl);
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  border: 2px solid transparent;
  transition: all var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stat-card.primary {
  border-color: var(--primary-orange);
}

.stat-card.success {
  border-color: var(--success-green);
}

.stat-card.warning {
  border-color: var(--accent-gold);
}

.stat-card.info {
  border-color: var(--secondary-purple);
}

.stat-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-md);
  color: var(--accent-gold);
  opacity: 0.9;
}

/* Detailed stats */
.detailed-stats {
  margin-bottom: var(--spacing-4xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.stats-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  border: 1px solid rgba(255, 211, 63, 0.2);
}

.stats-card.full-width {
  grid-column: 1 / -1;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name {
  color: var(--text-light);
  opacity: 0.8;
}

.stat-value {
  font-weight: 600;
  color: var(--text-light);
}

.stat-value.positive {
  color: var(--success-green);
}

.stat-value.negative {
  color: var(--error-red);
}

/* Monthly stats */
.monthly-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.month-selector {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.month-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.month-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.month-button.active {
  background: var(--accent-gold);
  color: var(--background-dark);
  border-color: var(--accent-gold);
}

.monthly-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-lg);
}

.monthly-stat {
  text-align: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
}

.monthly-value {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xs);
}

.monthly-label {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

/* Achievements preview */
.achievements-preview {
  margin-bottom: var(--spacing-2xl);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
}

.achievement-card.unlocked {
  border-color: var(--success-green);
  background: rgba(6, 255, 165, 0.05);
}

.achievement-card:hover {
  transform: translateY(-2px);
}

.achievement-icon {
  font-size: 2rem;
  flex-shrink: 0;
  opacity: 0.7;
}

.achievement-card.unlocked .achievement-icon {
  opacity: 1;
}

.achievement-content {
  flex: 1;
}

.achievement-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: var(--spacing-xs);
}

.achievement-card.unlocked .achievement-name {
  color: var(--success-green);
}

.achievement-description {
  font-size: var(--font-size-sm);
  opacity: 0.8;
  margin-bottom: var(--spacing-sm);
}

.achievement-progress {
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

.achievement-card.unlocked .progress-fill {
  background: var(--success-green);
}

.progress-text {
  font-size: var(--font-size-xs);
  opacity: 0.7;
  min-width: 50px;
  text-align: right;
}

.achievements-link {
  text-align: center;
}

/* Monthly comparison */
.monthly-comparison {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 211, 63, 0.1);
}

.comparison-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-md);
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.comparison-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-sm);
}

.comparison-label {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.comparison-value {
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.comparison-value.positive {
  color: var(--success-green);
}

.comparison-value.negative {
  color: var(--error-red);
}

/* Performance analysis */
.performance-analysis {
  margin-bottom: var(--spacing-4xl);
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.analysis-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  border: 1px solid rgba(255, 211, 63, 0.2);
  transition: all var(--transition-normal);
}

.analysis-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Ranking display */
.ranking-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.ranking-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  min-width: 80px;
}

.ranking-badge.bronce {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
}

.ranking-badge.plata {
  background: linear-gradient(135deg, #C0C0C0, #808080);
}

.ranking-badge.oro {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.ranking-badge.diamante {
  background: linear-gradient(135deg, #B9F2FF, #00BFFF);
}

.ranking-league {
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ranking-position {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-top: var(--spacing-xs);
}

.ranking-details {
  flex: 1;
}

.ranking-score {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xs);
}

.ranking-percentile {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

/* Trend display */
.trend-display {
  text-align: center;
}

.trend-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.trend-icon {
  font-size: 2rem;
}

.trend-text {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.trend-indicator.improving .trend-text {
  color: var(--success-green);
}

.trend-indicator.declining .trend-text {
  color: var(--error-red);
}

/* Recent performance */
.recent-performance {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.performance-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.performance-stat:last-child {
  border-bottom: none;
}

.perf-label {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.perf-value {
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.perf-value.improving {
  color: var(--success-green);
}

.perf-value.declining {
  color: var(--error-red);
}

/* Performance rating */
.performance-rating {
  text-align: center;
}

.rating-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-sm);
}

.rating-badge.success {
  background: rgba(6, 255, 165, 0.1);
  border: 2px solid var(--success-green);
}

.rating-badge.good {
  background: rgba(255, 211, 63, 0.1);
  border: 2px solid var(--accent-gold);
}

.rating-badge.average {
  background: rgba(255, 107, 53, 0.1);
  border: 2px solid var(--primary-orange);
}

.rating-badge.below {
  background: rgba(114, 9, 183, 0.1);
  border: 2px solid var(--secondary-purple);
}

.rating-badge.beginner {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.rating-icon {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
}

.rating-text {
  font-weight: 600;
  font-size: var(--font-size-md);
}

.rating-description {
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

/* Session stats */
.session-stats {
  margin-bottom: var(--spacing-4xl);
}

.session-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-lg);
  max-width: 600px;
  margin: 0 auto;
}

.session-stat {
  text-align: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(6, 255, 165, 0.3);
}

.session-value {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--success-green);
  margin-bottom: var(--spacing-xs);
}

.session-label {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .header-spacer {
    display: none;
  }
  
  .back-button {
    align-self: flex-start;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .monthly-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-grid {
    grid-template-columns: 1fr;
  }
  
  .ranking-display {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .statistics-main {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .monthly-overview {
    grid-template-columns: 1fr;
  }
  
  .session-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>