<template>
  <g class="la-campana-svg">
    <g transform="translate(100, 140)">
      <!-- Campana principal -->
      <g class="bell-main" :class="{ 'animated': animated }">
        <path
          d="M0,-30 Q-25,-20 -30,10 Q-25,20 -20,25 L20,25 Q25,20 30,10 Q25,-20 0,-30 Z"
          fill="var(--accent-gold)"
          stroke="var(--bright-yellow)"
          stroke-width="2"
        />
        
        <!-- Brillo en la campana -->
        <path
          d="M-5,-25 Q-15,-18 -18,5 Q-15,12 -12,15 L-8,15 Q-12,12 -15,5 Q-12,-18 -5,-25 Z"
          fill="white"
          opacity="0.4"
        />
      </g>
      
      <!-- Corona de la campana -->
      <rect x="-8" y="-35" width="16" height="8" fill="var(--accent-gold)" rx="4"/>
      <circle cx="0" cy="-31" r="3" fill="var(--bright-yellow)"/>
      
      <!-- Badajo -->
      <g class="clapper" :class="{ 'animated': animated }">
        <line x1="0" y1="-25" x2="0" y2="15" stroke="#8B4513" stroke-width="2"/>
        <ellipse cx="0" cy="18" rx="4" ry="6" fill="#654321"/>
      </g>
      
      <!-- Ondas de sonido -->
      <g class="sound-waves" :class="{ 'animated': animated }">
        <path d="M-50,-10 Q-40,-15 -50,-20" stroke="var(--accent-gold)" stroke-width="2" fill="none" opacity="0.7"/>
        <path d="M-60,-5 Q-45,-12 -60,-25" stroke="var(--accent-gold)" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M-70,0 Q-50,-10 -70,-30" stroke="var(--accent-gold)" stroke-width="2" fill="none" opacity="0.5"/>
        
        <path d="M50,-10 Q40,-15 50,-20" stroke="var(--accent-gold)" stroke-width="2" fill="none" opacity="0.7"/>
        <path d="M60,-5 Q45,-12 60,-25" stroke="var(--accent-gold)" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M70,0 Q50,-10 70,-30" stroke="var(--accent-gold)" stroke-width="2" fill="none" opacity="0.5"/>
      </g>
      
      <!-- Decoraciones -->
      <g class="decorations">
        <circle cx="-15" cy="0" r="3" fill="var(--primary-orange)" opacity="0.8"/>
        <circle cx="15" cy="0" r="3" fill="var(--primary-orange)" opacity="0.8"/>
        <circle cx="0" cy="10" r="2" fill="var(--secondary-purple)" opacity="0.7"/>
      </g>
      
      <!-- Aura sonora -->
      <circle
        cx="0" cy="0"
        r="85"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.3"
        class="sound-aura"
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
.bell-main.animated {
  animation: bell-swing 2s ease-in-out infinite;
}

.clapper.animated {
  animation: clapper-swing 2s ease-in-out infinite;
}

.sound-waves.animated {
  animation: wave-propagation 3s ease-in-out infinite;
}

.sound-aura.animated {
  animation: sound-pulse 4s ease-in-out infinite;
}

@keyframes bell-swing {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(3deg);
  }
  75% {
    transform: rotate(-3deg);
  }
}

@keyframes clapper-swing {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

@keyframes wave-propagation {
  0%, 100% {
    opacity: 0.7;
    stroke-width: 2;
  }
  50% {
    opacity: 1;
    stroke-width: 3;
  }
}

@keyframes sound-pulse {
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