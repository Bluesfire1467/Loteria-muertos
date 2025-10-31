<template>
  <div class="papel-picado-container" :class="{ 'animate-papel-picado': animated }">
    <svg
      :width="width"
      :height="height"
      viewBox="0 0 200 60"
      class="papel-picado-svg"
    >
      <!-- Cuerda superior -->
      <line
        x1="0"
        y1="5"
        x2="200"
        y2="5"
        stroke="var(--text-muted)"
        stroke-width="1"
        opacity="0.6"
      />
      
      <!-- Banderas de papel picado -->
      <g v-for="(flag, index) in flags" :key="index">
        <g :transform="`translate(${index * 40 + 10}, 5)`">
          <!-- Bandera base -->
          <path
            :d="flag.path"
            :fill="flag.color"
            :opacity="flag.opacity"
            stroke="none"
          />
          
          <!-- Patrones decorativos -->
          <g v-if="flag.pattern === 'flowers'">
            <!-- Flores pequeñas -->
            <circle cx="15" cy="20" r="2" :fill="flag.accentColor" opacity="0.8" />
            <circle cx="12" cy="18" r="1" :fill="flag.secondaryColor" />
            <circle cx="18" cy="18" r="1" :fill="flag.secondaryColor" />
            <circle cx="12" cy="22" r="1" :fill="flag.secondaryColor" />
            <circle cx="18" cy="22" r="1" :fill="flag.secondaryColor" />
          </g>
          
          <g v-else-if="flag.pattern === 'skulls'">
            <!-- Calavera pequeña -->
            <ellipse cx="15" cy="18" rx="4" ry="3" :fill="flag.accentColor" opacity="0.9" />
            <circle cx="13" cy="17" r="1" :fill="flag.color" />
            <circle cx="17" cy="17" r="1" :fill="flag.color" />
            <path d="M15 19 L13 21 L15 22 L17 21 Z" :fill="flag.color" />
          </g>
          
          <g v-else-if="flag.pattern === 'geometric'">
            <!-- Patrón geométrico -->
            <polygon
              points="15,15 18,18 15,21 12,18"
              :fill="flag.accentColor"
              opacity="0.8"
            />
            <polygon
              points="15,17 16,18 15,19 14,18"
              :fill="flag.secondaryColor"
            />
          </g>
          
          <g v-else-if="flag.pattern === 'stars'">
            <!-- Estrella -->
            <polygon
              points="15,15 16,18 19,18 17,20 18,23 15,21 12,23 13,20 11,18 14,18"
              :fill="flag.accentColor"
              opacity="0.8"
            />
          </g>
          
          <!-- Sombra sutil -->
          <path
            :d="flag.shadowPath"
            fill="black"
            opacity="0.1"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  width?: number | string;
  height?: number | string;
  animated?: boolean;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: 200,
  height: 60,
  animated: true,
  count: 5
});

interface Flag {
  path: string;
  shadowPath: string;
  color: string;
  accentColor: string;
  secondaryColor: string;
  opacity: number;
  pattern: 'flowers' | 'skulls' | 'geometric' | 'stars';
}

const colors = [
  'var(--primary-orange)',
  'var(--accent-gold)',
  'var(--secondary-purple)',
  'var(--warm-orange)',
  'var(--bright-yellow)'
];

const accentColors = [
  'var(--accent-gold)',
  'var(--primary-orange)',
  'var(--bright-yellow)',
  'var(--secondary-purple)',
  'var(--warm-orange)'
];

const secondaryColors = [
  'var(--secondary-purple)',
  'var(--deep-purple)',
  'var(--primary-orange)',
  'var(--accent-gold)',
  'var(--warm-orange)'
];

const patterns: Array<'flowers' | 'skulls' | 'geometric' | 'stars'> = [
  'flowers', 'skulls', 'geometric', 'stars'
];

const flags = computed<Flag[]>(() => {
  return Array.from({ length: props.count }, (_, index) => {
    const colorIndex = index % colors.length;
    const patternIndex = index % patterns.length;
    
    // Diferentes formas de banderas
    const shapes = [
      // Rectangular con picos
      'M0,0 L30,0 L30,35 L15,45 L0,35 Z',
      // Triangular
      'M0,0 L30,0 L15,40 Z',
      // Rectangular con corte en V
      'M0,0 L30,0 L30,30 L15,40 L0,30 Z',
      // Forma de escudo
      'M0,0 L30,0 L30,25 L15,35 L0,25 Z'
    ];
    
    const shadowShapes = [
      'M2,2 L32,2 L32,37 L17,47 L2,37 Z',
      'M2,2 L32,2 L17,42 Z',
      'M2,2 L32,2 L32,32 L17,42 L2,32 Z',
      'M2,2 L32,2 L32,27 L17,37 L2,27 Z'
    ];
    
    const shapeIndex = index % shapes.length;
    
    return {
      path: shapes[shapeIndex],
      shadowPath: shadowShapes[shapeIndex],
      color: colors[colorIndex],
      accentColor: accentColors[colorIndex],
      secondaryColor: secondaryColors[colorIndex],
      opacity: 0.85 + (Math.sin(index) * 0.1),
      pattern: patterns[patternIndex]
    };
  });
});
</script>

<style scoped>
.papel-picado-container {
  position: relative;
  overflow: hidden;
}

.papel-picado-svg {
  width: 100%;
  height: 100%;
}

.animate-papel-picado {
  animation: papel-picado-sway 6s ease-in-out infinite;
}

@keyframes papel-picado-sway {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(2px) rotate(0.5deg);
  }
  50% {
    transform: translateX(0) rotate(0deg);
  }
  75% {
    transform: translateX(-2px) rotate(-0.5deg);
  }
}

/* Animación individual para cada bandera */
.papel-picado-svg g:nth-child(odd) {
  animation: flag-flutter-1 4s ease-in-out infinite;
}

.papel-picado-svg g:nth-child(even) {
  animation: flag-flutter-2 5s ease-in-out infinite;
}

@keyframes flag-flutter-1 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-1px) rotate(1deg);
  }
}

@keyframes flag-flutter-2 {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(1px) rotate(-1deg);
  }
}

/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  .animate-papel-picado,
  .papel-picado-svg g {
    animation: none;
  }
}
</style>