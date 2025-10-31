<template>
  <g class="el-corazon-svg">
    <!-- Corazón principal -->
    <g transform="translate(100, 140)">
      <!-- Corazón base -->
      <path
        d="M0,20 C-20,0 -40,0 -40,25 C-40,50 0,80 0,80 C0,80 40,50 40,25 C40,0 20,0 0,20 Z"
        fill="var(--error-red)"
        stroke="var(--accent-gold)"
        stroke-width="3"
        class="heart-main"
        :class="{ 'animated': animated }"
      />
      
      <!-- Brillo en el corazón -->
      <path
        d="M-15,10 C-25,5 -30,5 -30,15 C-30,25 -15,35 -15,35 C-15,35 -10,30 -10,20 C-10,15 -12,10 -15,10 Z"
        fill="rgba(255, 255, 255, 0.4)"
        class="heart-shine"
      />
      
      <!-- Decoraciones florales alrededor -->
      <g class="floral-decoration" :class="{ 'animated': animated }">
        <!-- Flores de cempasúchil -->
        <g transform="translate(-60, -20)">
          <circle cx="0" cy="0" r="8" fill="var(--accent-gold)" opacity="0.9"/>
          <circle cx="-4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="-4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="0" cy="0" r="2" fill="var(--warm-orange)"/>
        </g>
        
        <g transform="translate(60, -20)">
          <circle cx="0" cy="0" r="8" fill="var(--accent-gold)" opacity="0.9"/>
          <circle cx="-4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="-4" r="3" fill="var(--primary-orange)"/>
          <circle cx="-4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="4" cy="4" r="3" fill="var(--primary-orange)"/>
          <circle cx="0" cy="0" r="2" fill="var(--warm-orange)"/>
        </g>
        
        <!-- Hojas -->
        <g transform="translate(-45, 10)">
          <ellipse cx="0" cy="0" rx="6" ry="12" fill="var(--success-green)" opacity="0.8" transform="rotate(-30)"/>
        </g>
        
        <g transform="translate(45, 10)">
          <ellipse cx="0" cy="0" rx="6" ry="12" fill="var(--success-green)" opacity="0.8" transform="rotate(30)"/>
        </g>
      </g>
      
      <!-- Rayos de amor -->
      <g class="love-rays" :class="{ 'animated': animated }">
        <line x1="0" y1="-40" x2="0" y2="-60" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="-28" y1="-28" x2="-42" y2="-42" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="28" y1="-28" x2="42" y2="-42" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="-40" y1="0" x2="-60" y2="0" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        <line x1="40" y1="0" x2="60" y2="0" stroke="var(--accent-gold)" stroke-width="2" opacity="0.7"/>
        
        <!-- Pequeños corazones en los rayos -->
        <g transform="translate(0, -65)">
          <path d="M0,3 C-3,0 -6,0 -6,4 C-6,8 0,12 0,12 C0,12 6,8 6,4 C6,0 3,0 0,3 Z" fill="var(--error-red)" opacity="0.6"/>
        </g>
        
        <g transform="translate(-47, -47)">
          <path d="M0,3 C-3,0 -6,0 -6,4 C-6,8 0,12 0,12 C0,12 6,8 6,4 C6,0 3,0 0,3 Z" fill="var(--error-red)" opacity="0.6"/>
        </g>
        
        <g transform="translate(47, -47)">
          <path d="M0,3 C-3,0 -6,0 -6,4 C-6,8 0,12 0,12 C0,12 6,8 6,4 C6,0 3,0 0,3 Z" fill="var(--error-red)" opacity="0.6"/>
        </g>
      </g>
      
      <!-- Texto decorativo "Amor Eterno" -->
      <g class="love-text" transform="translate(0, 100)">
        <text 
          x="0" 
          y="0" 
          text-anchor="middle" 
          fill="var(--accent-gold)" 
          font-family="var(--font-family-display)"
          font-size="12"
          font-weight="bold"
          opacity="0.8"
        >
          Amor Eterno
        </text>
      </g>
      
      <!-- Partículas de amor flotantes -->
      <g class="love-particles" :class="{ 'animated': animated }">
        <circle cx="-70" cy="-10" r="2" fill="var(--error-red)" opacity="0.6"/>
        <circle cx="70" cy="15" r="1.5" fill="var(--accent-gold)" opacity="0.7"/>
        <circle cx="-50" cy="60" r="1" fill="var(--primary-orange)" opacity="0.5"/>
        <circle cx="55" cy="-35" r="2.5" fill="var(--error-red)" opacity="0.4"/>
        <circle cx="-30" cy="-50" r="1.5" fill="var(--accent-gold)" opacity="0.6"/>
        <circle cx="35" cy="70" r="1" fill="var(--primary-orange)" opacity="0.5"/>
      </g>
      
      <!-- Aura de amor -->
      <ellipse
        cx="0" cy="20"
        rx="60" ry="80"
        fill="none"
        stroke="var(--error-red)"
        stroke-width="1"
        opacity="0.2"
        class="love-aura"
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
.heart-main.animated {
  animation: heartbeat 2s ease-in-out infinite;
}

.floral-decoration.animated {
  animation: gentle-bloom 4s ease-in-out infinite;
}

.love-rays.animated {
  animation: ray-pulse 3s ease-in-out infinite;
}

.love-particles.animated {
  animation: particle-float 6s ease-in-out infinite;
}

.love-aura.animated {
  animation: aura-glow 4s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes gentle-bloom {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(2deg);
  }
}

@keyframes ray-pulse {
  0%, 100% {
    opacity: 0.7;
    stroke-width: 2;
  }
  50% {
    opacity: 1;
    stroke-width: 3;
  }
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0);
  }
  33% {
    transform: translateY(-5px);
  }
  66% {
    transform: translateY(3px);
  }
}

@keyframes aura-glow {
  0%, 100% {
    stroke-opacity: 0.2;
    rx: 60;
    ry: 80;
  }
  50% {
    stroke-opacity: 0.4;
    rx: 65;
    ry: 85;
  }
}
</style>