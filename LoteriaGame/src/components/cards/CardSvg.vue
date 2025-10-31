<template>
  <div class="card-svg-container" :class="{ 'marked': isMarked, 'current': isCurrent }">
    <svg
      viewBox="0 0 200 280"
      class="loteria-card-svg"
      :class="[`card-${cardId}`, { 'animated': animated }]"
      preserveAspectRatio="xMidYMid slice"
    >
      <!-- Fondo de la carta -->
      <defs>
        <linearGradient id="cardBackground" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :style="`stop-color:${backgroundColor};stop-opacity:1`" />
          <stop offset="100%" :style="`stop-color:${backgroundColorEnd};stop-opacity:1`" />
        </linearGradient>
        
        <!-- Patrón decorativo -->
        <pattern id="decorativePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="var(--accent-gold)" opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Fondo principal -->
      <rect width="200" height="280" fill="url(#cardBackground)" rx="15" ry="15"/>
      <rect width="200" height="280" fill="url(#decorativePattern)" rx="15" ry="15"/>
      
      <!-- Borde decorativo -->
      <rect 
        x="5" y="5" 
        width="190" height="270" 
        fill="none" 
        stroke="var(--accent-gold)" 
        stroke-width="2" 
        rx="12" ry="12"
        opacity="0.6"
      />
      
      <!-- Contenido específico de cada carta -->
      <g class="card-content">
        <component :is="cardComponent" :animated="animated" />
      </g>
      
      <!-- Nombre de la carta -->
      <g class="card-title">
        <rect x="10" y="240" width="180" height="30" fill="rgba(0,0,0,0.8)" rx="5"/>
        <text 
          x="100" 
          y="258" 
          text-anchor="middle" 
          fill="var(--text-light)" 
          font-family="var(--font-family-display)"
          font-size="14"
          font-weight="bold"
        >
          {{ cardName }}
        </text>
      </g>
      
      <!-- Número de la carta -->
      <circle cx="25" cy="25" r="12" fill="var(--secondary-purple)" opacity="0.9"/>
      <text 
        x="25" 
        y="30" 
        text-anchor="middle" 
        fill="var(--text-light)" 
        font-size="12"
        font-weight="bold"
      >
        {{ cardId }}
      </text>
      
      <!-- Overlay de marca si está marcada (solo el círculo, sin calavera para evitar duplicación) -->
      <g v-if="isMarked" class="mark-overlay">
        <circle cx="100" cy="140" r="40" fill="rgba(6, 255, 165, 0.2)" stroke="var(--success-green)" stroke-width="3"/>
      </g>
      
      <!-- Highlight si es carta actual -->
      <rect 
        v-if="isCurrent"
        x="0" y="0" 
        width="200" height="280" 
        fill="none" 
        stroke="var(--primary-orange)" 
        stroke-width="4" 
        rx="15" ry="15"
        class="current-highlight"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Importar componentes SVG específicos para cada carta
import LaMuerteSvg from './svgs/LaMuerteSvg.vue';
import ElCorazonSvg from './svgs/ElCorazonSvg.vue';
import LaRosaSvg from './svgs/LaRosaSvg.vue';
import ElSolSvg from './svgs/ElSolSvg.vue';
import LaLunaSvg from './svgs/LaLunaSvg.vue';
import LaEstrellaSvg from './svgs/LaEstrellaSvg.vue';
import ElArbolSvg from './svgs/ElArbolSvg.vue';
import LaCalaveraCardSvg from './svgs/LaCalaveraCardSvg.vue';
import ElDiabloSvg from './svgs/ElDiabloSvg.vue';
import LaSirenaSvg from './svgs/LaSirenaSvg.vue';
import ElMusicoSvg from './svgs/ElMusicoSvg.vue';
import LaDamaSvg from './svgs/LaDamaSvg.vue';
import ElCatrinSvg from './svgs/ElCatrinSvg.vue';
import LaCampanaSvg from './svgs/LaCampanaSvg.vue';
import ElMundoSvg from './svgs/ElMundoSvg.vue';
import LaManoSvg from './svgs/LaManoSvg.vue';
import ElPescadoSvg from './svgs/ElPescadoSvg.vue';
import LaPalmaSvg from './svgs/LaPalmaSvg.vue';
import LaMacetaSvg from './svgs/LaMacetaSvg.vue';
import ElArpaSvg from './svgs/ElArpaSvg.vue';
import LaRanaSvg from './svgs/LaRanaSvg.vue';
import ElNopalSvg from './svgs/ElNopalSvg.vue';
import ElSoldadoSvg from './svgs/ElSoldadoSvg.vue';
import LaCoronaSvg from './svgs/LaCoronaSvg.vue';
import ElParaguasSvg from './svgs/ElParaguasSvg.vue';

interface Props {
  cardId: number;
  cardName: string;
  size?: number;
  isMarked?: boolean;
  isCurrent?: boolean;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 100,
  isMarked: false,
  isCurrent: false,
  animated: true
});

// Mapeo de IDs de cartas a componentes SVG
const cardComponents = {
  1: LaMuerteSvg,
  2: ElCorazonSvg,
  3: LaRosaSvg,
  4: ElSolSvg,
  5: LaLunaSvg,
  6: LaEstrellaSvg,
  7: ElArbolSvg,
  8: LaCalaveraCardSvg,
  9: ElDiabloSvg,
  10: LaSirenaSvg,
  11: ElMusicoSvg,
  12: LaDamaSvg,
  13: ElCatrinSvg,
  14: LaCampanaSvg,
  15: ElMundoSvg,
  16: LaManoSvg,
  17: ElPescadoSvg,
  18: LaPalmaSvg,
  19: LaMacetaSvg,
  20: ElArpaSvg,
  21: LaRanaSvg,
  22: ElNopalSvg,
  23: ElSoldadoSvg,
  24: LaCoronaSvg,
  25: ElParaguasSvg
};

// Colores de fondo específicos para cada carta
const cardBackgrounds = {
  1: { bg: '#4A0E4E', end: '#2D1B69' }, // La Muerte - Púrpura oscuro
  2: { bg: '#8B0000', end: '#FF006E' }, // El Corazón - Rojo
  3: { bg: '#FF69B4', end: '#FF1493' }, // La Rosa - Rosa
  4: { bg: '#FFD700', end: '#FFA500' }, // El Sol - Dorado
  5: { bg: '#191970', end: '#4169E1' }, // La Luna - Azul nocturno
  6: { bg: '#483D8B', end: '#6A5ACD' }, // La Estrella - Púrpura
  7: { bg: '#228B22', end: '#32CD32' }, // El Árbol - Verde
  8: { bg: '#2F2F2F', end: '#696969' }, // La Calavera - Gris
  9: { bg: '#8B0000', end: '#B22222' }, // El Diablo - Rojo oscuro
  10: { bg: '#008B8B', end: '#20B2AA' }, // La Sirena - Turquesa
  11: { bg: '#8B4513', end: '#D2691E' }, // El Músico - Marrón
  12: { bg: '#9370DB', end: '#BA55D3' }, // La Dama - Violeta
  13: { bg: '#2F4F4F', end: '#708090' }, // El Catrín - Gris elegante
  14: { bg: '#B8860B', end: '#DAA520' }, // La Campana - Dorado oscuro
  15: { bg: '#4682B4', end: '#87CEEB' }, // El Mundo - Azul cielo
  16: { bg: '#CD853F', end: '#DEB887' }, // La Mano - Beige
  17: { bg: '#4682B4', end: '#5F9EA0' }, // El Pescado - Azul agua
  18: { bg: '#228B22', end: '#90EE90' }, // La Palma - Verde claro
  19: { bg: '#8B4513', end: '#A0522D' }, // La Maceta - Terracota
  20: { bg: '#DAA520', end: '#FFD700' }, // El Arpa - Dorado
  21: { bg: '#228B22', end: '#ADFF2F' }, // La Rana - Verde lima
  22: { bg: '#6B8E23', end: '#9ACD32' }, // El Nopal - Verde oliva
  23: { bg: '#8B4513', end: '#CD853F' }, // El Soldado - Caqui
  24: { bg: '#FFD700', end: '#FFA500' }, // La Corona - Oro
  25: { bg: '#4169E1', end: '#87CEFA' }  // El Paraguas - Azul
};

const cardComponent = computed(() => {
  return cardComponents[props.cardId as keyof typeof cardComponents] || LaMuerteSvg;
});

const backgroundColor = computed(() => {
  return cardBackgrounds[props.cardId as keyof typeof cardBackgrounds]?.bg || '#2D1B69';
});

const backgroundColorEnd = computed(() => {
  return cardBackgrounds[props.cardId as keyof typeof cardBackgrounds]?.end || '#7209B7';
});
</script>

<style scoped>
.card-svg-container {
  position: relative;
  transition: all var(--transition-normal);
  width: 100%;
  height: 100%;
}

.loteria-card-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transition: all var(--transition-normal);
}

.card-svg-container:hover .loteria-card-svg {
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
  /* Removido translateY para evitar que las cartas se salgan del contenedor */
}

.card-svg-container.marked .loteria-card-svg {
  filter: drop-shadow(0 0 15px var(--success-green));
}

.card-svg-container.current .loteria-card-svg {
  filter: drop-shadow(0 0 20px var(--primary-orange));
}

.current-highlight {
  animation: current-pulse 2s ease-in-out infinite;
}

@keyframes current-pulse {
  0%, 100% {
    stroke-opacity: 0.8;
    stroke-width: 4;
  }
  50% {
    stroke-opacity: 1;
    stroke-width: 6;
  }
}

.mark-overlay {
  animation: mark-appear 0.5s ease-out;
}

@keyframes mark-appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animated .card-content {
  animation: subtle-float 4s ease-in-out infinite;
}

@keyframes subtle-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .loteria-card-svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  
  .card-svg-container:hover .loteria-card-svg {
    transform: none;
  }
}
</style>