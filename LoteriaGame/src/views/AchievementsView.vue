<template>
  <div class="achievements-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <router-link to="/" class="back-button">
          ← Volver
        </router-link>
        <h1 class="page-title">🏆 Logros</h1>
        <div class="header-actions">
          <button 
            class="refresh-button"
            @click="refreshAchievements"
            :disabled="isRefreshing"
            title="Actualizar logros"
          >
            <span class="refresh-icon" :class="{ spinning: isRefreshing }">🔄</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="achievements-main">
      <div class="container">
        <!-- Resumen de progreso -->
        <section class="progress-summary">
          <div class="summary-card">
            <div class="summary-content">
              <h2 class="summary-title">Tu Progreso</h2>
              <div class="progress-stats">
                <div class="progress-stat">
                  <div class="stat-value">{{ achievementsStore.unlockedCount }}</div>
                  <div class="stat-label">Desbloqueados</div>
                </div>
                <div class="progress-divider">/</div>
                <div class="progress-stat">
                  <div class="stat-value">{{ achievementsStore.totalAchievements }}</div>
                  <div class="stat-label">Total</div>
                </div>
              </div>
              <div class="overall-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${achievementsStore.completionPercentage}%` }"
                  ></div>
                </div>
                <span class="progress-percentage">{{ achievementsStore.completionPercentage }}%</span>
              </div>
              
              <!-- Estadísticas adicionales -->
              <div class="additional-stats">
                <div class="stat-item">
                  <span class="stat-icon">🔥</span>
                  <span class="stat-text">{{ recentAchievementsCount }} recientes</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">⏳</span>
                  <span class="stat-text">{{ nearCompletionCount }} por completar</span>
                </div>
              </div>
            </div>
            <div class="summary-decoration">
              <div class="trophy-stack">
                <div class="trophy gold">🏆</div>
                <div class="trophy silver">🥈</div>
                <div class="trophy bronze">🥉</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Logros recientes -->
        <section v-if="achievementsStore.recentAchievements.length > 0" class="recent-achievements">
          <h2 class="section-title">✨ Logros Recientes</h2>
          <div class="recent-grid">
            <div 
              v-for="achievement in achievementsStore.recentAchievements"
              :key="`recent-${achievement.id}`"
              class="recent-achievement-card"
              @click="highlightAchievement(achievement.id)"
            >
              <div class="recent-icon">{{ achievement.icon }}</div>
              <div class="recent-info">
                <h4 class="recent-name">{{ achievement.name }}</h4>
                <p class="recent-date">{{ formatRelativeDate(achievement.unlockedAt!) }}</p>
              </div>
              <div class="recent-badge">✨</div>
            </div>
          </div>
        </section>

        <!-- Próximos logros -->
        <section v-if="achievementsStore.nextAchievements.length > 0" class="next-achievements">
          <h2 class="section-title">🎯 Próximos Logros</h2>
          <div class="next-grid">
            <div 
              v-for="achievement in achievementsStore.nextAchievements"
              :key="`next-${achievement.id}`"
              class="next-achievement-card"
              @click="highlightAchievement(achievement.id)"
            >
              <div class="next-icon">{{ achievement.icon }}</div>
              <div class="next-info">
                <h4 class="next-name">{{ achievement.name }}</h4>
                <div class="next-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }"
                    ></div>
                  </div>
                  <span class="progress-text">
                    {{ achievement.progress }}/{{ achievement.maxProgress }}
                  </span>
                </div>
              </div>
              <div class="next-percentage">
                {{ Math.round((achievement.progress / achievement.maxProgress) * 100) }}%
              </div>
            </div>
          </div>
        </section>

        <!-- Filtros -->
        <section class="filters-section">
          <div class="filters">
            <button 
              v-for="filter in filters"
              :key="filter.key"
              class="filter-button"
              :class="{ active: activeFilter === filter.key }"
              @click="activeFilter = filter.key"
            >
              <span class="filter-icon">{{ filter.icon }}</span>
              {{ filter.label }}
              <span class="filter-count">({{ getFilterCount(filter.key) }})</span>
            </button>
          </div>
          
          <!-- Ordenamiento -->
          <div class="sort-options">
            <label class="sort-label">Ordenar por:</label>
            <select v-model="sortBy" class="sort-select">
              <option value="progress">Progreso</option>
              <option value="name">Nombre</option>
              <option value="category">Categoría</option>
              <option value="unlocked">Estado</option>
              <option value="date">Fecha</option>
            </select>
          </div>
        </section>

        <!-- Lista de logros -->
        <section class="achievements-section">
          <div class="achievements-grid">
            <div 
              v-for="achievement in filteredAndSortedAchievements"
              :key="achievement.id"
              :ref="el => setAchievementRef(achievement.id, el)"
              class="achievement-card"
              :class="{ 
                unlocked: achievement.isUnlocked,
                'near-completion': isNearCompletion(achievement) && !achievement.isUnlocked,
                highlighted: highlightedAchievement === achievement.id
              }"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: filteredAndSortedAchievements.indexOf(achievement) * 50,
                  duration: 300
                }
              }"
              @click="selectAchievement(achievement)"
            >
              <!-- Header del logro -->
              <div class="achievement-header">
                <div class="achievement-icon">
                  {{ achievement.icon }}
                  <div v-if="achievement.isUnlocked" class="unlock-badge">✨</div>
                </div>
                <div class="achievement-category">
                  {{ getCategoryLabel(achievement.category) }}
                </div>
              </div>

              <!-- Contenido del logro -->
              <div class="achievement-content">
                <h3 class="achievement-name">{{ achievement.name }}</h3>
                <p class="achievement-description">{{ achievement.description }}</p>
                
                <!-- Fecha de desbloqueo -->
                <div v-if="achievement.isUnlocked && achievement.unlockedAt" class="unlock-date">
                  <span class="unlock-icon">🎉</span>
                  Desbloqueado {{ formatRelativeDate(achievement.unlockedAt) }}
                </div>
                
                <!-- Consejos para logros bloqueados -->
                <div v-else-if="getAchievementTip(achievement)" class="achievement-tip">
                  <span class="tip-icon">💡</span>
                  {{ getAchievementTip(achievement) }}
                </div>
              </div>

              <!-- Progreso -->
              <div class="achievement-progress">
                <div class="progress-info">
                  <span class="progress-text">
                    {{ achievement.progress }} / {{ achievement.maxProgress }}
                  </span>
                  <span class="progress-percentage">
                    {{ Math.round((achievement.progress / achievement.maxProgress) * 100) }}%
                  </span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }"
                  ></div>
                </div>
                
                <!-- Indicador de progreso restante -->
                <div v-if="!achievement.isUnlocked && achievement.progress > 0" class="remaining-progress">
                  {{ achievement.maxProgress - achievement.progress }} más para desbloquear
                </div>
              </div>

              <!-- Overlay de desbloqueado -->
              <div v-if="achievement.isUnlocked" class="unlock-overlay">
                <div class="unlock-shine"></div>
              </div>
            </div>
          </div>

          <!-- Estado vacío -->
          <div v-if="filteredAndSortedAchievements.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No se encontraron logros</h3>
            <p>Intenta cambiar el filtro para ver más logros.</p>
          </div>
        </section>

        <!-- Estadísticas por categoría -->
        <section class="category-stats">
          <h2 class="section-title">📊 Progreso por Categoría</h2>
          <div class="category-grid">
            <div 
              v-for="(categoryData, category) in categoryStats"
              :key="category"
              class="category-card"
              @click="activeFilter = category"
            >
              <div class="category-header">
                <span class="category-icon">{{ getCategoryIcon(category) }}</span>
                <h4 class="category-name">{{ getCategoryLabel(category) }}</h4>
              </div>
              <div class="category-progress">
                <div class="category-stats-numbers">
                  <span class="unlocked">{{ categoryData.unlocked }}</span>
                  <span class="divider">/</span>
                  <span class="total">{{ categoryData.total }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${(categoryData.unlocked / categoryData.total) * 100}%` }"
                  ></div>
                </div>
                <span class="category-percentage">
                  {{ Math.round((categoryData.unlocked / categoryData.total) * 100) }}%
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal de detalle de logro -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedAchievement" class="achievement-modal-overlay" @click="closeModal">
          <div class="achievement-modal" @click.stop>
            <button class="modal-close" @click="closeModal">✕</button>
            
            <div class="modal-header">
              <div class="modal-icon">{{ selectedAchievement.icon }}</div>
              <div class="modal-title-section">
                <h2 class="modal-title">{{ selectedAchievement.name }}</h2>
                <span class="modal-category">{{ getCategoryLabel(selectedAchievement.category) }}</span>
              </div>
              <div v-if="selectedAchievement.isUnlocked" class="modal-badge">
                <span class="badge-icon">✨</span>
                <span class="badge-text">Desbloqueado</span>
              </div>
            </div>
            
            <div class="modal-content">
              <p class="modal-description">{{ selectedAchievement.description }}</p>
              
              <div class="modal-progress">
                <div class="progress-header">
                  <span class="progress-label">Progreso</span>
                  <span class="progress-numbers">
                    {{ selectedAchievement.progress }} / {{ selectedAchievement.maxProgress }}
                  </span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%` }"
                  ></div>
                </div>
              </div>
              
              <div v-if="selectedAchievement.isUnlocked && selectedAchievement.unlockedAt" class="modal-unlock-info">
                <h4>Información de Desbloqueo</h4>
                <div class="unlock-details">
                  <div class="unlock-detail">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">{{ formatDate(selectedAchievement.unlockedAt) }}</span>
                  </div>
                  <div class="unlock-detail">
                    <span class="detail-label">Hace:</span>
                    <span class="detail-value">{{ formatRelativeDate(selectedAchievement.unlockedAt) }}</span>
                  </div>
                </div>
              </div>
              
              <div v-else class="modal-tips">
                <h4>Cómo Desbloquear</h4>
                <p class="tip-text">{{ getDetailedTip(selectedAchievement) }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAchievementsStore } from '@/stores/achievements'
import type { Achievement, AchievementCategory } from '@/types'

// ============================================================================
// STORES
// ============================================================================

const achievementsStore = useAchievementsStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const activeFilter = ref<string>('all')
const sortBy = ref<string>('progress')
const selectedAchievement = ref<Achievement | null>(null)
const highlightedAchievement = ref<string | null>(null)
const isRefreshing = ref(false)
const achievementRefs = ref<Record<string, HTMLElement>>({})

// ============================================================================
// COMPUTED
// ============================================================================

const filters = computed(() => [
  { key: 'all', label: 'Todos', icon: '🏆' },
  { key: 'unlocked', label: 'Desbloqueados', icon: '✅' },
  { key: 'locked', label: 'Bloqueados', icon: '🔒' },
  { key: 'gameplay', label: 'Jugabilidad', icon: '🎮' },
  { key: 'milestone', label: 'Hitos', icon: '🎯' },
  { key: 'seasonal', label: 'Temporada', icon: '🌺' }
])

const filteredAchievements = computed(() => {
  let filtered = achievementsStore.achievements

  switch (activeFilter.value) {
    case 'unlocked':
      filtered = filtered.filter(a => a.isUnlocked)
      break
    case 'locked':
      filtered = filtered.filter(a => !a.isUnlocked)
      break
    case 'gameplay':
    case 'milestone':
    case 'seasonal':
      filtered = filtered.filter(a => a.category === activeFilter.value)
      break
  }

  return filtered
})

const filteredAndSortedAchievements = computed(() => {
  const filtered = [...filteredAchievements.value]

  switch (sortBy.value) {
    case 'name':
      return filtered.sort((a, b) => a.name.localeCompare(b.name))
    case 'category':
      return filtered.sort((a, b) => a.category.localeCompare(b.category))
    case 'unlocked':
      return filtered.sort((a, b) => {
        if (a.isUnlocked && !b.isUnlocked) return -1
        if (!a.isUnlocked && b.isUnlocked) return 1
        return 0
      })
    case 'date':
      return filtered.sort((a, b) => {
        if (!a.unlockedAt && !b.unlockedAt) return 0
        if (!a.unlockedAt) return 1
        if (!b.unlockedAt) return -1
        return b.unlockedAt.getTime() - a.unlockedAt.getTime()
      })
    case 'progress':
    default:
      return filtered.sort((a, b) => {
        if (a.isUnlocked && !b.isUnlocked) return -1
        if (!a.isUnlocked && b.isUnlocked) return 1
        
        const aProgress = (a.progress / a.maxProgress) * 100
        const bProgress = (b.progress / b.maxProgress) * 100
        return bProgress - aProgress
      })
  }
})

const recentAchievementsCount = computed(() => 
  achievementsStore.recentAchievements.length
)

const nearCompletionCount = computed(() => 
  achievementsStore.nextAchievements.length
)

const categoryStats = computed(() => {
  const stats = achievementsStore.getAchievementStats()
  return stats.byCategory
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Obtiene el conteo de logros para un filtro específico
 */
function getFilterCount(filterKey: string): number {
  switch (filterKey) {
    case 'all':
      return achievementsStore.achievements.length
    case 'unlocked':
      return achievementsStore.unlockedAchievements.length
    case 'locked':
      return achievementsStore.lockedAchievements.length
    case 'gameplay':
    case 'milestone':
    case 'seasonal':
      return achievementsStore.getAchievementsByCategory(filterKey).length
    default:
      return 0
  }
}

/**
 * Obtiene la etiqueta de categoría
 */
function getCategoryLabel(category: AchievementCategory): string {
  const labels = {
    gameplay: 'Jugabilidad',
    milestone: 'Hito',
    seasonal: 'Temporada'
  }
  return labels[category] || category
}

/**
 * Obtiene el icono de categoría
 */
function getCategoryIcon(category: AchievementCategory): string {
  const icons = {
    gameplay: '🎮',
    milestone: '🎯',
    seasonal: '🌺'
  }
  return icons[category] || '🏆'
}

/**
 * Verifica si un logro está cerca de completarse
 */
function isNearCompletion(achievement: Achievement): boolean {
  const progress = (achievement.progress / achievement.maxProgress) * 100
  return progress >= 75
}

/**
 * Formatea una fecha
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea una fecha relativa
 */
function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMinutes < 1) return 'ahora mismo'
  if (diffMinutes < 60) return `hace ${diffMinutes} min`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays} días`
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`
  
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

/**
 * Obtiene un consejo para desbloquear un logro
 */
function getAchievementTip(achievement: Achievement): string {
  const tips: Record<string, string> = {
    'first_win': 'Juega una partida y trata de ganar',
    'win_streak_3': 'Gana 3 partidas seguidas sin perder',
    'win_streak_5': 'Mantén una racha de 5 victorias consecutivas',
    'win_streak_10': 'Logra 10 victorias seguidas - ¡todo un desafío!',
    'speed_demon': 'Gana una partida muy rápido, en menos de 2 minutos',
    'patient_player': 'Completa una partida larga, de más de 15 minutos',
    'comeback_king': 'Gana después de perder 5 partidas seguidas',
    'games_10': 'Juega 10 partidas en total',
    'games_25': 'Juega 25 partidas en total',
    'games_50': 'Juega 50 partidas en total',
    'games_100': 'Juega 100 partidas en total',
    'november_champion': 'Gana 20 partidas durante el mes de noviembre',
    'halloween_spirit': 'Juega el 31 de octubre',
    'dia_muertos_2024': 'Juega durante noviembre de 2024'
  }
  
  return tips[achievement.id] || ''
}

/**
 * Obtiene un consejo detallado para el modal
 */
function getDetailedTip(achievement: Achievement): string {
  const detailedTips: Record<string, string> = {
    'first_win': 'Para desbloquear este logro, simplemente juega una partida de lotería y trata de ganar. Marca las cartas correctamente cuando sean cantadas y completa una línea, columna o diagonal.',
    'win_streak_3': 'Necesitas ganar 3 partidas consecutivas sin perder ninguna. Si pierdes una partida, la racha se reinicia.',
    'win_streak_5': 'Un desafío mayor: gana 5 partidas seguidas. Requiere consistencia y un poco de suerte.',
    'win_streak_10': 'El logro más difícil de rachas: 10 victorias consecutivas. Solo los mejores jugadores lo consiguen.',
    'speed_demon': 'Gana una partida en menos de 2 minutos. Necesitarás suerte con las cartas y reaccionar muy rápido.',
    'patient_player': 'Completa una partida que dure más de 15 minutos. Esto puede suceder cuando las cartas tardan en salir.',
    'comeback_king': 'Después de perder 5 partidas seguidas, gana la siguiente. Un logro de perseverancia.',
    'games_10': 'Juega un total de 10 partidas. No importa si ganas o pierdes, solo juega.',
    'november_champion': 'Durante el mes de noviembre, gana 20 partidas. Perfecto para celebrar el Día de Muertos.',
    'halloween_spirit': 'Juega al menos una partida el 31 de octubre para capturar el espíritu de Halloween.',
    'dia_muertos_2024': 'Juega durante noviembre de 2024 para celebrar el Día de Muertos.'
  }
  
  return detailedTips[achievement.id] || 'Sigue jugando para desbloquear este logro.'
}

/**
 * Selecciona un logro para mostrar en modal
 */
function selectAchievement(achievement: Achievement): void {
  selectedAchievement.value = achievement
}

/**
 * Cierra el modal de detalle
 */
function closeModal(): void {
  selectedAchievement.value = null
}

/**
 * Resalta un logro específico
 */
function highlightAchievement(achievementId: string): void {
  highlightedAchievement.value = achievementId
  
  // Cambiar filtro si es necesario
  const achievement = achievementsStore.getAchievementById(achievementId)
  if (achievement && activeFilter.value !== 'all' && activeFilter.value !== achievement.category) {
    activeFilter.value = 'all'
  }
  
  // Scroll al logro después de un breve delay
  nextTick(() => {
    setTimeout(() => {
      const element = achievementRefs.value[achievementId]
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      
      // Quitar resaltado después de 3 segundos
      setTimeout(() => {
        highlightedAchievement.value = null
      }, 3000)
    }, 100)
  })
}

/**
 * Establece referencia a elemento de logro
 */
function setAchievementRef(achievementId: string, el: any): void {
  if (el) {
    achievementRefs.value[achievementId] = el
  }
}

/**
 * Actualiza los logros
 */
async function refreshAchievements(): Promise<void> {
  isRefreshing.value = true
  try {
    // Verificar logros estacionales y otros
    achievementsStore.checkSeasonalAchievements()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular carga
  } finally {
    isRefreshing.value = false
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  // Asegurar que el store esté inicializado
  if (!achievementsStore.isInitialized) {
    await achievementsStore.initialize()
  }
})
</script>

<style scoped>
.achievements-view {
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
}

.refresh-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.refresh-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  transition: transform 0.5s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Main content */
.achievements-main {
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Progress summary */
.progress-summary {
  margin-bottom: var(--spacing-2xl);
}

.summary-card {
  background: linear-gradient(135deg, var(--primary-orange), var(--secondary-purple));
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-2xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
  position: relative;
  overflow: hidden;
}

.summary-content {
  flex: 1;
}

.summary-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-light);
}

.progress-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.progress-stat {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--accent-gold);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-top: var(--spacing-xs);
}

.progress-divider {
  font-size: var(--font-size-2xl);
  font-weight: 300;
  opacity: 0.6;
}

.overall-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-gold);
  border-radius: var(--border-radius-full);
  transition: width var(--transition-normal);
}

.progress-percentage {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--accent-gold);
  min-width: 50px;
  text-align: right;
}

.summary-decoration {
  flex-shrink: 0;
}

.trophy-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
}

.trophy {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

.trophy.silver {
  animation-delay: 1s;
}

.trophy.bronze {
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Filters */
.filters-section {
  margin-bottom: var(--spacing-2xl);
}

.filters {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.filter-button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
}

.filter-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.filter-button.active {
  background: var(--accent-gold);
  color: var(--background-dark);
  border-color: var(--accent-gold);
}

.filter-icon {
  font-size: 1.1em;
}

.filter-count {
  opacity: 0.7;
  font-size: 0.9em;
}

/* Achievements grid */
.achievements-section {
  margin-bottom: var(--spacing-4xl);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.achievement-card.unlocked {
  border-color: var(--success-green);
  background: rgba(6, 255, 165, 0.05);
}

.achievement-card.near-completion {
  border-color: var(--accent-gold);
  background: rgba(255, 211, 63, 0.05);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.achievement-icon {
  font-size: 2.5rem;
  position: relative;
}

.unlock-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.8rem;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

.achievement-category {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

.achievement-content {
  margin-bottom: var(--spacing-lg);
}

.achievement-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: var(--spacing-sm);
}

.achievement-card.unlocked .achievement-name {
  color: var(--success-green);
}

.achievement-description {
  font-size: var(--font-size-md);
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: var(--spacing-sm);
}

.unlock-date {
  font-size: var(--font-size-sm);
  color: var(--success-green);
  opacity: 0.8;
  font-style: italic;
}

.achievement-progress {
  margin-top: var(--spacing-md);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--text-light);
}

.unlock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.unlock-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: var(--spacing-4xl);
  opacity: 0.6;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--accent-gold);
}

/* Special achievements */
.special-achievements {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.special-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.special-achievement-card {
  background: linear-gradient(135deg, var(--primary-orange), var(--secondary-purple));
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 211, 63, 0.3);
}

.special-achievement-card.unlocked {
  border-color: var(--success-green);
  box-shadow: 0 0 20px rgba(6, 255, 165, 0.2);
}

.special-decoration {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0.3;
}

.cempasuchil, .calavera {
  font-size: 1.5rem;
  animation: float 4s ease-in-out infinite;
}

.calavera {
  animation-delay: 2s;
}

.special-content {
  position: relative;
  z-index: 2;
}

.special-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.special-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-light);
}

.special-achievement-card.unlocked .special-name {
  color: var(--accent-gold);
}

.special-description {
  font-size: var(--font-size-md);
  opacity: 0.9;
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
}

.special-progress .progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
}

.special-achievement-card.unlocked .special-progress .progress-fill {
  background: var(--accent-gold);
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
  
  .summary-card {
    flex-direction: column;
    text-align: center;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .special-grid {
    grid-template-columns: 1fr;
  }
}

/* Additional stats */
.additional-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.stat-icon {
  font-size: 1.1em;
}

/* Recent achievements */
.recent-achievements {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.recent-achievement-card {
  background: linear-gradient(135deg, var(--success-green), #04d98b);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.recent-achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(6, 255, 165, 0.3);
}

.recent-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--background-dark);
  margin: 0 0 var(--spacing-xs) 0;
}

.recent-date {
  font-size: var(--font-size-sm);
  color: rgba(45, 27, 105, 0.8);
  margin: 0;
}

.recent-badge {
  font-size: 1.2rem;
  animation: sparkle 2s ease-in-out infinite;
}

/* Next achievements */
.next-achievements {
  margin-bottom: var(--spacing-2xl);
}

.next-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.next-achievement-card {
  background: rgba(255, 211, 63, 0.1);
  border: 2px solid rgba(255, 211, 63, 0.3);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.next-achievement-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-gold);
  background: rgba(255, 211, 63, 0.15);
}

.next-icon {
  font-size: 2rem;
  flex-shrink: 0;
  opacity: 0.8;
}

.next-info {
  flex: 1;
  min-width: 0;
}

.next-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-light);
  margin: 0 0 var(--spacing-sm) 0;
}

.next-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.next-progress .progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-full);
}

.next-progress .progress-fill {
  height: 100%;
  background: var(--accent-gold);
  border-radius: var(--border-radius-full);
  transition: width var(--transition-normal);
}

.next-progress .progress-text {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.8);
  min-width: 40px;
}

.next-percentage {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--accent-gold);
  min-width: 35px;
  text-align: right;
}

/* Sort options */
.sort-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.sort-label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
}

.sort-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

/* Enhanced achievement cards */
.achievement-card.highlighted {
  border-color: var(--accent-gold);
  box-shadow: 0 0 20px rgba(255, 211, 63, 0.4);
  animation: highlight-pulse 2s ease-in-out;
}

@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 211, 63, 0.4); }
  50% { box-shadow: 0 0 30px rgba(255, 211, 63, 0.6); }
}

.achievement-tip {
  font-size: var(--font-size-sm);
  color: var(--accent-gold);
  background: rgba(255, 211, 63, 0.1);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tip-icon {
  font-size: 1em;
}

.unlock-date {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.unlock-icon {
  font-size: 1em;
}

.remaining-progress {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.6);
  margin-top: var(--spacing-xs);
  text-align: center;
}

/* Category stats */
.category-stats {
  margin-bottom: var(--spacing-2xl);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-gold);
  background: rgba(255, 211, 63, 0.05);
}

.category-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-light);
  margin: 0;
}

.category-progress {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.category-stats-numbers {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.category-stats-numbers .unlocked {
  color: var(--success-green);
}

.category-stats-numbers .divider {
  color: rgba(255, 255, 255, 0.5);
}

.category-stats-numbers .total {
  color: rgba(255, 255, 255, 0.8);
}

.category-percentage {
  font-size: var(--font-size-sm);
  color: var(--accent-gold);
  font-weight: 600;
  text-align: right;
}

/* Achievement modal */
.achievement-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: var(--spacing-lg);
}

.achievement-modal {
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--secondary-purple) 100%);
  border: 2px solid var(--accent-gold);
  border-radius: var(--border-radius-xl);
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text-light);
  font-size: var(--font-size-lg);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 1;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl) var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.modal-title-section {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-light);
  margin: 0 0 var(--spacing-xs) 0;
}

.modal-category {
  background: rgba(255, 211, 63, 0.2);
  color: var(--accent-gold);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.modal-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--success-green);
  color: var(--background-dark);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.modal-content {
  padding: var(--spacing-xl);
}

.modal-description {
  font-size: var(--font-size-md);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 var(--spacing-xl) 0;
}

.modal-progress {
  margin-bottom: var(--spacing-xl);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.progress-label {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-light);
}

.progress-numbers {
  font-size: var(--font-size-md);
  color: var(--accent-gold);
  font-weight: 600;
}

.modal-unlock-info h4,
.modal-tips h4 {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--accent-gold);
  margin: 0 0 var(--spacing-md) 0;
}

.unlock-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.unlock-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.7);
}

.detail-value {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  font-weight: 500;
}

.tip-text {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .header-actions {
    order: -1;
    align-self: flex-end;
  }
  
  .back-button {
    align-self: flex-start;
  }
  
  .summary-card {
    flex-direction: column;
    text-align: center;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .recent-grid,
  .next-grid,
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .additional-stats {
    justify-content: center;
  }
  
  .sort-options {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .achievements-main {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .filters {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }
  
  .filter-button {
    flex-shrink: 0;
  }
  
  .achievement-modal {
    margin: var(--spacing-md);
    max-height: calc(100vh - 2 * var(--spacing-md));
  }
  
  .modal-header {
    padding: var(--spacing-xl) var(--spacing-md) var(--spacing-md);
  }
  
  .modal-content {
    padding: var(--spacing-md);
  }
}
</style>