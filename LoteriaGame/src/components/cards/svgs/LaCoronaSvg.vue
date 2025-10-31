<template>
  <g class="la-corona-svg">
    <g transform="translate(100, 140)">
      <!-- Base de la corona -->
      <ellipse
        cx="0" cy="20"
        rx="50" ry="8"
        fill="var(--accent-gold)"
        stroke="var(--bright-yellow)"
        stroke-width="2"
        class="crown-base"
      />
      
      <!-- Banda principal -->
      <rect
        x="-45" y="10"
        width="90" height="20"
        fill="var(--accent-gold)"
        stroke="var(--bright-yellow)"
        stroke-width="1"
        rx="2"
      />
      
      <!-- Picos de la corona -->
      <g class="crown-spikes" :class="{ 'animated': animated }">
        <!-- Pico central (más alto) -->
        <polygon
          points="0,-30 -8,10 8,10"
          fill="var(--accent-gold)"
          stroke="var(--bright-yellow)"
          stroke-width="2"
        />
        
        <!-- Picos laterales -->
        <polygon
          points="-25,-15 -33,10 -17,10"
          fill="var(--accent-gold)"
          stroke="var(--bright-yellow)"
          stroke-width="2"
        />
        <polygon
          points="25,-15 17,10 33,10"
          fill="var(--accent-gold)"
          stroke="var(--bright-yellow)"
          stroke-width="2"
        />
        
        <!-- Picos exteriores -->
        <polygon
          points="-40,-5 -45,10 -35,10"
          fill="var(--accent-gold)"
          stroke="var(--bright-yellow)"
          stroke-width="2"
        />
        <polygon
          points="40,-5 35,10 45,10"
          fill="var(--accent-gold)"
          stroke="var(--bright-yellow)"
          stroke-width="2"
        />
      </g>
      
      <!-- Gemas en la corona -->
      <g class="crown-gems" :class="{ 'animated': animated }">
        <!-- Gema central -->
        <ellipse cx="0" cy="-10" rx="6" ry="8" fill="var(--error-red)" opacity="0.9"/>
        <ellipse cx="0" cy="-12" rx="3" ry="4" fill="#FF69B4" opacity="0.8"/>
        <circle cx="-1" cy="-14" r="1" fill="white" opacity="0.9"/>
        
        <!-- Gemas laterales -->
        <ellipse cx="-25" cy="0" rx="4" ry="5" fill="var(--secondary-purple)" opacity="0.9"/>
        <ellipse cx="-25" cy="-2" rx="2" ry="2.5" fill="#9370DB" opacity="0.8"/>
        
        <ellipse cx="25" cy="0" rx="4" ry="5" fill="var(--secondary-purple)" opacity="0.9"/>
        <ellipse cx="25" cy="-2" rx="2" ry="2.5" fill="#9370DB" opacity="0.8"/>
        
        <!-- Gemas pequeñas -->
        <circle cx="-40" cy="5" r="3" fill="var(--success-green)" opacity="0.8"/>
        <circle cx="40" cy="5" r="3" fill="var(--success-green)" opacity="0.8"/>
      </g>
      
      <!-- Decoraciones doradas -->
      <g class="golden-details">
        <!-- Patrones en la banda -->
        <rect x="-40" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="-30" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="-20" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="-10" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="0" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="10" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="20" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="30" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        <rect x="40" y="15" width="3" height="10" fill="var(--bright-yellow)" opacity="0.8"/>
        
        <!-- Cruces decorativas -->
        <g transform="translate(0, -20)">
          <line x1="-3" y1="0" x2="3" y2="0" stroke="var(--bright-yellow)" stroke-width="2"/>
          <line x1="0" y1="-3" x2="0" y2="3" stroke="var(--bright-yellow)" stroke-width="2"/>
        </g>
      </g>
      
      <!-- Rayos de poder real -->
      <g class="royal-rays" :class="{ 'animated': animated }">
        <line x1="0" y1="-50" x2="0" y2="-70" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="-35" y1="-35" x2="-50" y2="-50" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="35" y1="-35" x2="50" y2="-50" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="-50" y1="0" x2="-70" y2="0" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="50" y1="0" x2="70" y2="0" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
      </g>
      
      <!-- Aura real -->
      <circle
        cx="0" cy="0"
        r="85"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.3"
        class="royal-aura"
        :class="{ 'animated': animated }"
      />
    </g>
  </g>
</template>

<script setup lang="ts">
interface Props {
  animated?: boolean;
}

withDefaults(defineProps<Props>(), {
  animated: true
});
</script>

<style scoped>
.crown-spikes.animated {
  animation: crown-shine 3s ease-in-out infinite;
}

.crown-gems.animated {
  animation: gem-sparkle 2s ease-in-out infinite;
}

.royal-rays.animated {
  animation: ray-glow 4s ease-in-out infinite;
}

.royal-aura.animated {
  animation: royal-pulse 5s ease-in-out infinite;
}

@keyframes crown-shine {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

@keyframes gem-sparkle {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes ray-glow {
  0%, 100% {
    stroke-opacity: 0.7;
    stroke-width: 2;
  }
  50% {
    stroke-opacity: 1;
    stroke-width: 3;
  }
}

@keyframes royal-pulse {
  0%, 100% {
    stroke-opacity: 0.3;
    r: 85;
  }
  50% {
    stroke-opacity: 0.6;
    r: 90;
  }
}
</style>