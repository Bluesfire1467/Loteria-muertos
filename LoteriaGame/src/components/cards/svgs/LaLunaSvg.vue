<template>
  <g class="la-luna-svg">
    <g transform="translate(100, 140)">
      <!-- Cielo nocturno de fondo -->
      <circle
        cx="0" cy="0"
        r="80"
        fill="var(--background-dark)"
        opacity="0.3"
        class="night-sky"
      />
      
      <!-- Luna principal (creciente) -->
      <g class="moon-main" :class="{ 'animated': animated }">
        <!-- Círculo completo de la luna -->
        <circle
          cx="0" cy="0"
          r="40"
          fill="var(--text-light)"
          opacity="0.9"
        />
        
        <!-- Sombra para crear efecto creciente -->
        <circle
          cx="15" cy="0"
          r="35"
          fill="var(--background-dark)"
          opacity="0.6"
        />
        
        <!-- Brillo lunar -->
        <ellipse
          cx="-10" cy="-10"
          rx="8" ry="12"
          fill="white"
          opacity="0.4"
        />
      </g>
      
      <!-- Cara de la luna -->
      <g class="moon-face" transform="translate(-8, 0)">
        <!-- Ojo visible -->
        <circle cx="-8" cy="-5" r="3" fill="var(--background-dark)"/>
        <circle cx="-7" cy="-6" r="1" fill="var(--accent-gold)" opacity="0.8"/>
        
        <!-- Nariz sutil -->
        <ellipse cx="-5" cy="2" rx="2" ry="3" fill="var(--text-secondary)" opacity="0.3"/>
        
        <!-- Sonrisa serena -->
        <path
          d="M-15,8 Q-5,15 5,8"
          stroke="var(--background-dark)"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          opacity="0.7"
        />
      </g>
      
      <!-- Estrellas alrededor -->
      <g class="stars" :class="{ 'animated': animated }">
        <!-- Estrellas grandes -->
        <g transform="translate(-60, -40)">
          <polygon
            points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
            fill="var(--accent-gold)"
            opacity="0.9"
          />
        </g>
        
        <g transform="translate(70, -20)">
          <polygon
            points="0,-6 1.5,-1.5 6,-1.5 2.5,1.5 4,6 0,3 -4,6 -2.5,1.5 -6,-1.5 -1.5,-1.5"
            fill="var(--accent-gold)"
            opacity="0.8"
          />
        </g>
        
        <g transform="translate(-50, 60)">
          <polygon
            points="0,-5 1,-1 5,-1 2,1 3,5 0,2.5 -3,5 -2,1 -5,-1 -1,-1"
            fill="var(--accent-gold)"
            opacity="0.7"
          />
        </g>
        
        <!-- Estrellas pequeñas -->
        <circle cx="-70" cy="10" r="2" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="60" cy="50" r="1.5" fill="var(--bright-yellow)" opacity="0.7"/>
        <circle cx="-40" cy="-70" r="1" fill="var(--accent-gold)" opacity="0.5"/>
        <circle cx="80" cy="-50" r="2.5" fill="var(--bright-yellow)" opacity="0.4"/>
        <circle cx="-80" cy="40" r="1.5" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="45" cy="70" r="1" fill="var(--bright-yellow)" opacity="0.5"/>
      </g>
      
      <!-- Nubes nocturnas -->
      <g class="night-clouds" :class="{ 'animated': animated }">
        <g transform="translate(-40, 50)" opacity="0.4">
          <ellipse cx="0" cy="0" rx="15" ry="8" fill="var(--text-secondary)"/>
          <ellipse cx="-10" cy="-3" rx="8" ry="5" fill="var(--text-secondary)"/>
          <ellipse cx="10" cy="-2" rx="10" ry="6" fill="var(--text-secondary)"/>
        </g>
        
        <g transform="translate(50, -60)" opacity="0.3">
          <ellipse cx="0" cy="0" rx="12" ry="6" fill="var(--text-secondary)"/>
          <ellipse cx="-8" cy="-2" rx="6" ry="4" fill="var(--text-secondary)"/>
          <ellipse cx="8" cy="-1" rx="8" ry="5" fill="var(--text-secondary)"/>
        </g>
      </g>
      
      <!-- Rayos de luna -->
      <g class="moon-rays" :class="{ 'animated': animated }">
        <line x1="-60" y1="-60" x2="-70" y2="-70" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="-70" x2="0" y2="-85" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
        <line x1="60" y1="-60" x2="70" y2="-70" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
        <line x1="70" y1="0" x2="85" y2="0" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
        <line x1="60" y1="60" x2="70" y2="70" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="70" x2="0" y2="85" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
        <line x1="-60" y1="60" x2="-70" y2="70" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
        <line x1="-70" y1="0" x2="-85" y2="0" stroke="var(--text-light)" stroke-width="1" opacity="0.5"/>
      </g>
      
      <!-- Cempasúchiles nocturnos -->
      <g class="night-marigolds" :class="{ 'animated': animated }">
        <g transform="translate(-75, 25)">
          <circle cx="0" cy="0" r="6" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="-3" cy="-3" r="2" fill="var(--primary-orange)" opacity="0.6"/>
          <circle cx="3" cy="-3" r="2" fill="var(--primary-orange)" opacity="0.6"/>
          <circle cx="-3" cy="3" r="2" fill="var(--primary-orange)" opacity="0.6"/>
          <circle cx="3" cy="3" r="2" fill="var(--primary-orange)" opacity="0.6"/>
        </g>
        
        <g transform="translate(75, -25)">
          <circle cx="0" cy="0" r="5" fill="var(--accent-gold)" opacity="0.6"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)" opacity="0.5"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)" opacity="0.5"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)" opacity="0.5"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)" opacity="0.5"/>
        </g>
      </g>
      
      <!-- Aura lunar -->
      <circle
        cx="0" cy="0"
        r="90"
        fill="none"
        stroke="var(--text-light)"
        stroke-width="1"
        opacity="0.2"
        class="lunar-aura"
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
.moon-main.animated {
  animation: moon-glow 4s ease-in-out infinite;
}

.stars.animated {
  animation: star-twinkle 3s ease-in-out infinite;
}

.night-clouds.animated {
  animation: cloud-drift 8s ease-in-out infinite;
}

.moon-rays.animated {
  animation: ray-shimmer 5s ease-in-out infinite;
}

.night-marigolds.animated {
  animation: gentle-sway 6s ease-in-out infinite;
}

.lunar-aura.animated {
  animation: aura-pulse 7s ease-in-out infinite;
}

@keyframes moon-glow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  25% {
    opacity: 0.6;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  75% {
    opacity: 0.7;
    transform: scale(0.9);
  }
}

@keyframes cloud-drift {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
}

@keyframes ray-shimmer {
  0%, 100% {
    stroke-opacity: 0.5;
  }
  50% {
    stroke-opacity: 0.8;
  }
}

@keyframes gentle-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

@keyframes aura-pulse {
  0%, 100% {
    stroke-opacity: 0.2;
    r: 90;
  }
  50% {
    stroke-opacity: 0.4;
    r: 95;
  }
}
</style>