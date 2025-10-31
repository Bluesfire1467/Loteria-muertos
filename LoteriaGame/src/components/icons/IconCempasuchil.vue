<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    :class="['icon-cempasuchil', { 'animate-marigold': animated }]"
    :style="{ color }"
  >
    <!-- Tallo -->
    <rect
      x="48"
      y="60"
      width="4"
      height="35"
      fill="var(--success-green)"
      rx="2"
    />
    
    <!-- Hojas -->
    <ellipse
      cx="35"
      cy="70"
      rx="8"
      ry="4"
      fill="var(--success-green)"
      transform="rotate(-30 35 70)"
      opacity="0.8"
    />
    <ellipse
      cx="65"
      cy="75"
      rx="6"
      ry="3"
      fill="var(--success-green)"
      transform="rotate(45 65 75)"
      opacity="0.8"
    />
    
    <!-- Pétalos exteriores -->
    <g transform="translate(50,40)">
      <!-- Capa exterior de pétalos -->
      <g v-for="i in 12" :key="`outer-${i}`">
        <ellipse
          :transform="`rotate(${i * 30} 0 0)`"
          cx="0"
          cy="-18"
          rx="4"
          ry="12"
          :fill="outerPetalColor"
          opacity="0.9"
        />
      </g>
      
      <!-- Capa media de pétalos -->
      <g v-for="i in 8" :key="`middle-${i}`">
        <ellipse
          :transform="`rotate(${i * 45 + 22.5} 0 0)`"
          cx="0"
          cy="-12"
          rx="3"
          ry="8"
          :fill="middlePetalColor"
          opacity="0.95"
        />
      </g>
      
      <!-- Pétalos interiores -->
      <g v-for="i in 6" :key="`inner-${i}`">
        <ellipse
          :transform="`rotate(${i * 60} 0 0)`"
          cx="0"
          cy="-8"
          rx="2.5"
          ry="6"
          :fill="innerPetalColor"
        />
      </g>
    </g>
    
    <!-- Centro de la flor -->
    <circle
      cx="50"
      cy="40"
      r="6"
      :fill="centerColor"
      opacity="0.9"
    />
    <circle
      cx="50"
      cy="40"
      r="3"
      fill="var(--accent-gold)"
    />
    
    <!-- Detalles del centro -->
    <circle cx="48" cy="38" r="0.5" fill="var(--primary-orange)" />
    <circle cx="52" cy="38" r="0.5" fill="var(--primary-orange)" />
    <circle cx="50" cy="42" r="0.5" fill="var(--primary-orange)" />
    
    <!-- Brillo sutil -->
    <ellipse
      cx="45"
      cy="35"
      rx="2"
      ry="1"
      fill="white"
      opacity="0.3"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: number | string;
  color?: string;
  animated?: boolean;
  variant?: 'orange' | 'yellow' | 'mixed';
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  animated: false,
  variant: 'mixed'
});

const outerPetalColor = computed(() => {
  switch (props.variant) {
    case 'orange':
      return 'var(--primary-orange)';
    case 'yellow':
      return 'var(--accent-gold)';
    case 'mixed':
    default:
      return 'var(--primary-orange)';
  }
});

const middlePetalColor = computed(() => {
  switch (props.variant) {
    case 'orange':
      return 'var(--warm-orange)';
    case 'yellow':
      return 'var(--bright-yellow)';
    case 'mixed':
    default:
      return 'var(--accent-gold)';
  }
});

const innerPetalColor = computed(() => {
  switch (props.variant) {
    case 'orange':
      return 'var(--accent-gold)';
    case 'yellow':
      return 'var(--primary-orange)';
    case 'mixed':
    default:
      return 'var(--bright-yellow)';
  }
});

const centerColor = computed(() => {
  return 'var(--warm-orange)';
});
</script>

<style scoped>
.icon-cempasuchil {
  transition: all var(--transition-normal);
}

.icon-cempasuchil:hover {
  filter: drop-shadow(0 0 12px var(--accent-gold));
}
</style>