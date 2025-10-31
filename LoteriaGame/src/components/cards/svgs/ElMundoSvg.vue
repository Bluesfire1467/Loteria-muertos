<template>
  <g class="el-mundo-svg">
    <g transform="translate(100, 140)">
      <!-- Globo terráqueo -->
      <g class="earth-globe" :class="{ 'animated': animated }">
        <circle cx="0" cy="0" r="40" fill="#4682B4" stroke="#1E90FF" stroke-width="2"/>
        
        <!-- Continentes -->
        <g class="continents">
          <!-- América -->
          <path d="M-25,-20 Q-20,-30 -15,-25 Q-10,-15 -15,0 Q-20,15 -25,20 Q-30,10 -25,-20" 
                fill="var(--success-green)" opacity="0.8"/>
          
          <!-- Europa/África -->
          <path d="M-5,-25 Q5,-30 15,-20 Q20,-10 15,5 Q10,20 5,25 Q-5,15 -5,-25" 
                fill="var(--success-green)" opacity="0.8"/>
          
          <!-- Asia -->
          <path d="M20,-15 Q30,-20 35,-10 Q30,0 25,10 Q20,5 20,-15" 
                fill="var(--success-green)" opacity="0.8"/>
        </g>
        
        <!-- Nubes -->
        <g class="clouds" opacity="0.6">
          <ellipse cx="-15" cy="-30" rx="8" ry="4" fill="white"/>
          <ellipse cx="20" cy="-25" rx="6" ry="3" fill="white"/>
          <ellipse cx="-25" cy="10" rx="5" ry="2.5" fill="white"/>
          <ellipse cx="15" cy="25" rx="7" ry="3.5" fill="white"/>
        </g>
      </g>
      
      <!-- Órbita -->
      <circle cx="0" cy="0" r="60" fill="none" stroke="var(--accent-gold)" stroke-width="1" opacity="0.5" stroke-dasharray="5,5"/>
      
      <!-- Luna orbitando -->
      <g class="orbiting-moon" :class="{ 'animated': animated }">
        <g transform="translate(60, 0)">
          <circle cx="0" cy="0" r="8" fill="#F5F5DC" stroke="#E0E0E0" stroke-width="1"/>
          <circle cx="2" cy="0" r="6" fill="#D3D3D3" opacity="0.6"/>
        </g>
      </g>
      
      <!-- Estrellas alrededor -->
      <g class="stars" :class="{ 'animated': animated }">
        <g transform="translate(-70, -30)">
          <polygon points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1" fill="var(--accent-gold)" opacity="0.8"/>
        </g>
        <g transform="translate(65, -45)">
          <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="var(--bright-yellow)" opacity="0.7"/>
        </g>
        <g transform="translate(-50, 60)">
          <polygon points="0,-3 1,-1 3,-1 1.5,0.5 2,3 0,1.5 -2,3 -1.5,0.5 -3,-1 -1,-1" fill="var(--accent-gold)" opacity="0.6"/>
        </g>
        <g transform="translate(75, 40)">
          <polygon points="0,-2 0.5,-0.5 2,-0.5 1,0.5 1.5,2 0,1 -1.5,2 -1,0.5 -2,-0.5 -0.5,-0.5" fill="var(--bright-yellow)" opacity="0.5"/>
        </g>
      </g>
      
      <!-- Constelaciones -->
      <g class="constellations" opacity="0.4">
        <line x1="-70" y1="-30" x2="-50" y2="-40" stroke="var(--accent-gold)" stroke-width="0.5"/>
        <line x1="-50" y1="-40" x2="-30" y2="-50" stroke="var(--accent-gold)" stroke-width="0.5"/>
        <line x1="65" y1="-45" x2="75" y2="-25" stroke="var(--accent-gold)" stroke-width="0.5"/>
        <line x1="75" y1="-25" x2="85" y2="-10" stroke="var(--accent-gold)" stroke-width="0.5"/>
      </g>
      
      <!-- Flores de cempasúchil terrestres -->
      <g class="earthly-flowers" :class="{ 'animated': animated }">
        <g transform="translate(-80, 20)">
          <circle cx="0" cy="0" r="5" fill="var(--accent-gold)" opacity="0.8"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)"/>
        </g>
        
        <g transform="translate(80, -15)">
          <circle cx="0" cy="0" r="4" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="-1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="-1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
        </g>
      </g>
      
      <!-- Aura cósmica -->
      <circle
        cx="0" cy="0"
        r="95"
        fill="none"
        stroke="var(--secondary-purple)"
        stroke-width="1"
        opacity="0.3"
        class="cosmic-aura"
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
.earth-globe.animated {
  animation: earth-rotation 10s linear infinite;
}

.orbiting-moon.animated {
  animation: moon-orbit 8s linear infinite;
}

.stars.animated {
  animation: star-twinkle 3s ease-in-out infinite;
}

.earthly-flowers.animated {
  animation: flower-sway 4s ease-in-out infinite;
}

.cosmic-aura.animated {
  animation: cosmic-pulse 6s ease-in-out infinite;
}

@keyframes earth-rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moon-orbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes star-twinkle {
  0%, 100% {
    opacity: 0.8;
  }
  25% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.6;
  }
}

@keyframes flower-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

@keyframes cosmic-pulse {
  0%, 100% {
    stroke-opacity: 0.3;
    r: 95;
  }
  50% {
    stroke-opacity: 0.6;
    r: 100;
  }
}
</style>