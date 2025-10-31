<template>
  <g class="la-calavera-svg">
    <!-- Calavera decorativa del Día de Muertos -->
    <g transform="translate(100, 140)">
      <!-- Cráneo principal -->
      <ellipse
        cx="0" cy="0"
        rx="45" ry="40"
        fill="#F5F5DC"
        stroke="var(--accent-gold)"
        stroke-width="3"
        class="skull-main"
        :class="{ 'animated': animated }"
      />
      
      <!-- Decoraciones florales en el cráneo -->
      <g class="skull-decorations">
        <!-- Flores en la frente -->
        <g transform="translate(0, -25)">
          <circle cx="0" cy="0" r="6" fill="var(--error-red)" opacity="0.9"/>
          <circle cx="-3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="-3" cy="3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="3" r="2" fill="var(--primary-orange)"/>
          <circle cx="0" cy="0" r="1.5" fill="var(--accent-gold)"/>
        </g>
        
        <!-- Patrones decorativos en las mejillas -->
        <g transform="translate(-25, -5)">
          <circle cx="0" cy="0" r="3" fill="var(--secondary-purple)" opacity="0.8"/>
          <circle cx="-5" cy="5" r="2" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="5" cy="5" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        </g>
        
        <g transform="translate(25, -5)">
          <circle cx="0" cy="0" r="3" fill="var(--secondary-purple)" opacity="0.8"/>
          <circle cx="-5" cy="5" r="2" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="5" cy="5" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        </g>
      </g>
      
      <!-- Cuencas de los ojos -->
      <ellipse cx="-15" cy="-8" rx="8" ry="12" fill="var(--background-dark)"/>
      <ellipse cx="15" cy="-8" rx="8" ry="12" fill="var(--background-dark)"/>
      
      <!-- Flores en los ojos -->
      <g transform="translate(-15, -8)" class="eye-flowers" :class="{ 'animated': animated }">
        <circle cx="0" cy="0" r="4" fill="var(--error-red)" opacity="0.9"/>
        <circle cx="-2" cy="-2" r="1" fill="var(--accent-gold)"/>
        <circle cx="2" cy="-2" r="1" fill="var(--accent-gold)"/>
        <circle cx="-2" cy="2" r="1" fill="var(--accent-gold)"/>
        <circle cx="2" cy="2" r="1" fill="var(--accent-gold)"/>
      </g>
      
      <g transform="translate(15, -8)" class="eye-flowers" :class="{ 'animated': animated }">
        <circle cx="0" cy="0" r="4" fill="var(--error-red)" opacity="0.9"/>
        <circle cx="-2" cy="-2" r="1" fill="var(--accent-gold)"/>
        <circle cx="2" cy="-2" r="1" fill="var(--accent-gold)"/>
        <circle cx="-2" cy="2" r="1" fill="var(--accent-gold)"/>
        <circle cx="2" cy="2" r="1" fill="var(--accent-gold)"/>
      </g>
      
      <!-- Nariz decorativa -->
      <path 
        d="M0,5 L-4,15 L0,20 L4,15 Z" 
        fill="var(--background-dark)"
        stroke="var(--accent-gold)"
        stroke-width="1"
      />
      
      <!-- Sonrisa amplia -->
      <path
        d="M-20,25 Q0,35 20,25"
        stroke="var(--background-dark)"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
      />
      
      <!-- Dientes decorativos -->
      <rect x="-15" y="25" width="3" height="8" fill="#F5F5DC" stroke="var(--accent-gold)" stroke-width="0.5"/>
      <rect x="-9" y="25" width="3" height="10" fill="#F5F5DC" stroke="var(--accent-gold)" stroke-width="0.5"/>
      <rect x="-3" y="25" width="3" height="10" fill="#F5F5DC" stroke="var(--accent-gold)" stroke-width="0.5"/>
      <rect x="3" y="25" width="3" height="10" fill="#F5F5DC" stroke="var(--accent-gold)" stroke-width="0.5"/>
      <rect x="9" y="25" width="3" height="10" fill="#F5F5DC" stroke="var(--accent-gold)" stroke-width="0.5"/>
      <rect x="15" y="25" width="3" height="8" fill="#F5F5DC" stroke="var(--accent-gold)" stroke-width="0.5"/>
      
      <!-- Corona de flores -->
      <g class="flower-crown" :class="{ 'animated': animated }">
        <!-- Flores grandes -->
        <g transform="translate(-30, -35)">
          <circle cx="0" cy="0" r="8" fill="var(--accent-gold)" opacity="0.9"/>
          <circle cx="-4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="-4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="0" cy="0" r="2" fill="var(--warm-orange)"/>
        </g>
        
        <g transform="translate(30, -35)">
          <circle cx="0" cy="0" r="8" fill="var(--accent-gold)" opacity="0.9"/>
          <circle cx="-4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="-4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="0" cy="0" r="2" fill="var(--warm-orange)"/>
        </g>
        
        <!-- Flores medianas -->
        <g transform="translate(-15, -40)">
          <circle cx="0" cy="0" r="5" fill="var(--error-red)" opacity="0.8"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--accent-gold)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--accent-gold)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--accent-gold)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--accent-gold)"/>
        </g>
        
        <g transform="translate(15, -40)">
          <circle cx="0" cy="0" r="5" fill="var(--error-red)" opacity="0.8"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--accent-gold)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--accent-gold)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--accent-gold)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--accent-gold)"/>
        </g>
        
        <!-- Hojas -->
        <ellipse cx="-40" cy="-25" rx="4" ry="8" fill="var(--success-green)" opacity="0.7" transform="rotate(-45 -40 -25)"/>
        <ellipse cx="40" cy="-25" rx="4" ry="8" fill="var(--success-green)" opacity="0.7" transform="rotate(45 40 -25)"/>
        <ellipse cx="-20" cy="-45" rx="3" ry="6" fill="var(--success-green)" opacity="0.7" transform="rotate(-20 -20 -45)"/>
        <ellipse cx="20" cy="-45" rx="3" ry="6" fill="var(--success-green)" opacity="0.7" transform="rotate(20 20 -45)"/>
      </g>
      
      <!-- Velas a los lados -->
      <g class="candles" :class="{ 'animated': animated }">
        <!-- Vela izquierda -->
        <g transform="translate(-60, 20)">
          <rect x="-3" y="0" width="6" height="25" fill="var(--warm-orange)" rx="3"/>
          <ellipse cx="0" cy="0" rx="3" ry="2" fill="var(--accent-gold)"/>
          <!-- Llama -->
          <ellipse cx="0" cy="-5" rx="2" ry="4" fill="var(--primary-orange)" opacity="0.9"/>
          <ellipse cx="0" cy="-6" rx="1" ry="2" fill="var(--accent-gold)"/>
        </g>
        
        <!-- Vela derecha -->
        <g transform="translate(60, 20)">
          <rect x="-3" y="0" width="6" height="25" fill="var(--warm-orange)" rx="3"/>
          <ellipse cx="0" cy="0" rx="3" ry="2" fill="var(--accent-gold)"/>
          <!-- Llama -->
          <ellipse cx="0" cy="-5" rx="2" ry="4" fill="var(--primary-orange)" opacity="0.9"/>
          <ellipse cx="0" cy="-6" rx="1" ry="2" fill="var(--accent-gold)"/>
        </g>
      </g>
      
      <!-- Aura festiva -->
      <circle
        cx="0" cy="0"
        r="70"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.3"
        class="festive-aura"
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
.skull-main.animated {
  animation: gentle-bob 3s ease-in-out infinite;
}

.eye-flowers.animated {
  animation: flower-twinkle 2s ease-in-out infinite;
}

.flower-crown.animated {
  animation: crown-sway 4s ease-in-out infinite;
}

.candles.animated {
  animation: candle-flicker 1.5s ease-in-out infinite;
}

.festive-aura.animated {
  animation: aura-pulse 5s ease-in-out infinite;
}

@keyframes gentle-bob {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes flower-twinkle {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes crown-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(1deg);
  }
}

@keyframes candle-flicker {
  0%, 100% {
    opacity: 0.9;
  }
  25% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  75% {
    opacity: 1;
  }
}

@keyframes aura-pulse {
  0%, 100% {
    stroke-opacity: 0.3;
    r: 70;
  }
  50% {
    stroke-opacity: 0.5;
    r: 75;
  }
}
</style>