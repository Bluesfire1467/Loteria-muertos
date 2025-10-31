<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    :class="['icon-calavera', { 'animate-skull-dance': animated }]"
    :style="{ color }"
  >
    <!-- Cráneo principal -->
    <ellipse
      cx="50"
      cy="45"
      rx="35"
      ry="30"
      fill="currentColor"
      stroke="none"
    />
    
    <!-- Cuencas de los ojos -->
    <ellipse
      cx="38"
      cy="38"
      rx="8"
      ry="10"
      fill="var(--background-dark)"
    />
    <ellipse
      cx="62"
      cy="38"
      rx="8"
      ry="10"
      fill="var(--background-dark)"
    />
    
    <!-- Nariz -->
    <path
      d="M50 48 L45 58 L50 62 L55 58 Z"
      fill="var(--background-dark)"
    />
    
    <!-- Sonrisa -->
    <path
      d="M35 65 Q50 75 65 65"
      stroke="var(--background-dark)"
      stroke-width="3"
      fill="none"
      stroke-linecap="round"
    />
    
    <!-- Dientes -->
    <rect x="42" y="65" width="3" height="8" fill="currentColor" />
    <rect x="47" y="65" width="3" height="10" fill="currentColor" />
    <rect x="52" y="65" width="3" height="10" fill="currentColor" />
    <rect x="57" y="65" width="3" height="8" fill="currentColor" />
    
    <!-- Decoraciones florales -->
    <g v-if="decorated">
      <!-- Flor izquierda -->
      <circle cx="25" cy="35" r="4" fill="var(--accent-gold)" opacity="0.8" />
      <circle cx="22" cy="32" r="2" fill="var(--primary-orange)" />
      <circle cx="28" cy="32" r="2" fill="var(--primary-orange)" />
      <circle cx="22" cy="38" r="2" fill="var(--primary-orange)" />
      <circle cx="28" cy="38" r="2" fill="var(--primary-orange)" />
      
      <!-- Flor derecha -->
      <circle cx="75" cy="35" r="4" fill="var(--accent-gold)" opacity="0.8" />
      <circle cx="72" cy="32" r="2" fill="var(--primary-orange)" />
      <circle cx="78" cy="32" r="2" fill="var(--primary-orange)" />
      <circle cx="72" cy="38" r="2" fill="var(--primary-orange)" />
      <circle cx="78" cy="38" r="2" fill="var(--primary-orange)" />
    </g>
    
    <!-- Puntos decorativos -->
    <circle cx="50" cy="25" r="2" fill="var(--accent-gold)" opacity="0.6" />
    <circle cx="30" cy="50" r="1.5" fill="var(--primary-orange)" opacity="0.6" />
    <circle cx="70" cy="50" r="1.5" fill="var(--primary-orange)" opacity="0.6" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string;
  color?: string;
  animated?: boolean;
  decorated?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  animated: false,
  decorated: true
});
</script>

<style scoped>
.icon-calavera {
  transition: all var(--transition-normal);
}

.icon-calavera:hover {
  filter: drop-shadow(0 0 8px var(--accent-gold));
}
</style>