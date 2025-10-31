<template>
  <g class="el-musico-svg">
    <g transform="translate(100, 140)">
      <!-- Guitarra -->
      <g class="guitar" :class="{ 'animated': animated }">
        <!-- Cuerpo de la guitarra -->
        <ellipse cx="0" cy="10" rx="25" ry="35" fill="#8B4513" stroke="#654321" stroke-width="2"/>
        <ellipse cx="0" cy="10" rx="20" ry="30" fill="#D2691E" opacity="0.8"/>
        
        <!-- Boca de la guitarra -->
        <circle cx="0" cy="10" r="8" fill="var(--background-dark)"/>
        <circle cx="0" cy="10" r="6" fill="#654321"/>
        
        <!-- Decoración alrededor de la boca -->
        <circle cx="0" cy="10" r="10" fill="none" stroke="var(--accent-gold)" stroke-width="1" opacity="0.8"/>
        
        <!-- Mástil -->
        <rect x="-3" y="-40" width="6" height="50" fill="#654321" rx="3"/>
        <rect x="-2" y="-40" width="4" height="50" fill="#8B4513" rx="2"/>
        
        <!-- Clavijero -->
        <ellipse cx="0" cy="-45" rx="8" ry="5" fill="#654321"/>
        
        <!-- Cuerdas -->
        <line x1="-1.5" y1="-40" x2="-1.5" y2="45" stroke="#C0C0C0" stroke-width="0.5"/>
        <line x1="-0.5" y1="-40" x2="-0.5" y2="45" stroke="#C0C0C0" stroke-width="0.5"/>
        <line x1="0.5" y1="-40" x2="0.5" y2="45" stroke="#C0C0C0" stroke-width="0.5"/>
        <line x1="1.5" y1="-40" x2="1.5" y2="45" stroke="#C0C0C0" stroke-width="0.5"/>
        
        <!-- Trastes -->
        <line x1="-3" y1="-30" x2="3" y2="-30" stroke="#C0C0C0" stroke-width="0.5"/>
        <line x1="-3" y1="-20" x2="3" y2="-20" stroke="#C0C0C0" stroke-width="0.5"/>
        <line x1="-3" y1="-10" x2="3" y2="-10" stroke="#C0C0C0" stroke-width="0.5"/>
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#C0C0C0" stroke-width="0.5"/>
      </g>
      
      <!-- Manos del músico -->
      <g class="hands" :class="{ 'animated': animated }">
        <!-- Mano izquierda (en el mástil) -->
        <ellipse cx="-15" cy="-15" rx="4" ry="6" fill="#DEB887" transform="rotate(-30 -15 -15)"/>
        <ellipse cx="-13" cy="-18" rx="1.5" ry="3" fill="#DEB887" transform="rotate(-30 -13 -18)"/>
        <ellipse cx="-17" cy="-12" rx="1.5" ry="3" fill="#DEB887" transform="rotate(-30 -17 -12)"/>
        
        <!-- Mano derecha (rasgueando) -->
        <ellipse cx="20" cy="15" rx="4" ry="6" fill="#DEB887" transform="rotate(20 20 15)"/>
        <ellipse cx="22" cy="12" rx="1.5" ry="3" fill="#DEB887" transform="rotate(20 22 12)"/>
        <ellipse cx="18" cy="18" rx="1.5" ry="3" fill="#DEB887" transform="rotate(20 18 18)"/>
      </g>
      
      <!-- Notas musicales -->
      <g class="musical-notes" :class="{ 'animated': animated }">
        <g transform="translate(-40, -20)">
          <ellipse cx="0" cy="0" rx="3" ry="2" fill="var(--accent-gold)" transform="rotate(-20)"/>
          <line x1="3" y1="-1" x2="3" y2="-8" stroke="var(--accent-gold)" stroke-width="1"/>
        </g>
        
        <g transform="translate(-50, -35)">
          <ellipse cx="0" cy="0" rx="2.5" ry="1.5" fill="var(--primary-orange)" transform="rotate(-15)"/>
          <line x1="2.5" y1="-0.5" x2="2.5" y2="-6" stroke="var(--primary-orange)" stroke-width="1"/>
        </g>
        
        <g transform="translate(45, -10)">
          <ellipse cx="0" cy="0" rx="3" ry="2" fill="var(--accent-gold)" transform="rotate(25)"/>
          <line x1="-3" y1="-1" x2="-3" y2="-8" stroke="var(--accent-gold)" stroke-width="1"/>
        </g>
        
        <g transform="translate(55, -30)">
          <ellipse cx="0" cy="0" rx="2.5" ry="1.5" fill="var(--primary-orange)" transform="rotate(20)"/>
          <line x1="-2.5" y1="-0.5" x2="-2.5" y2="-6" stroke="var(--primary-orange)" stroke-width="1"/>
        </g>
        
        <!-- Clave de sol -->
        <g transform="translate(-60, 0)">
          <path d="M0,0 Q-5,-10 0,-15 Q5,-10 0,-5 Q-3,0 0,5 Q3,0 0,-2" 
                fill="var(--secondary-purple)" stroke="var(--secondary-purple)" stroke-width="1"/>
        </g>
      </g>
      
      <!-- Sombrero -->
      <g class="hat" transform="translate(0, -60)">
        <ellipse cx="0" cy="0" rx="20" ry="5" fill="var(--background-dark)"/>
        <ellipse cx="0" cy="-5" rx="15" ry="8" fill="var(--background-dark)"/>
        <rect x="-2" y="-8" width="4" height="3" fill="var(--accent-gold)"/>
      </g>
      
      <!-- Flores de cempasúchil decorativas -->
      <g class="decorative-flowers" :class="{ 'animated': animated }">
        <g transform="translate(-70, 40)">
          <circle cx="0" cy="0" r="5" fill="var(--accent-gold)" opacity="0.8"/>
          <circle cx="-2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="-2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="-2" cy="2" r="1.5" fill="var(--primary-orange)"/>
          <circle cx="2" cy="2" r="1.5" fill="var(--primary-orange)"/>
        </g>
        
        <g transform="translate(70, 35)">
          <circle cx="0" cy="0" r="4" fill="var(--accent-gold)" opacity="0.7"/>
          <circle cx="-1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="-1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="-1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
          <circle cx="1.5" cy="1.5" r="1" fill="var(--primary-orange)"/>
        </g>
      </g>
      
      <!-- Aura musical -->
      <circle
        cx="0" cy="0"
        r="90"
        fill="none"
        stroke="var(--accent-gold)"
        stroke-width="1"
        opacity="0.2"
        class="musical-aura"
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
.guitar.animated {
  animation: guitar-strum 3s ease-in-out infinite;
}

.hands.animated {
  animation: hand-movement 2s ease-in-out infinite;
}

.musical-notes.animated {
  animation: notes-float 4s ease-in-out infinite;
}

.decorative-flowers.animated {
  animation: flower-dance 5s ease-in-out infinite;
}

.musical-aura.animated {
  animation: sound-wave 3s ease-in-out infinite;
}

@keyframes guitar-strum {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(1deg);
  }
}

@keyframes hand-movement {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes notes-float {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@keyframes flower-dance {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes sound-wave {
  0%, 100% {
    stroke-opacity: 0.2;
    r: 90;
  }
  50% {
    stroke-opacity: 0.5;
    r: 95;
  }
}
</style>