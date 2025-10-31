<template>
  <g class="la-muerte-svg">
    <!-- Figura de la Muerte -->
    <g transform="translate(100, 140)">
      <!-- Túnica -->
      <path
        d="M-40,60 Q-45,40 -35,20 Q-30,0 -20,-10 Q0,-15 20,-10 Q30,0 35,20 Q45,40 40,60 L40,80 L-40,80 Z"
        fill="var(--background-dark)"
        stroke="var(--accent-gold)"
        stroke-width="2"
        opacity="0.9"
      />
      
      <!-- Capucha -->
      <path
        d="M-25,-10 Q-30,-25 -20,-35 Q0,-40 20,-35 Q30,-25 25,-10 Q20,-5 15,0 Q0,5 -15,0 Q-20,-5 -25,-10 Z"
        fill="var(--background-dark)"
        stroke="var(--accent-gold)"
        stroke-width="2"
      />
      
      <!-- Cráneo -->
      <ellipse
        cx="0" cy="-5"
        rx="18" ry="20"
        fill="#F5F5DC"
        stroke="var(--accent-gold)"
        stroke-width="1"
      />
      
      <!-- Cuencas de los ojos -->
      <ellipse cx="-8" cy="-10" rx="4" ry="6" fill="var(--background-dark)"/>
      <ellipse cx="8" cy="-10" rx="4" ry="6" fill="var(--background-dark)"/>
      
      <!-- Puntos de luz en los ojos -->
      <circle cx="-8" cy="-12" r="1" fill="var(--accent-gold)" opacity="0.8"/>
      <circle cx="8" cy="-12" r="1" fill="var(--accent-gold)" opacity="0.8"/>
      
      <!-- Nariz -->
      <path d="M0,-2 L-3,5 L0,8 L3,5 Z" fill="var(--background-dark)"/>
      
      <!-- Sonrisa -->
      <path
        d="M-12,8 Q0,15 12,8"
        stroke="var(--background-dark)"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
      />
      
      <!-- Dientes -->
      <rect x="-8" y="8" width="2" height="4" fill="#F5F5DC"/>
      <rect x="-4" y="8" width="2" height="5" fill="#F5F5DC"/>
      <rect x="0" y="8" width="2" height="5" fill="#F5F5DC"/>
      <rect x="4" y="8" width="2" height="4" fill="#F5F5DC"/>
      
      <!-- Brazos esqueléticos -->
      <g class="arms" :class="{ 'animated': animated }">
        <!-- Brazo izquierdo -->
        <line x1="-35" y1="20" x2="-50" y2="35" stroke="#F5F5DC" stroke-width="4" stroke-linecap="round"/>
        <line x1="-50" y1="35" x2="-45" y2="50" stroke="#F5F5DC" stroke-width="4" stroke-linecap="round"/>
        <circle cx="-50" cy="35" r="3" fill="#F5F5DC"/>
        
        <!-- Mano izquierda -->
        <g transform="translate(-45, 50)">
          <ellipse cx="0" cy="0" rx="4" ry="6" fill="#F5F5DC"/>
          <line x1="-2" y1="-4" x2="-2" y2="-8" stroke="#F5F5DC" stroke-width="1"/>
          <line x1="0" y1="-4" x2="0" y2="-9" stroke="#F5F5DC" stroke-width="1"/>
          <line x1="2" y1="-4" x2="2" y2="-8" stroke="#F5F5DC" stroke-width="1"/>
        </g>
        
        <!-- Brazo derecho -->
        <line x1="35" y1="20" x2="50" y2="35" stroke="#F5F5DC" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="35" x2="45" y2="50" stroke="#F5F5DC" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="35" r="3" fill="#F5F5DC"/>
        
        <!-- Mano derecha -->
        <g transform="translate(45, 50)">
          <ellipse cx="0" cy="0" rx="4" ry="6" fill="#F5F5DC"/>
          <line x1="-2" y1="-4" x2="-2" y2="-8" stroke="#F5F5DC" stroke-width="1"/>
          <line x1="0" y1="-4" x2="0" y2="-9" stroke="#F5F5DC" stroke-width="1"/>
          <line x1="2" y1="-4" x2="2" y2="-8" stroke="#F5F5DC" stroke-width="1"/>
        </g>
      </g>
      
      <!-- Guadaña -->
      <g transform="translate(55, 10)" class="scythe" :class="{ 'animated': animated }">
        <!-- Mango -->
        <line x1="0" y1="0" x2="15" y2="60" stroke="#8B4513" stroke-width="3"/>
        
        <!-- Hoja de la guadaña -->
        <path
          d="M0,0 Q-15,-10 -25,-5 Q-30,0 -25,8 Q-15,12 0,5 Z"
          fill="#C0C0C0"
          stroke="var(--accent-gold)"
          stroke-width="1"
        />
        
        <!-- Brillo en la hoja -->
        <path
          d="M-5,0 Q-10,-3 -15,-2 Q-12,2 -5,3 Z"
          fill="white"
          opacity="0.6"
        />
      </g>
      
      <!-- Flores de cempasúchil decorativas -->
      <g class="marigolds" :class="{ 'animated': animated }">
        <g transform="translate(-60, 70)">
          <circle cx="0" cy="0" r="6" fill="var(--accent-gold)" opacity="0.8"/>
          <circle cx="-3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="-3" cy="3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="3" r="2" fill="var(--primary-orange)"/>
        </g>
        
        <g transform="translate(60, 70)">
          <circle cx="0" cy="0" r="6" fill="var(--accent-gold)" opacity="0.8"/>
          <circle cx="-3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="-3" r="2" fill="var(--primary-orange)"/>
          <circle cx="-3" cy="3" r="2" fill="var(--primary-orange)"/>
          <circle cx="3" cy="3" r="2" fill="var(--primary-orange)"/>
        </g>
      </g>
      
      <!-- Aura mística -->
      <circle
        cx="0" cy="0"
        r="70"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.3"
        class="aura"
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
.arms.animated {
  animation: gentle-sway 3s ease-in-out infinite;
}

.scythe.animated {
  animation: scythe-gleam 4s ease-in-out infinite;
  transform-origin: 55px 10px;
}

.marigolds.animated {
  animation: petal-dance 5s ease-in-out infinite;
}

.aura.animated {
  animation: mystical-glow 6s ease-in-out infinite;
}

@keyframes gentle-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

@keyframes scythe-gleam {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

@keyframes petal-dance {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
}

@keyframes mystical-glow {
  0%, 100% {
    stroke-opacity: 0.3;
    r: 70;
  }
  50% {
    stroke-opacity: 0.6;
    r: 75;
  }
}
</style>