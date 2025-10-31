<template>
  <g class="el-arbol-svg">
    <g transform="translate(100, 140)">
      <!-- Tronco principal -->
      <rect
        x="-8" y="20"
        width="16" height="60"
        fill="#8B4513"
        rx="3"
        class="trunk"
      />
      
      <!-- Raíces -->
      <g class="roots">
        <path d="M-8,80 Q-20,85 -25,90" stroke="#654321" stroke-width="3" fill="none"/>
        <path d="M8,80 Q20,85 25,90" stroke="#654321" stroke-width="3" fill="none"/>
        <path d="M0,80 Q-10,88 -15,95" stroke="#654321" stroke-width="2" fill="none"/>
        <path d="M0,80 Q10,88 15,95" stroke="#654321" stroke-width="2" fill="none"/>
      </g>
      
      <!-- Copa del árbol -->
      <g class="tree-crown" :class="{ 'animated': animated }">
        <!-- Follaje principal -->
        <circle cx="0" cy="0" r="35" fill="var(--success-green)" opacity="0.9"/>
        <circle cx="-15" cy="-10" r="25" fill="var(--success-green)" opacity="0.8"/>
        <circle cx="15" cy="-10" r="25" fill="var(--success-green)" opacity="0.8"/>
        <circle cx="0" cy="-25" r="20" fill="var(--success-green)" opacity="0.9"/>
        
        <!-- Hojas individuales -->
        <ellipse cx="-30" cy="10" rx="8" ry="4" fill="#228B22" transform="rotate(-30 -30 10)"/>
        <ellipse cx="30" cy="5" rx="6" ry="3" fill="#228B22" transform="rotate(45 30 5)"/>
        <ellipse cx="-20" cy="-30" rx="5" ry="3" fill="#228B22" transform="rotate(-60 -20 -30)"/>
        <ellipse cx="25" cy="-25" rx="7" ry="4" fill="#228B22" transform="rotate(30 25 -25)"/>
      </g>
      
      <!-- Flores de cempasúchil en el árbol -->
      <g class="tree-flowers" :class="{ 'animated': animated }">
        <g transform="translate(-20, -15)">
          <circle cx="0" cy="0" r="4" fill="var(--accent-gold)" opacity="0.9"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)"/>
        </g>
        
        <g transform="translate(25, -5)">
          <circle cx="0" cy="0" r="3" fill="var(--accent-gold)" opacity="0.8"/>
          <circle cx="-1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="-1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
        </g>
        
        <g transform="translate(10, 20)">
          <circle cx="0" cy="0" r="3.5" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="-2" cy="-2" r="1" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1" fill="var(--primary-orange)"/>
        </g>
      </g>
      
      <!-- Ramas -->
      <g class="branches">
        <line x1="-5" y1="10" x2="-25" y2="-5" stroke="#8B4513" stroke-width="4"/>
        <line x1="5" y1="15" x2="30" y2="0" stroke="#8B4513" stroke-width="4"/>
        <line x1="-3" y1="5" x2="-15" y2="-15" stroke="#8B4513" stroke-width="3"/>
        <line x1="3" y1="8" x2="20" y2="-10" stroke="#8B4513" stroke-width="3"/>
      </g>
      
      <!-- Pájaros en las ramas -->
      <g class="birds" :class="{ 'animated': animated }">
        <g transform="translate(-35, -10)">
          <ellipse cx="0" cy="0" rx="3" ry="2" fill="var(--background-dark)"/>
          <circle cx="-2" cy="-1" r="1.5" fill="var(--background-dark)"/>
          <circle cx="-2.5" cy="-1.5" r="0.5" fill="white"/>
          <path d="M3,0 L6,-1 L6,1 Z" fill="var(--background-dark)"/>
        </g>
        
        <g transform="translate(35, -5)">
          <ellipse cx="0" cy="0" rx="2.5" ry="1.5" fill="var(--secondary-purple)"/>
          <circle cx="-1.5" cy="-0.5" r="1" fill="var(--secondary-purple)"/>
          <circle cx="-2" cy="-1" r="0.3" fill="white"/>
          <path d="M2.5,0 L5,-0.5 L5,0.5 Z" fill="var(--secondary-purple)"/>
        </g>
      </g>
      
      <!-- Aura del árbol de la vida -->
      <circle
        cx="0" cy="20"
        r="90"
        fill="none"
        stroke="var(--success-green)"
        stroke-width="1"
        opacity="0.2"
        class="life-aura"
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
.tree-crown.animated {
  animation: gentle-sway 4s ease-in-out infinite;
}

.tree-flowers.animated {
  animation: flower-bloom 3s ease-in-out infinite;
}

.birds.animated {
  animation: bird-hop 5s ease-in-out infinite;
}

.life-aura.animated {
  animation: life-pulse 6s ease-in-out infinite;
}

@keyframes gentle-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(2deg);
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

@keyframes bird-hop {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-2px);
  }
  75% {
    transform: translateY(1px);
  }
}

@keyframes life-pulse {
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