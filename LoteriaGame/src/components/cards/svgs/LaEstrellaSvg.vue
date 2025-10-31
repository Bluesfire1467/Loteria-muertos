<template>
  <g class="la-estrella-svg">
    <g transform="translate(100, 140)">
      <!-- Estrella principal -->
      <g class="main-star" :class="{ 'animated': animated }">
        <polygon
          points="0,-40 12,-12 40,-12 20,8 32,36 0,20 -32,36 -20,8 -40,-12 -12,-12"
          fill="var(--accent-gold)"
          stroke="var(--bright-yellow)"
          stroke-width="2"
        />
        
        <!-- Brillo interior -->
        <polygon
          points="0,-25 8,-8 25,-8 12,5 20,22 0,12 -20,22 -12,5 -25,-8 -8,-8"
          fill="var(--bright-yellow)"
          opacity="0.8"
        />
        
        <!-- Centro brillante -->
        <circle cx="0" cy="0" r="8" fill="white" opacity="0.9"/>
        <circle cx="0" cy="0" r="4" fill="var(--accent-gold)"/>
      </g>
      
      <!-- Rayos de luz -->
      <g class="light-rays" :class="{ 'animated': animated }">
        <line x1="0" y1="-60" x2="0" y2="-80" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
        <line x1="42" y1="-42" x2="57" y2="-57" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
        <line x1="60" y1="0" x2="80" y2="0" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
        <line x1="42" y1="42" x2="57" y2="57" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
        <line x1="0" y1="60" x2="0" y2="80" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
        <line x1="-42" y1="42" x2="-57" y2="57" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
        <line x1="-60" y1="0" x2="-80" y2="0" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
        <line x1="-42" y1="-42" x2="-57" y2="-57" stroke="var(--bright-yellow)" stroke-width="3" opacity="0.8"/>
      </g>
      
      <!-- Estrellas pequeñas alrededor -->
      <g class="small-stars" :class="{ 'animated': animated }">
        <g transform="translate(-70, -30)">
          <polygon points="0,-6 2,-2 6,-2 3,1 4,5 0,3 -4,5 -3,1 -6,-2 -2,-2" fill="var(--accent-gold)" opacity="0.7"/>
        </g>
        <g transform="translate(65, -45)">
          <polygon points="0,-4 1.5,-1.5 4,-1.5 2,1 3,4 0,2 -3,4 -2,1 -4,-1.5 -1.5,-1.5" fill="var(--bright-yellow)" opacity="0.6"/>
        </g>
        <g transform="translate(-50, 70)">
          <polygon points="0,-5 2,-2 5,-2 3,1 4,5 0,3 -4,5 -3,1 -5,-2 -2,-2" fill="var(--accent-gold)" opacity="0.8"/>
        </g>
        <g transform="translate(75, 50)">
          <polygon points="0,-3 1,-1 3,-1 2,1 2,3 0,2 -2,3 -2,1 -3,-1 -1,-1" fill="var(--bright-yellow)" opacity="0.5"/>
        </g>
      </g>
      
      <!-- Aura estelar -->
      <circle
        cx="0" cy="0"
        r="85"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.3"
        class="stellar-aura"
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
.main-star.animated {
  animation: star-shine 3s ease-in-out infinite;
}

.light-rays.animated {
  animation: ray-pulse 2s ease-in-out infinite;
}

.small-stars.animated {
  animation: twinkle 4s ease-in-out infinite;
}

.stellar-aura.animated {
  animation: aura-glow 5s ease-in-out infinite;
}

@keyframes star-shine {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.3);
  }
}

@keyframes ray-pulse {
  0%, 100% {
    stroke-opacity: 0.8;
    stroke-width: 3;
  }
  50% {
    stroke-opacity: 1;
    stroke-width: 4;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.7;
  }
  25% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.5;
  }
}

@keyframes aura-glow {
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