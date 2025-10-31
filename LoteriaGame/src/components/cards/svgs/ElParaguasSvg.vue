<template>
  <g class="el-paraguas-svg">
    <!-- Mango del paraguas -->
    <rect x="98" y="160" width="4" height="50" fill="#8B4513"/>
    <rect x="96" y="160" width="8" height="3" fill="#A0522D"/>
    
    <!-- Empuñadura curvada -->
    <path d="M 100 210 Q 110 215 115 210 Q 112 218 105 215 Q 98 212 100 210" stroke="#8B4513" stroke-width="3" fill="none"/>
    
    <!-- Estructura del paraguas -->
    <path d="M 60 160 Q 100 140 140 160" stroke="#000" stroke-width="2" fill="none"/>
    
    <!-- Tela del paraguas - Secciones -->
    <!-- Sección 1 -->
    <path d="M 60 160 Q 70 145 80 160 L 75 155 Q 70 150 65 155 Z" fill="#4169E1"/>
    <!-- Sección 2 -->
    <path d="M 80 160 Q 90 145 100 160 L 95 155 Q 90 150 85 155 Z" fill="#87CEFA"/>
    <!-- Sección 3 -->
    <path d="M 100 160 Q 110 145 120 160 L 115 155 Q 110 150 105 155 Z" fill="#4169E1"/>
    <!-- Sección 4 -->
    <path d="M 120 160 Q 130 145 140 160 L 135 155 Q 130 150 125 155 Z" fill="#87CEFA"/>
    
    <!-- Varillas del paraguas -->
    <line x1="100" y1="160" x2="65" y2="155" stroke="#000" stroke-width="1"/>
    <line x1="100" y1="160" x2="85" y2="150" stroke="#000" stroke-width="1"/>
    <line x1="100" y1="160" x2="100" y2="145" stroke="#000" stroke-width="1"/>
    <line x1="100" y1="160" x2="115" y2="150" stroke="#000" stroke-width="1"/>
    <line x1="100" y1="160" x2="135" y2="155" stroke="#000" stroke-width="1"/>
    
    <!-- Punta del paraguas -->
    <circle cx="100" cy="145" r="2" fill="#FFD700"/>
    <path d="M 100 143 L 98 140 L 102 140 Z" fill="#FFD700"/>
    
    <!-- Gotas de lluvia -->
    <ellipse cx="70" cy="120" rx="2" ry="6" fill="#4682B4" opacity="0.7"/>
    <ellipse cx="130" cy="115" rx="2" ry="6" fill="#4682B4" opacity="0.7"/>
    <ellipse cx="85" cy="110" rx="2" ry="6" fill="#4682B4" opacity="0.6"/>
    <ellipse cx="115" cy="125" rx="2" ry="6" fill="#4682B4" opacity="0.6"/>
    <ellipse cx="50" cy="130" rx="2" ry="6" fill="#4682B4" opacity="0.5"/>
    <ellipse cx="150" cy="135" rx="2" ry="6" fill="#4682B4" opacity="0.5"/>
    
    <!-- Más gotas -->
    <ellipse cx="60" cy="100" rx="1.5" ry="4" fill="#87CEEB" opacity="0.6"/>
    <ellipse cx="140" cy="105" rx="1.5" ry="4" fill="#87CEEB" opacity="0.6"/>
    <ellipse cx="75" cy="95" rx="1.5" ry="4" fill="#87CEEB" opacity="0.5"/>
    <ellipse cx="125" cy="100" rx="1.5" ry="4" fill="#87CEEB" opacity="0.5"/>
    
    <!-- Charco en el suelo -->
    <ellipse cx="100" cy="225" rx="25" ry="5" fill="#4682B4" opacity="0.3"/>
    <ellipse cx="100" cy="225" rx="20" ry="3" fill="#87CEEB" opacity="0.4"/>
    
    <!-- Detalles decorativos en el paraguas -->
    <circle cx="75" cy="152" r="1" fill="#FFD700"/>
    <circle cx="95" cy="148" r="1" fill="#FFD700"/>
    <circle cx="115" cy="148" r="1" fill="#FFD700"/>
    <circle cx="125" cy="152" r="1" fill="#FFD700"/>
    
    <!-- Borde del paraguas -->
    <path d="M 60 160 Q 100 140 140 160" stroke="#000" stroke-width="1" fill="none"/>
    
    <!-- Sombra del paraguas -->
    <ellipse cx="100" cy="220" rx="30" ry="6" fill="#000" opacity="0.2"/>
    
    <!-- Animación de lluvia -->
    <g v-if="animated" class="rain-animation">
      <ellipse cx="90" cy="105" rx="1" ry="5" fill="#4682B4" opacity="0.4"/>
      <ellipse cx="110" cy="110" rx="1" ry="5" fill="#4682B4" opacity="0.4"/>
      <ellipse cx="80" cy="115" rx="1" ry="5" fill="#4682B4" opacity="0.4"/>
      <ellipse cx="120" cy="108" rx="1" ry="5" fill="#4682B4" opacity="0.4"/>
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
.rain-animation {
  animation: falling-rain 1.5s linear infinite;
}

@keyframes falling-rain {
  0% { 
    transform: translateY(-10px);
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% { 
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>