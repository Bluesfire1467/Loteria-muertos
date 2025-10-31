<template>
  <g class="placeholder-card-svg">
    <!-- Placeholder genérico para cartas no implementadas -->
    <g transform="translate(100, 140)">
      <!-- Fondo decorativo -->
      <rect
        x="-60" y="-60"
        width="120" height="120"
        fill="var(--secondary-purple)"
        opacity="0.3"
        rx="15"
        class="placeholder-bg"
        :class="{ 'animated': animated }"
      />
      
      <!-- Patrón decorativo -->
      <g class="decorative-pattern" :class="{ 'animated': animated }">
        <circle cx="-30" cy="-30" r="4" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="30" cy="-30" r="4" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="-30" cy="30" r="4" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="30" cy="30" r="4" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="0" cy="0" r="6" fill="var(--primary-orange)" opacity="0.7"/>
      </g>
      
      <!-- Texto del nombre de la carta -->
      <text 
        x="0" 
        y="0" 
        text-anchor="middle" 
        fill="var(--text-light)" 
        font-family="var(--font-family-display)"
        font-size="12"
        font-weight="bold"
        opacity="0.8"
      >
        {{ cardName }}
      </text>
      
      <!-- Elementos culturales básicos -->
      <g class="cultural-elements" :class="{ 'animated': animated }">
        <!-- Flores de cempasúchil pequeñas -->
        <g transform="translate(-40, 0)">
          <circle cx="0" cy="0" r="5" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)"/>
        </g>
        
        <g transform="translate(40, 0)">
          <circle cx="0" cy="0" r="5" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)"/>
        </g>
      </g>
      
      <!-- Borde decorativo -->
      <rect
        x="-55" y="-55"
        width="110" height="110"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="2"
        rx="12"
        opacity="0.5"
        class="decorative-border"
        :class="{ 'animated': animated }"
      />
    </g>
  </g>
</template>

<script setup lang="ts">
interface Props {
  cardName: string;
  animated?: boolean;
}

withDefaults(defineProps<Props>(), {
  animated: true
});
</script>

<style scoped>
.placeholder-bg.animated {
  animation: gentle-pulse 3s ease-in-out infinite;
}

.decorative-pattern.animated {
  animation: pattern-rotate 8s linear infinite;
}

.cultural-elements.animated {
  animation: element-float 4s ease-in-out infinite;
}

.decorative-border.animated {
  animation: border-glow 5s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes pattern-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes element-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes border-glow {
  0%, 100% {
    stroke-opacity: 0.5;
  }
  50% {
    stroke-opacity: 0.8;
  }
}
</style>