<template>
  <g class="la-rosa-svg">
    <!-- La Rosa del Día de Muertos -->
    <g transform="translate(100, 140)">
      <!-- Tallo principal -->
      <line
        x1="0" y1="40"
        x2="0" y2="80"
        stroke="var(--success-green)"
        stroke-width="6"
        stroke-linecap="round"
        class="stem"
      />
      
      <!-- Hojas del tallo -->
      <g class="leaves" :class="{ 'animated': animated }">
        <ellipse
          cx="-15" cy="55"
          rx="8" ry="15"
          fill="var(--success-green)"
          opacity="0.8"
          transform="rotate(-30 -15 55)"
        />
        <ellipse
          cx="15" cy="65"
          rx="6" ry="12"
          fill="var(--success-green)"
          opacity="0.8"
          transform="rotate(30 15 65)"
        />
      </g>
      
      <!-- Espinas -->
      <g class="thorns">
        <polygon points="-3,50 -6,48 -3,46" fill="var(--success-green)" opacity="0.9"/>
        <polygon points="3,60 6,58 3,56" fill="var(--success-green)" opacity="0.9"/>
        <polygon points="-2,70 -5,68 -2,66" fill="var(--success-green)" opacity="0.9"/>
      </g>
      
      <!-- Rosa principal -->
      <g class="rose-main" :class="{ 'animated': animated }">
        <!-- Pétalos exteriores -->
        <g class="outer-petals">
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(0)"/>
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(45)"/>
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(90)"/>
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(135)"/>
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(180)"/>
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(225)"/>
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(270)"/>
          <ellipse cx="0" cy="-20" rx="8" ry="20" fill="var(--error-red)" opacity="0.9" transform="rotate(315)"/>
        </g>
        
        <!-- Pétalos medios -->
        <g class="middle-petals">
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(22.5)"/>
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(67.5)"/>
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(112.5)"/>
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(157.5)"/>
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(202.5)"/>
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(247.5)"/>
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(292.5)"/>
          <ellipse cx="0" cy="-15" rx="6" ry="15" fill="#FF1493" opacity="0.95" transform="rotate(337.5)"/>
        </g>
        
        <!-- Pétalos interiores -->
        <g class="inner-petals">
          <ellipse cx="0" cy="-10" rx="4" ry="10" fill="#FF69B4" transform="rotate(0)"/>
          <ellipse cx="0" cy="-10" rx="4" ry="10" fill="#FF69B4" transform="rotate(60)"/>
          <ellipse cx="0" cy="-10" rx="4" ry="10" fill="#FF69B4" transform="rotate(120)"/>
          <ellipse cx="0" cy="-10" rx="4" ry="10" fill="#FF69B4" transform="rotate(180)"/>
          <ellipse cx="0" cy="-10" rx="4" ry="10" fill="#FF69B4" transform="rotate(240)"/>
          <ellipse cx="0" cy="-10" rx="4" ry="10" fill="#FF69B4" transform="rotate(300)"/>
        </g>
        
        <!-- Centro de la rosa -->
        <circle cx="0" cy="0" r="6" fill="#8B0000" opacity="0.9"/>
        <circle cx="0" cy="0" r="3" fill="#FF1493" opacity="0.8"/>
      </g>
      
      <!-- Gotas de rocío -->
      <g class="dew-drops" :class="{ 'animated': animated }">
        <ellipse cx="-20" cy="-10" rx="2" ry="3" fill="white" opacity="0.7"/>
        <ellipse cx="25" cy="5" rx="1.5" ry="2" fill="white" opacity="0.6"/>
        <ellipse cx="-10" cy="20" rx="1" ry="1.5" fill="white" opacity="0.5"/>
      </g>
      
      <!-- Mariposas del Día de Muertos -->
      <g class="butterflies" :class="{ 'animated': animated }">
        <!-- Mariposa izquierda -->
        <g transform="translate(-50, -30)">
          <!-- Alas superiores -->
          <ellipse cx="-3" cy="-2" rx="8" ry="5" fill="var(--primary-orange)" opacity="0.8"/>
          <ellipse cx="3" cy="-2" rx="8" ry="5" fill="var(--primary-orange)" opacity="0.8"/>
          <!-- Alas inferiores -->
          <ellipse cx="-3" cy="3" rx="5" ry="3" fill="var(--accent-gold)" opacity="0.8"/>
          <ellipse cx="3" cy="3" rx="5" ry="3" fill="var(--accent-gold)" opacity="0.8"/>
          <!-- Cuerpo -->
          <ellipse cx="0" cy="0" rx="1" ry="6" fill="var(--background-dark)"/>
          <!-- Antenas -->
          <line x1="-1" y1="-4" x2="-2" y2="-6" stroke="var(--background-dark)" stroke-width="0.5"/>
          <line x1="1" y1="-4" x2="2" y2="-6" stroke="var(--background-dark)" stroke-width="0.5"/>
          <circle cx="-2" cy="-6" r="0.5" fill="var(--background-dark)"/>
          <circle cx="2" cy="-6" r="0.5" fill="var(--background-dark)"/>
        </g>
        
        <!-- Mariposa derecha -->
        <g transform="translate(50, -20)">
          <!-- Alas superiores -->
          <ellipse cx="-3" cy="-2" rx="6" ry="4" fill="var(--secondary-purple)" opacity="0.8"/>
          <ellipse cx="3" cy="-2" rx="6" ry="4" fill="var(--secondary-purple)" opacity="0.8"/>
          <!-- Alas inferiores -->
          <ellipse cx="-3" cy="2" rx="4" ry="2.5" fill="var(--accent-gold)" opacity="0.8"/>
          <ellipse cx="3" cy="2" rx="4" ry="2.5" fill="var(--accent-gold)" opacity="0.8"/>
          <!-- Cuerpo -->
          <ellipse cx="0" cy="0" rx="0.8" ry="5" fill="var(--background-dark)"/>
          <!-- Antenas -->
          <line x1="-0.8" y1="-3" x2="-1.5" y2="-5" stroke="var(--background-dark)" stroke-width="0.5"/>
          <line x1="0.8" y1="-3" x2="1.5" y2="-5" stroke="var(--background-dark)" stroke-width="0.5"/>
          <circle cx="-1.5" cy="-5" r="0.4" fill="var(--background-dark)"/>
          <circle cx="1.5" cy="-5" r="0.4" fill="var(--background-dark)"/>
        </g>
      </g>
      
      <!-- Pétalos cayendo -->
      <g class="falling-petals" :class="{ 'animated': animated }">
        <ellipse cx="-60" cy="20" rx="3" ry="6" fill="var(--error-red)" opacity="0.6" transform="rotate(45 -60 20)"/>
        <ellipse cx="70" cy="40" rx="2" ry="4" fill="#FF1493" opacity="0.5" transform="rotate(-30 70 40)"/>
        <ellipse cx="-40" cy="70" rx="2.5" ry="5" fill="#FF69B4" opacity="0.4" transform="rotate(60 -40 70)"/>
        <ellipse cx="55" cy="-40" rx="2" ry="4" fill="var(--error-red)" opacity="0.5" transform="rotate(-45 55 -40)"/>
      </g>
      
      <!-- Aura romántica -->
      <circle
        cx="0" cy="0"
        r="85"
        fill="none"
        stroke="var(--error-red)"
        stroke-width="1"
        opacity="0.2"
        class="romantic-aura"
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
.rose-main.animated {
  animation: rose-bloom 4s ease-in-out infinite;
}

.leaves.animated {
  animation: leaf-rustle 3s ease-in-out infinite;
}

.dew-drops.animated {
  animation: dew-sparkle 2s ease-in-out infinite;
}

.butterflies.animated {
  animation: butterfly-dance 5s ease-in-out infinite;
}

.falling-petals.animated {
  animation: petal-fall 8s ease-in-out infinite;
}

.romantic-aura.animated {
  animation: aura-pulse 6s ease-in-out infinite;
}

@keyframes rose-bloom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes leaf-rustle {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

@keyframes dew-sparkle {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes butterfly-dance {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(2deg);
  }
  50% {
    transform: translateY(-3px) rotate(0deg);
  }
  75% {
    transform: translateY(-7px) rotate(-2deg);
  }
}

@keyframes petal-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(5px) rotate(180deg);
    opacity: 0.3;
  }
  100% {
    transform: translateY(15px) rotate(360deg);
    opacity: 0.1;
  }
}

@keyframes aura-pulse {
  0%, 100% {
    stroke-opacity: 0.2;
    r: 85;
  }
  50% {
    stroke-opacity: 0.4;
    r: 90;
  }
}
</style>