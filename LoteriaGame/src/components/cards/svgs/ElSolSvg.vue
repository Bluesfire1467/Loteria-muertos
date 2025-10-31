<template>
  <g class="el-sol-svg">
    <!-- El Sol radiante -->
    <g transform="translate(100, 140)">
      <!-- Rayos largos del sol -->
      <g class="sun-rays-long" :class="{ 'animated': animated }">
        <line x1="0" y1="-70" x2="0" y2="-90" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="49" y1="-49" x2="64" y2="-64" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="70" y1="0" x2="90" y2="0" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="49" y1="49" x2="64" y2="64" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="0" y1="70" x2="0" y2="90" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="-49" y1="49" x2="-64" y2="64" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="-70" y1="0" x2="-90" y2="0" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
        <line x1="-49" y1="-49" x2="-64" y2="-64" stroke="var(--accent-gold)" stroke-width="4" stroke-linecap="round"/>
      </g>
      
      <!-- Rayos cortos del sol -->
      <g class="sun-rays-short" :class="{ 'animated': animated }">
        <line x1="25" y1="-66" x2="30" y2="-80" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
        <line x1="66" y1="-25" x2="80" y2="-30" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
        <line x1="66" y1="25" x2="80" y2="30" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
        <line x1="25" y1="66" x2="30" y2="80" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
        <line x1="-25" y1="66" x2="-30" y2="80" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
        <line x1="-66" y1="25" x2="-80" y2="30" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
        <line x1="-66" y1="-25" x2="-80" y2="-30" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
        <line x1="-25" y1="-66" x2="-30" y2="-80" stroke="var(--primary-orange)" stroke-width="3" stroke-linecap="round"/>
      </g>
      
      <!-- Círculo exterior del sol -->
      <circle
        cx="0" cy="0"
        r="50"
        fill="var(--accent-gold)"
        stroke="var(--primary-orange)"
        stroke-width="3"
        class="sun-outer"
        :class="{ 'animated': animated }"
      />
      
      <!-- Círculo interior del sol -->
      <circle
        cx="0" cy="0"
        r="35"
        fill="var(--bright-yellow)"
        opacity="0.9"
        class="sun-inner"
        :class="{ 'animated': animated }"
      />
      
      <!-- Cara del sol -->
      <g class="sun-face">
        <!-- Ojos -->
        <circle cx="-12" cy="-8" r="4" fill="var(--background-dark)"/>
        <circle cx="12" cy="-8" r="4" fill="var(--background-dark)"/>
        
        <!-- Brillo en los ojos -->
        <circle cx="-10" cy="-10" r="1.5" fill="var(--accent-gold)"/>
        <circle cx="14" cy="-10" r="1.5" fill="var(--accent-gold)"/>
        
        <!-- Nariz -->
        <ellipse cx="0" cy="2" rx="3" ry="5" fill="var(--primary-orange)" opacity="0.8"/>
        
        <!-- Sonrisa -->
        <path
          d="M-15,12 Q0,25 15,12"
          stroke="var(--background-dark)"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
        />
        
        <!-- Mejillas sonrosadas -->
        <circle cx="-25" cy="5" r="6" fill="var(--primary-orange)" opacity="0.6"/>
        <circle cx="25" cy="5" r="6" fill="var(--primary-orange)" opacity="0.6"/>
      </g>
      
      <!-- Decoraciones aztecas en el sol -->
      <g class="aztec-patterns" :class="{ 'animated': animated }">
        <!-- Patrón circular -->
        <circle cx="0" cy="0" r="25" fill="none" stroke="var(--primary-orange)" stroke-width="1" opacity="0.5"/>
        <circle cx="0" cy="0" r="15" fill="none" stroke="var(--primary-orange)" stroke-width="1" opacity="0.5"/>
        
        <!-- Puntos decorativos -->
        <circle cx="0" cy="-20" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        <circle cx="14" cy="-14" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        <circle cx="20" cy="0" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        <circle cx="14" cy="14" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        <circle cx="0" cy="20" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        <circle cx="-14" cy="14" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        <circle cx="-20" cy="0" r="2" fill="var(--primary-orange)" opacity="0.7"/>
        <circle cx="-14" cy="-14" r="2" fill="var(--primary-orange)" opacity="0.7"/>
      </g>
      
      <!-- Partículas de luz -->
      <g class="light-particles" :class="{ 'animated': animated }">
        <circle cx="-80" cy="-30" r="2" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="85" cy="20" r="1.5" fill="var(--bright-yellow)" opacity="0.7"/>
        <circle cx="-60" cy="70" r="1" fill="var(--primary-orange)" opacity="0.5"/>
        <circle cx="75" cy="-60" r="2.5" fill="var(--accent-gold)" opacity="0.4"/>
        <circle cx="-40" cy="-80" r="1.5" fill="var(--bright-yellow)" opacity="0.6"/>
        <circle cx="45" cy="85" r="1" fill="var(--primary-orange)" opacity="0.5"/>
        <circle cx="-90" cy="10" r="1.5" fill="var(--accent-gold)" opacity="0.4"/>
        <circle cx="30" cy="-85" r="2" fill="var(--bright-yellow)" opacity="0.5"/>
      </g>
      
      <!-- Aura solar -->
      <circle
        cx="0" cy="0"
        r="80"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.2"
        class="solar-aura"
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
.sun-rays-long.animated {
  animation: ray-rotation 8s linear infinite;
}

.sun-rays-short.animated {
  animation: ray-rotation 6s linear infinite reverse;
}

.sun-outer.animated {
  animation: sun-pulse 3s ease-in-out infinite;
}

.sun-inner.animated {
  animation: inner-glow 2s ease-in-out infinite;
}

.aztec-patterns.animated {
  animation: pattern-rotate 10s linear infinite;
}

.light-particles.animated {
  animation: particle-dance 4s ease-in-out infinite;
}

.solar-aura.animated {
  animation: aura-expand 5s ease-in-out infinite;
}

@keyframes ray-rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sun-pulse {
  0%, 100% {
    r: 50;
    fill-opacity: 1;
  }
  50% {
    r: 52;
    fill-opacity: 0.9;
  }
}

@keyframes inner-glow {
  0%, 100% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
}

@keyframes pattern-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes particle-dance {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  33% {
    transform: translateY(-3px) scale(1.1);
  }
  66% {
    transform: translateY(2px) scale(0.9);
  }
}

@keyframes aura-expand {
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