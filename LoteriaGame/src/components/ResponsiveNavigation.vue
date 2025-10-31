<template>
  <nav 
    class="responsive-navigation"
    :class="[
      `nav-${variant}`,
      `breakpoint-${breakpoint}`,
      {
        'nav-open': isOpen,
        'has-backdrop': showBackdrop,
        'touch-device': isTouchDevice
      }
    ]"
  >
    <!-- Header de navegación -->
    <div class="nav-header">
      
      <!-- Logo/Título -->
      <router-link to="/" class="nav-brand" @click="closeNav">
        <IconCalavera :size="32" :animated="true" />
        <span class="brand-text">Lotería</span>
        <span class="brand-subtitle">Día de Muertos</span>
      </router-link>
      
      <!-- Botón de menú móvil -->
      <button 
        v-if="isMobile"
        class="nav-toggle"
        @click="toggleNav"
        :aria-label="isOpen ? 'Cerrar menú' : 'Abrir menú'"
        :aria-expanded="isOpen"
      >
        <span class="toggle-line" :class="{ 'active': isOpen }"></span>
        <span class="toggle-line" :class="{ 'active': isOpen }"></span>
        <span class="toggle-line" :class="{ 'active': isOpen }"></span>
      </button>
      
    </div>
    
    <!-- Menú de navegación -->
    <div class="nav-menu" :class="{ 'nav-menu-open': isOpen }">
      
      <!-- Enlaces principales -->
      <ul class="nav-links">
        <li class="nav-item">
          <router-link 
            to="/" 
            class="nav-link"
            @click="closeNav"
            active-class="nav-link-active"
          >
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Inicio</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/game" 
            class="nav-link"
            @click="closeNav"
            active-class="nav-link-active"
          >
            <span class="nav-icon">🎮</span>
            <span class="nav-text">Jugar</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/statistics" 
            class="nav-link"
            @click="closeNav"
            active-class="nav-link-active"
          >
            <span class="nav-icon">📊</span>
            <span class="nav-text">Estadísticas</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/achievements" 
            class="nav-link"
            @click="closeNav"
            active-class="nav-link-active"
          >
            <span class="nav-icon">🏆</span>
            <span class="nav-text">Logros</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/cartas" 
            class="nav-link"
            @click="closeNav"
            active-class="nav-link-active"
          >
            <span class="nav-icon">🎴</span>
            <span class="nav-text">Cartas</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/settings" 
            class="nav-link"
            @click="closeNav"
            active-class="nav-link-active"
          >
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Configuración</span>
          </router-link>
        </li>
      </ul>
      
      <!-- Controles adicionales -->
      <div class="nav-controls">
        
        <!-- Selector de tema -->
        <div class="theme-selector">
          <button 
            class="theme-toggle"
            @click="toggleTheme"
            :aria-label="`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`"
          >
            <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
            <span v-if="!isMobile" class="theme-text">
              {{ isDark ? 'Claro' : 'Oscuro' }}
            </span>
          </button>
        </div>
        
        <!-- Decoración cultural -->
        <div v-if="!isMobile" class="nav-decoration">
          <IconCempasuchil :size="20" :animated="true" variant="orange" />
        </div>
        
      </div>
      
    </div>
    
    <!-- Backdrop para móvil -->
    <div 
      v-if="showBackdrop && isOpen"
      class="nav-backdrop"
      @click="closeNav"
    ></div>
    
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useResponsive } from '@/composables/useResponsive';
import { useTheme } from '@/utils/themeManager';
import IconCalavera from './icons/IconCalavera.vue';
import IconCempasuchil from './icons/IconCempasuchil.vue';

interface Props {
  variant?: 'header' | 'sidebar' | 'bottom';
  showBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'header',
  showBackdrop: true
});

const router = useRouter();
const route = useRoute();

const { isMobile, isTablet, breakpoint, isTouchDevice } = useResponsive();
const { isDark, toggleTheme } = useTheme();

const isOpen = ref(false);

// Cerrar menú al cambiar de ruta
const closeNav = () => {
  isOpen.value = false;
};

const toggleNav = () => {
  isOpen.value = !isOpen.value;
};

// Cerrar menú con Escape
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeNav();
  }
};

// Cerrar menú al redimensionar a desktop
const handleResize = () => {
  if (!isMobile.value && isOpen.value) {
    closeNav();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleResize);
});

// Cerrar menú al cambiar de ruta
router.afterEach(() => {
  closeNav();
});
</script>

<style scoped>
.responsive-navigation {
  position: relative;
  background: var(--background-card);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-primary);
  z-index: 100;
}

/* Header de navegación */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-lg);
  min-height: 64px;
}

/* Brand/Logo */
.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-normal);
}

.nav-brand:hover {
  transform: translateY(-1px);
  filter: drop-shadow(0 4px 8px rgba(255, 211, 63, 0.3));
}

.brand-text {
  font-family: var(--font-family-display);
  font-size: var(--font-size-xl);
  font-weight: 700;
  background: var(--gradient-celebration);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: 400;
}

/* Botón de toggle móvil */
.nav-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-normal);
}

.nav-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.toggle-line {
  width: 20px;
  height: 2px;
  background: var(--text-primary);
  margin: 2px 0;
  transition: all var(--transition-normal);
  transform-origin: center;
}

.toggle-line.active:nth-child(1) {
  transform: rotate(45deg) translate(4px, 4px);
}

.toggle-line.active:nth-child(2) {
  opacity: 0;
}

.toggle-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -4px);
}

/* Menú de navegación */
.nav-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  transition: all var(--transition-normal);
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--spacing-md);
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 211, 63, 0.1);
  transform: translateY(-1px);
}

.nav-link-active {
  color: var(--accent-gold);
  background: rgba(255, 211, 63, 0.15);
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--accent-gold);
  border-radius: 1px;
}

.nav-icon {
  font-size: var(--font-size-lg);
}

.nav-text {
  font-size: var(--font-size-sm);
}

/* Controles adicionales */
.nav-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: none;
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.theme-toggle:hover {
  color: var(--text-primary);
  border-color: var(--border-accent);
  background: rgba(255, 255, 255, 0.05);
}

.theme-icon {
  font-size: var(--font-size-lg);
}

.theme-text {
  font-size: var(--font-size-sm);
}

.nav-decoration {
  opacity: 0.6;
}

/* Backdrop */
.nav-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .nav-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .nav-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-primary);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: var(--spacing-lg);
    transform: translateX(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }
  
  .nav-menu-open {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-links {
    flex-direction: column;
    gap: var(--spacing-sm);
    width: 100%;
    margin-bottom: var(--spacing-xl);
  }
  
  .nav-link {
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
    border-radius: var(--border-radius-lg);
    justify-content: flex-start;
  }
  
  .nav-link-active::after {
    display: none;
  }
  
  .nav-controls {
    width: 100%;
    justify-content: center;
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-primary);
  }
  
  .theme-toggle {
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
  }
  
  .brand-subtitle {
    display: none;
  }
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .nav-text {
    display: none;
  }
  
  .nav-links {
    gap: var(--spacing-sm);
  }
  
  .nav-link {
    padding: var(--spacing-sm);
  }
}

/* Touch device optimizations */
.touch-device .nav-link {
  min-height: 44px;
}

.touch-device .theme-toggle {
  min-height: 44px;
}

/* Variantes de navegación */
.nav-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  flex-direction: column;
  border-right: 1px solid var(--border-primary);
  border-bottom: none;
}

.nav-sidebar .nav-header {
  border-bottom: 1px solid var(--border-primary);
}

.nav-sidebar .nav-menu {
  flex-direction: column;
  align-items: stretch;
  padding: var(--spacing-lg);
  flex: 1;
}

.nav-sidebar .nav-links {
  flex-direction: column;
  width: 100%;
}

.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid var(--border-primary);
  border-bottom: none;
}

.nav-bottom .nav-header {
  display: none;
}

.nav-bottom .nav-menu {
  padding: var(--spacing-sm);
}

.nav-bottom .nav-links {
  flex: 1;
  justify-content: space-around;
}

.nav-bottom .nav-link {
  flex-direction: column;
  gap: 2px;
  padding: var(--spacing-xs);
  min-width: 60px;
}

.nav-bottom .nav-text {
  font-size: var(--font-size-xs);
}

.nav-bottom .nav-controls {
  display: none;
}
</style>