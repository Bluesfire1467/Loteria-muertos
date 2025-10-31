<template>
  <g class="el-nopal-svg">
    <g transform="translate(100, 140)">
      <!-- Penca principal del nopal -->
      <g class="main-pad" :class="{ 'animated': animated }">
        <ellipse cx="0" cy="0" rx="20" ry="30" fill="var(--success-green)" opacity="0.9"/>
        <ellipse cx="0" cy="0" rx="15" ry="25" fill="#32CD32" opacity="0.8"/>
      </g>
      
      <!-- Pencas laterales -->
      <g class="side-pads">
        <ellipse cx="-25" cy="-10" rx="15" ry="20" fill="var(--success-green)" opacity="0.8" transform="rotate(-30 -25 -10)"/>
        <ellipse cx="25" cy="-5" rx="12" ry="18" fill="var(--success-green)" opacity="0.8" transform="rotate(30 25 -5)"/>
        <ellipse cx="-15" cy="25" rx="10" ry="15" fill="var(--success-green)" opacity="0.7" transform="rotate(-45 -15 25)"/>
        <ellipse cx="20" cy="20" rx="8" ry="12" fill="var(--success-green)" opacity="0.7" transform="rotate(45 20 20)"/>
      </g>
      
      <!-- Espinas -->
      <g class="thorns">
        <!-- Espinas en penca principal -->
        <line x1="-12" y1="-20" x2="-15" y2="-25" stroke="#8B4513" stroke-width="2"/>
        <line x1="12" y1="-15" x2="15" y2="-20" stroke="#8B4513" stroke-width="2"/>
        <line x1="-8" y1="0" x2="-12" y2="-3" stroke="#8B4513" stroke-width="2"/>
        <line x1="8" y1="5" x2="12" y2="2" stroke="#8B4513" stroke-width="2"/>
        <line x1="0" y1="25" x2="0" y2="30" stroke="#8B4513" stroke-width="2"/>
        <line x1="-5" y1="15" x2="-8" y2="18" stroke="#8B4513" stroke-width="2"/>
        <line x1="5" y1="18" x2="8" y2="21" stroke="#8B4513" stroke-width="2"/>
        
        <!-- Espinas en pencas laterales -->
        <line x1="-30" y1="-15" x2="-33" y2="-18" stroke="#8B4513" stroke-width="1.5"/>
        <line x1="30" y1="-8" x2="33" y2="-11" stroke="#8B4513" stroke-width="1.5"/>
        <line x1="-20" y1="30" x2="-23" y2="33" stroke="#8B4513" stroke-width="1.5"/>
        <line x1="25" y1="25" x2="28" y2="28" stroke="#8B4513" stroke-width="1.5"/>
      </g>
      
      <!-- Flores del nopal -->
      <g class="cactus-flowers" :class="{ 'animated': animated }">
        <g transform="translate(-10, -35)">
          <circle cx="0" cy="0" r="6" fill="var(--error-red)" opacity="0.9"/>
          <circle cx="-3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="-3" cy="3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="3" r="2" fill="var(--primary-orange)"/>
          <circle cx="0" cy="0" r="2" fill="var(--accent-gold)"/>
        </g>
        
        <g transform="translate(15, -30)">
          <circle cx="0" cy="0" r="5" fill="#FF69B4" opacity="0.8"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)"/>
        </g>
      </g>
      
      <!-- Frutos (tunas) -->
      <g class="prickly-pears" :class="{ 'animated': animated }">
        <ellipse cx="18" cy="-20" rx="4" ry="6" fill="#8B008B" opacity="0.8"/>
        <ellipse cx="-22" cy="5" rx="3" ry="5" fill="#8B008B" opacity="0.7"/>
        <ellipse cx="12" cy="15" rx="3.5" ry="5" fill="#FF1493" opacity="0.8"/>
      </g>
      
      <!-- Raíces -->
      <g class="roots">
        <path d="M-5,30 Q-15,40 -20,50" stroke="#654321" stroke-width="3" fill="none"/>
        <path d="M5,30 Q15,40 20,50" stroke="#654321" stroke-width="3" fill="none"/>
        <path d="M0,30 Q-8,45 -12,55" stroke="#654321" stroke-width="2" fill="none"/>
        <path d="M0,30 Q8,45 12,55" stroke="#654321" stroke-width="2" fill="none"/>
      </g>
      
      <!-- Mariposas del desierto -->
      <g class="desert-butterflies" :class="{ 'animated': animated }">
        <g transform="translate(-45, -20)">
          <ellipse cx="-2" cy="-1" rx="4" ry="2" fill="var(--primary-orange)" opacity="0.8"/>
          <ellipse cx="2" cy="-1" rx="4" ry="2" fill="var(--primary-orange)" opacity="0.8"/>
          <ellipse cx="-2" cy="1" rx="3" ry="1.5" fill="var(--accent-gold)" opacity="0.8"/>
          <ellipse cx="2" cy="1" rx="3" ry="1.5" fill="var(--accent-gold)" opacity="0.8"/>
          <line x1="0" y1="-2" x2="0" y2="2" stroke="var(--background-dark)" stroke-width="1"/>
        </g>
      </g>
      
      <!-- Aura del desierto -->
      <circle
        cx="0" cy="10"
        r="80"
        fill="none"
        stroke="var(--success-green)"
        stroke-width="1"
        opacity="0.2"
        class="desert-aura"
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
.main-pad.animated {
  animation: cactus-sway 4s ease-in-out infinite;
}

.cactus-flowers.animated {
  animation: flower-bloom 3s ease-in-out infinite;
}

.prickly-pears.animated {
  animation: fruit-ripen 5s ease-in-out infinite;
}

.desert-butterflies.animated {
  animation: butterfly-flutter 6s ease-in-out infinite;
}

.desert-aura.animated {
  animation: desert-pulse 7s ease-in-out infinite;
}

@keyframes cactus-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(1deg);
  }
}

@keyframes flower-bloom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes fruit-ripen {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

@keyframes butterfly-flutter {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-3px) rotate(2deg);
  }
  75% {
    transform: translateY(-1px) rotate(-2deg);
  }
}

@keyframes desert-pulse {
  0%, 100% {
    stroke-opacity: 0.2;
    r: 80;
  }
  50% {
    stroke-opacity: 0.4;
    r: 85;
  }
}
</style>