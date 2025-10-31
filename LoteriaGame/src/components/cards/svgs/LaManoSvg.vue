<template>
  <g class="la-mano-svg">
    <g transform="translate(100, 140)">
      <!-- Palma de la mano -->
      <g class="hand-palm" :class="{ 'animated': animated }">
        <ellipse cx="0" cy="10" rx="25" ry="35" fill="#DEB887" stroke="#CD853F" stroke-width="2"/>
        <ellipse cx="0" cy="10" rx="20" ry="30" fill="#F5DEB3" opacity="0.8"/>
      </g>
      
      <!-- Dedos -->
      <g class="fingers">
        <!-- Pulgar -->
        <ellipse cx="-20" cy="0" rx="8" ry="15" fill="#DEB887" transform="rotate(-30 -20 0)"/>
        <ellipse cx="-18" cy="-2" rx="6" ry="12" fill="#F5DEB3" opacity="0.8" transform="rotate(-30 -18 -2)"/>
        
        <!-- Índice -->
        <ellipse cx="-10" cy="-25" rx="6" ry="18" fill="#DEB887"/>
        <ellipse cx="-10" cy="-25" rx="4" ry="15" fill="#F5DEB3" opacity="0.8"/>
        
        <!-- Medio -->
        <ellipse cx="0" cy="-30" rx="6" ry="20" fill="#DEB887"/>
        <ellipse cx="0" cy="-30" rx="4" ry="17" fill="#F5DEB3" opacity="0.8"/>
        
        <!-- Anular -->
        <ellipse cx="10" cy="-28" rx="6" ry="18" fill="#DEB887"/>
        <ellipse cx="10" cy="-28" rx="4" ry="15" fill="#F5DEB3" opacity="0.8"/>
        
        <!-- Meñique -->
        <ellipse cx="18" cy="-22" rx="5" ry="15" fill="#DEB887"/>
        <ellipse cx="18" cy="-22" rx="3" ry="12" fill="#F5DEB3" opacity="0.8"/>
      </g>
      
      <!-- Líneas de la palma -->
      <g class="palm-lines">
        <!-- Línea de la vida -->
        <path d="M-15,0 Q-5,15 5,25" stroke="#CD853F" stroke-width="2" fill="none" opacity="0.7"/>
        
        <!-- Línea del corazón -->
        <path d="M-18,-5 Q0,-8 15,-5" stroke="#CD853F" stroke-width="1.5" fill="none" opacity="0.6"/>
        
        <!-- Línea de la cabeza -->
        <path d="M-15,-2 Q0,5 18,8" stroke="#CD853F" stroke-width="1.5" fill="none" opacity="0.6"/>
        
        <!-- Líneas menores -->
        <line x1="-8" y1="15" x2="-5" y2="20" stroke="#CD853F" stroke-width="1" opacity="0.5"/>
        <line x1="8" y1="12" x2="12" y2="18" stroke="#CD853F" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="20" x2="3" y2="25" stroke="#CD853F" stroke-width="1" opacity="0.5"/>
      </g>
      
      <!-- Uñas -->
      <g class="fingernails">
        <ellipse cx="-10" cy="-35" rx="3" ry="2" fill="#FFB6C1" opacity="0.8"/>
        <ellipse cx="0" cy="-40" rx="3" ry="2" fill="#FFB6C1" opacity="0.8"/>
        <ellipse cx="10" cy="-38" rx="3" ry="2" fill="#FFB6C1" opacity="0.8"/>
        <ellipse cx="18" cy="-32" rx="2.5" ry="1.5" fill="#FFB6C1" opacity="0.8"/>
        <ellipse cx="-25" cy="-8" rx="2.5" ry="1.5" fill="#FFB6C1" opacity="0.8" transform="rotate(-30 -25 -8)"/>
      </g>
      
      <!-- Símbolos místicos en la palma -->
      <g class="mystical-symbols" :class="{ 'animated': animated }">
        <!-- Ojo en la palma -->
        <ellipse cx="0" cy="5" rx="6" ry="4" fill="var(--accent-gold)" opacity="0.8"/>
        <circle cx="0" cy="5" r="3" fill="var(--background-dark)"/>
        <circle cx="0" cy="5" r="1.5" fill="var(--accent-gold)"/>
        <circle cx="-0.5" cy="4" r="0.5" fill="white" opacity="0.9"/>
        
        <!-- Estrella pequeña -->
        <g transform="translate(8, -5)">
          <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" 
                   fill="var(--secondary-purple)" opacity="0.7"/>
        </g>
        
        <!-- Luna creciente -->
        <g transform="translate(-8, -8)">
          <path d="M0,0 Q-3,-2 -3,0 Q-3,2 0,0" fill="var(--accent-gold)" opacity="0.6"/>
        </g>
      </g>
      
      <!-- Rayos de energía -->
      <g class="energy-rays" :class="{ 'animated': animated }">
        <line x1="0" y1="-50" x2="0" y2="-65" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="-35" y1="-35" x2="-45" y2="-45" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="35" y1="-35" x2="45" y2="-45" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="-40" y1="10" x2="-55" y2="10" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="40" y1="10" x2="55" y2="10" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
      </g>
      
      <!-- Flores de cempasúchil alrededor -->
      <g class="surrounding-flowers" :class="{ 'animated': animated }">
        <g transform="translate(-60, -20)">
          <circle cx="0" cy="0" r="5" fill="var(--accent-gold)" opacity="0.8"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)"/>
        </g>
        
        <g transform="translate(60, 15)">
          <circle cx="0" cy="0" r="4" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="-1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="-1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
        </g>
      </g>
      
      <!-- Aura mística -->
      <circle
        cx="0" cy="0"
        r="85"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.3"
        class="mystical-aura"
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
.hand-palm.animated {
  animation: hand-glow 3s ease-in-out infinite;
}

.mystical-symbols.animated {
  animation: symbol-pulse 2s ease-in-out infinite;
}

.energy-rays.animated {
  animation: energy-flow 4s ease-in-out infinite;
}

.surrounding-flowers.animated {
  animation: flower-rotate 5s ease-in-out infinite;
}

.mystical-aura.animated {
  animation: aura-expand 6s ease-in-out infinite;
}

@keyframes hand-glow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

@keyframes symbol-pulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes energy-flow {
  0%, 100% {
    stroke-opacity: 0.7;
    stroke-width: 2;
  }
  50% {
    stroke-opacity: 1;
    stroke-width: 3;
  }
}

@keyframes flower-rotate {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes aura-expand {
  0%, 100% {
    stroke-opacity: 0.3;
    r: 85;
  }
  50% {
    stroke-opacity: 0.5;
    r: 90;
  }
}
</style>