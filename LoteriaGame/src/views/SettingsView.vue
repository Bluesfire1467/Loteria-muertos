<template>
  <div class="settings-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <router-link to="/" class="back-button">
          ← Volver
        </router-link>
        <h1 class="page-title">⚙️ Configuración</h1>
        <div class="header-spacer"></div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="settings-main">
      <div class="container">
        <!-- Audio Settings -->
        <section class="settings-section">
          <h2 class="section-title">🔊 Audio</h2>
          <div class="settings-card">
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Sonido Habilitado</label>
                <p class="setting-description">Activa o desactiva todos los efectos de sonido</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="settings.audio.soundEnabled"
                    @change="saveSettings"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Música de Fondo</label>
                <p class="setting-description">Reproduce música tradicional mexicana durante el juego</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="settings.audio.musicEnabled"
                    :disabled="!settings.audio.soundEnabled"
                    @change="saveSettings"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Volumen General</label>
                <p class="setting-description">Ajusta el volumen de todos los sonidos</p>
              </div>
              <div class="setting-control">
                <div class="volume-control">
                  <span class="volume-icon">🔈</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    v-model="settings.audio.volume"
                    :disabled="!settings.audio.soundEnabled"
                    @input="saveSettings"
                    class="volume-slider"
                  />
                  <span class="volume-icon">🔊</span>
                  <span class="volume-value">{{ settings.audio.volume }}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Game Settings -->
        <section class="settings-section">
          <h2 class="section-title">🎮 Juego</h2>
          <div class="settings-card">
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Animaciones</label>
                <p class="setting-description">Habilita animaciones y efectos visuales</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="settings.game.animationsEnabled"
                    @change="saveSettings"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Información Cultural</label>
                <p class="setting-description">Muestra información cultural de las cartas automáticamente</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="settings.game.showCulturalInfo"
                    @change="saveSettings"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Dificultad de Bots</label>
                <p class="setting-description">Nivel de dificultad predeterminado para los bots</p>
              </div>
              <div class="setting-control">
                <select 
                  v-model="settings.game.defaultBotDifficulty"
                  @change="saveSettings"
                  class="setting-select"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Medio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Velocidad del Cantor</label>
                <p class="setting-description">Velocidad predeterminada para el cantado de cartas</p>
              </div>
              <div class="setting-control">
                <select 
                  v-model="settings.game.cantorSpeed"
                  @change="saveSettings"
                  class="setting-select"
                >
                  <option value="SLOW">Lento (8s)</option>
                  <option value="NORMAL">Normal (5s)</option>
                  <option value="FAST">Rápido (3s)</option>
                  <option value="RAPID">Muy Rápido (1.5s)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <!-- Display Settings -->
        <section class="settings-section">
          <h2 class="section-title">🎨 Pantalla</h2>
          <div class="settings-card">
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Tema</label>
                <p class="setting-description">Selecciona el tema visual de la aplicación</p>
              </div>
              <div class="setting-control">
                <select 
                  v-model="settings.display.theme"
                  @change="saveSettings"
                  class="setting-select"
                >
                  <option value="auto">Automático</option>
                  <option value="dark">Oscuro</option>
                  <option value="light">Claro</option>
                </select>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Idioma</label>
                <p class="setting-description">Idioma de la interfaz</p>
              </div>
              <div class="setting-control">
                <select 
                  v-model="settings.display.language"
                  @change="saveSettings"
                  class="setting-select"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Reducir Movimiento</label>
                <p class="setting-description">Reduce las animaciones para mejor accesibilidad</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="settings.display.reduceMotion"
                    @change="saveSettings"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- Data Management -->
        <section class="settings-section">
          <h2 class="section-title">💾 Datos</h2>
          <div class="settings-card">
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Datos Guardados</label>
                <p class="setting-description">
                  Estadísticas: {{ dataInfo.stats }}<br>
                  Logros: {{ dataInfo.achievements }}<br>
                  Última actualización: {{ dataInfo.lastUpdate }}
                </p>
              </div>
              <div class="setting-control">
                <button 
                  class="btn btn-outline btn-sm"
                  @click="exportData"
                >
                  📤 Exportar
                </button>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">Importar Datos</label>
                <p class="setting-description">Restaura tus datos desde un archivo de respaldo</p>
              </div>
              <div class="setting-control">
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="importData"
                  accept=".json"
                  style="display: none"
                />
                <button 
                  class="btn btn-outline btn-sm"
                  @click="$refs.fileInput?.click()"
                >
                  📥 Importar
                </button>
              </div>
            </div>

            <div class="setting-item danger">
              <div class="setting-info">
                <label class="setting-label">Restablecer Datos</label>
                <p class="setting-description">
                  ⚠️ Esto eliminará todas tus estadísticas, logros y configuraciones
                </p>
              </div>
              <div class="setting-control">
                <button 
                  class="btn btn-danger btn-sm"
                  @click="showResetConfirm = true"
                >
                  🗑️ Restablecer
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- About Section -->
        <section class="settings-section">
          <h2 class="section-title">ℹ️ Acerca de</h2>
          <div class="settings-card">
            <div class="about-content">
              <div class="app-info">
                <h3 class="app-name">Lotería Día de Muertos</h3>
                <p class="app-version">Versión 1.0.0</p>
                <p class="app-description">
                  Un juego tradicional mexicano con temática del Día de Muertos, 
                  desarrollado para celebrar y preservar la cultura mexicana.
                </p>
              </div>
              
              <div class="credits">
                <h4>Créditos</h4>
                <ul>
                  <li>Desarrollado con Vue 3 + TypeScript</li>
                  <li>Cartas tradicionales de la Lotería Mexicana</li>
                  <li>Inspirado en las tradiciones del Día de Muertos</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal de confirmación de reset -->
    <div v-if="showResetConfirm" class="modal-overlay" @click="showResetConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>⚠️ Confirmar Restablecimiento</h3>
        <p>
          Esta acción eliminará permanentemente:
        </p>
        <ul class="reset-list">
          <li>Todas las estadísticas de juego</li>
          <li>Todos los logros desbloqueados</li>
          <li>Todas las configuraciones personalizadas</li>
        </ul>
        <p><strong>Esta acción no se puede deshacer.</strong></p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showResetConfirm = false">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="resetAllData">
            Restablecer Todo
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="showToast" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// ============================================================================
// REACTIVE STATE
// ============================================================================

const showResetConfirm = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')
const fileInput = ref<HTMLInputElement>()

const settings = reactive({
  audio: {
    soundEnabled: true,
    musicEnabled: true,
    volume: 75
  },
  game: {
    animationsEnabled: true,
    showCulturalInfo: true,
    defaultBotDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
    cantorSpeed: 'NORMAL' as 'SLOW' | 'NORMAL' | 'FAST' | 'RAPID'
  },
  display: {
    theme: 'auto' as 'auto' | 'dark' | 'light',
    language: 'es' as 'es' | 'en',
    reduceMotion: false
  }
})

// ============================================================================
// COMPUTED
// ============================================================================

const dataInfo = computed(() => ({
  stats: '127 partidas, 89 victorias',
  achievements: '8 de 13 desbloqueados',
  lastUpdate: new Date().toLocaleDateString('es-ES')
}))

// ============================================================================
// METHODS
// ============================================================================

/**
 * Guarda la configuración
 */
function saveSettings(): void {
  try {
    localStorage.setItem('loteria_settings', JSON.stringify(settings))
    showToastMessage('Configuración guardada', 'success')
  } catch (error) {
    console.error('Error al guardar configuración:', error)
    showToastMessage('Error al guardar configuración', 'error')
  }
}

/**
 * Carga la configuración guardada
 */
function loadSettings(): void {
  try {
    const saved = localStorage.getItem('loteria_settings')
    if (saved) {
      const parsedSettings = JSON.parse(saved)
      Object.assign(settings, parsedSettings)
    }
  } catch (error) {
    console.error('Error al cargar configuración:', error)
  }
}

/**
 * Exporta los datos del usuario
 */
function exportData(): void {
  try {
    const data = {
      settings,
      stats: {
        totalGames: 127,
        wins: 89,
        // ... más estadísticas
      },
      achievements: [
        // ... logros
      ],
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `loteria-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToastMessage('Datos exportados correctamente', 'success')
  } catch (error) {
    console.error('Error al exportar datos:', error)
    showToastMessage('Error al exportar datos', 'error')
  }
}

/**
 * Importa datos del usuario
 */
function importData(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      
      // Validar estructura básica
      if (!data.settings || !data.version) {
        throw new Error('Archivo de respaldo inválido')
      }

      // Restaurar configuración
      Object.assign(settings, data.settings)
      saveSettings()

      // Aquí se restaurarían también las estadísticas y logros
      
      showToastMessage('Datos importados correctamente', 'success')
    } catch (error) {
      console.error('Error al importar datos:', error)
      showToastMessage('Error al importar datos: archivo inválido', 'error')
    }
  }
  reader.readAsText(file)
}

/**
 * Restablece todos los datos
 */
function resetAllData(): void {
  try {
    // Limpiar localStorage
    localStorage.removeItem('loteria_settings')
    localStorage.removeItem('loteria_stats')
    localStorage.removeItem('loteria_achievements')
    
    // Restablecer configuración a valores por defecto
    settings.audio.soundEnabled = true
    settings.audio.musicEnabled = true
    settings.audio.volume = 75
    settings.game.animationsEnabled = true
    settings.game.showCulturalInfo = true
    settings.game.defaultBotDifficulty = 'medium'
    settings.game.cantorSpeed = 'NORMAL'
    settings.display.theme = 'auto'
    settings.display.language = 'es'
    settings.display.reduceMotion = false

    showResetConfirm.value = false
    showToastMessage('Todos los datos han sido restablecidos', 'success')
  } catch (error) {
    console.error('Error al restablecer datos:', error)
    showToastMessage('Error al restablecer datos', 'error')
  }
}

/**
 * Muestra un mensaje toast
 */
function showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// ============================================================================
// LIFECYCLE
// ============================================================================

// Cargar configuración al montar el componente
loadSettings()
</script>

<style scoped>
.settings-view {
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

.header-spacer {
  width: 60px;
}

/* Main content */
.settings-main {
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: var(--spacing-2xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.settings-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-xl);
  border: 1px solid rgba(255, 211, 63, 0.2);
  overflow: hidden;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: var(--spacing-lg);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.danger {
  background: rgba(255, 0, 110, 0.05);
  border-color: rgba(255, 0, 110, 0.2);
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-light);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.setting-description {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  opacity: 0.7;
  line-height: 1.4;
  margin: 0;
}

.setting-control {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  transition: var(--transition-normal);
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: var(--text-light);
  transition: var(--transition-normal);
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background: var(--accent-gold);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
  background: var(--background-dark);
}

input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Volume Control */
.volume-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 200px;
}

.volume-icon {
  font-size: var(--font-size-sm);
  opacity: 0.7;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--accent-gold);
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--accent-gold);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.volume-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--accent-gold);
  min-width: 35px;
  text-align: right;
}

/* Select */
.setting-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-light);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  min-width: 150px;
}

.setting-select:focus {
  outline: none;
  border-color: var(--accent-gold);
}

/* About Section */
.about-content {
  padding: var(--spacing-xl);
}

.app-info {
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.app-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-xs);
}

.app-version {
  font-size: var(--font-size-sm);
  opacity: 0.7;
  margin-bottom: var(--spacing-md);
}

.app-description {
  font-size: var(--font-size-md);
  line-height: 1.6;
  opacity: 0.9;
}

.credits h4 {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: var(--spacing-sm);
}

.credits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.credits li {
  font-size: var(--font-size-sm);
  opacity: 0.8;
  margin-bottom: var(--spacing-xs);
  padding-left: var(--spacing-md);
  position: relative;
}

.credits li:before {
  content: "•";
  color: var(--accent-gold);
  position: absolute;
  left: 0;
}

/* Modal */
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
  max-width: 500px;
  width: 90%;
  border: 2px solid var(--error-red);
}

.modal-content h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--error-red);
}

.modal-content p {
  margin-bottom: var(--spacing-md);
  opacity: 0.9;
}

.reset-list {
  list-style: none;
  padding: 0;
  margin: var(--spacing-md) 0;
  background: rgba(255, 0, 110, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.reset-list li {
  margin-bottom: var(--spacing-xs);
  padding-left: var(--spacing-md);
  position: relative;
}

.reset-list li:before {
  content: "⚠️";
  position: absolute;
  left: 0;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
}

/* Toast */
.toast {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  background: var(--background-dark);
  color: var(--text-light);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 2px solid;
  z-index: 1001;
  animation: toast-slide-in 0.3s ease-out;
}

.toast.success {
  border-color: var(--success-green);
  background: rgba(6, 255, 165, 0.1);
}

.toast.error {
  border-color: var(--error-red);
  background: rgba(255, 0, 110, 0.1);
}

.toast.info {
  border-color: var(--accent-gold);
  background: rgba(255, 211, 63, 0.1);
}

@keyframes toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
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
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .setting-control {
    align-self: stretch;
    justify-content: flex-end;
  }
  
  .volume-control {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .settings-main {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .modal-content {
    padding: var(--spacing-xl);
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .toast {
    left: var(--spacing-md);
    right: var(--spacing-md);
    bottom: var(--spacing-md);
  }
}
</style>