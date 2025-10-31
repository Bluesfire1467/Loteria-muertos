<template>
  <div class="cultural-decoration" :class="[`decoration-${type}`, { 'animated': animated }]">
    <!-- Papel Picado superior -->
    <div v-if="showPapelPicado" class="papel-picado-top">
      <PapelPicado :animated="animated" :count="papelPicadoCount" />
    </div>
    
    <!-- Contenido principal con patrón de fondo -->
    <div class="decoration-content">
      <MexicanPattern
        v-if="showPattern"
        :pattern="pattern"
        :intensity="patternIntensity"
        :animated="animated"
      />
      
      <!-- Flores de cempasúchil en las esquinas -->
      <div v-if="showFlowers" class="corner-flowers">
        <div class="flower top-left">
          <IconCempasuchil :size="flowerSize" :animated="animated" variant="orange" />
        </div>
        <div class="flower top-right">
          <IconCempasuchil :size="flowerSize" :animated="animated" variant="yellow" />
        </div>
        <div class="flower bottom-left">
          <IconCempasuchil :size="flowerSize" :animated="animated" variant="mixed" />
        </div>
        <div class="flower bottom-right">
          <IconCempasuchil :size="flowerSize" :animated="animated" variant="orange" />
        </div>
      </div>
      
      <!-- Calaveras decorativas -->
      <div v-if="showSkulls" class="decorative-skulls">
        <div class="skull skull-1">
          <IconCalavera :size="skullSize" :animated="animated" :decorated="true" />
        </div>
        <div class="skull skull-2">
          <IconCalavera :size="skullSize" :animated="animated" :decorated="true" />
        </div>
      </div>
      
      <!-- Contenido del slot -->
      <div class="slot-content">
        <slot />
      </div>
    </div>
    
    <!-- Elementos flotantes -->
    <div v-if="showFloatingElements" class="floating-elements">
      <div 
        v-for="element in floatingElements" 
        :key="element.id"
        class="floating-element"
        :style="element.style"
      >
        <component 
          :is="element.component" 
          :size="element.size" 
          :animated="animated"
          v-bind="element.props"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PapelPicado from './PapelPicado.vue';
import MexicanPattern from './MexicanPattern.vue';
import IconCempasuchil from './icons/IconCempasuchil.vue';
import IconCalavera from './icons/IconCalavera.vue';

interface Props {
  type?: 'full' | 'minimal' | 'header' | 'card' | 'background';
  animated?: boolean;
  showPapelPicado?: boolean;
  showPattern?: boolean;
  showFlowers?: boolean;
  showSkulls?: boolean;
  showFloatingElements?: boolean;
  pattern?: 'aztec' | 'talavera' | 'sarape' | 'geometric' | 'floral';
  patternIntensity?: 'subtle' | 'medium' | 'strong';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'full',
  animated: true,
  showPapelPicado: true,
  showPattern: true,
  showFlowers: true,
  showSkulls: false,
  showFloatingElements: false,
  pattern: 'aztec',
  patternIntensity: 'subtle'
});

const papelPicadoCount = computed(() => {
  switch (props.type) {
    case 'full': return 8;
    case 'header': return 6;
    case 'card': return 4;
    case 'minimal': return 3;
    default: return 5;
  }
});

const flowerSize = computed(() => {
  switch (props.type) {
    case 'full': return 32;
    case 'header': return 28;
    case 'card': return 20;
    case 'minimal': return 16;
    default: return 24;
  }
});

const skullSize = computed(() => {
  switch (props.type) {
    case 'full': return 28;
    case 'header': return 24;
    case 'card': return 18;
    case 'minimal': return 14;
    default: return 20;
  }
});

interface FloatingElement {
  id: string;
  component: string;
  size: number;
  style: Record<string, string>;
  props: Record<string, any>;
}

const floatingElements = computed<FloatingElement[]>(() => {
  if (!props.showFloatingElements) return [];
  
  return [
    {
      id: 'float-1',
      component: 'IconCempasuchil',
      size: 16,
      style: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        animationDelay: '0s'
      },
      props: { variant: 'yellow' }
    },
    {
      id: 'float-2',
      component: 'IconCalavera',
      size: 14,
      style: {
        position: 'absolute',
        top: '60%',
        right: '15%',
        animationDelay: '2s'
      },
      props: { decorated: false }
    },
    {
      id: 'float-3',
      component: 'IconCempasuchil',
      size: 12,
      style: {
        position: 'absolute',
        bottom: '30%',
        left: '20%',
        animationDelay: '4s'
      },
      props: { variant: 'orange' }
    }
  ];
});
</script>

<style scoped>
.cultural-decoration {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.papel-picado-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.decoration-content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.slot-content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
}

/* Flores en las esquinas */
.corner-flowers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.flower {
  position: absolute;
  opacity: 0.6;
  transition: opacity var(--transition-normal);
}

.flower.top-left {
  top: var(--spacing-sm);
  left: var(--spacing-sm);
}

.flower.top-right {
  top: var(--spacing-sm);
  right: var(--spacing-sm);
}

.flower.bottom-left {
  bottom: var(--spacing-sm);
  left: var(--spacing-sm);
}

.flower.bottom-right {
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
}

/* Calaveras decorativas */
.decorative-skulls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.skull {
  position: absolute;
  opacity: 0.4;
}

.skull-1 {
  top: 50%;
  left: var(--spacing-md);
  transform: translateY(-50%) rotate(-10deg);
}

.skull-2 {
  top: 30%;
  right: var(--spacing-md);
  transform: rotate(15deg);
}

/* Elementos flotantes */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-element {
  opacity: 0.3;
  animation: float-gentle 6s ease-in-out infinite;
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

/* Variaciones por tipo */
.decoration-full {
  min-height: 100vh;
}

.decoration-header {
  height: 120px;
}

.decoration-card {
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.decoration-minimal .corner-flowers,
.decoration-minimal .decorative-skulls {
  display: none;
}

.decoration-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

/* Hover effects */
.cultural-decoration:hover .flower {
  opacity: 0.8;
}

.cultural-decoration:hover .skull {
  opacity: 0.6;
}

.cultural-decoration:hover .floating-element {
  opacity: 0.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .corner-flowers {
    display: none;
  }
  
  .decorative-skulls {
    display: none;
  }
  
  .floating-elements {
    display: none;
  }
}

/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  .floating-element {
    animation: none;
  }
}
</style>