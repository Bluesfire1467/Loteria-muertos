<template>
  <g class="el-diablo-svg">
    <!-- Cuerpo -->
    <ellipse cx="100" cy="170" rx="18" ry="30" fill="#8B0000"/>
    <ellipse cx="100" cy="170" rx="15" ry="27" fill="#B22222" opacity="0.8"/>
    
    <!-- Brazos -->
    <ellipse cx="75" cy="155" rx="8" ry="20" fill="#8B0000" transform="rotate(-20 75 155)"/>
    <ellipse cx="125" cy="155" rx="8" ry="20" fill="#8B0000" transform="rotate(20 125 155)"/>
    
    <!-- Manos con garras -->
    <circle cx="70" cy="175" r="6" fill="#8B0000"/>
    <circle cx="130" cy="175" r="6" fill="#8B0000"/>
    
    <!-- Garras -->
    <path d="M 65 172 L 62 168 L 64 170 Z" fill="#000"/>
    <path d="M 68 170 L 65 166 L 67 168 Z" fill="#000"/>
    <path d="M 72 173 L 69 169 L 71 171 Z" fill="#000"/>
    
    <path d="M 135 172 L 138 168 L 136 170 Z" fill="#000"/>
    <path d="M 132 170 L 135 166 L 133 168 Z" fill="#000"/>
    <path d="M 128 173 L 131 169 L 129 171 Z" fill="#000"/>
    
    <!-- Piernas -->
    <ellipse cx="90" cy="195" rx="8" ry="18" fill="#8B0000"/>
    <ellipse cx="110" cy="195" rx="8" ry="18" fill="#8B0000"/>
    
    <!-- Pezuñas -->
    <ellipse cx="90" cy="213" rx="6" ry="4" fill="#000"/>
    <ellipse cx="110" cy="213" rx="6" ry="4" fill="#000"/>
    <path d="M 87 213 L 93 213 L 90 217 Z" fill="#000"/>
    <path d="M 107 213 L 113 213 L 110 217 Z" fill="#000"/>
    
    <!-- Cuello -->
    <rect x="95" y="135" width="10" height="10" fill="#8B0000"/>
    
    <!-- Cabeza -->
    <circle cx="100" cy="120" r="18" fill="#8B0000"/>
    <circle cx="100" cy="120" r="15" fill="#B22222" opacity="0.8"/>
    
    <!-- Cuernos -->
    <path d="M 88 105 L 85 90 L 92 95 Z" fill="#000"/>
    <path d="M 112 105 L 115 90 L 108 95 Z" fill="#000"/>
    <path d="M 88 105 L 86 92 L 90 97 Z" fill="#8B0000"/>
    <path d="M 112 105 L 114 92 L 110 97 Z" fill="#8B0000"/>
    
    <!-- Ojos malvados -->
    <ellipse cx="92" cy="115" rx="4" ry="6" fill="#FF0000"/>
    <ellipse cx="108" cy="115" rx="4" ry="6" fill="#FF0000"/>
    <circle cx="92" cy="115" r="2" fill="#000"/>
    <circle cx="108" cy="115" r="2" fill="#000"/>
    <circle cx="93" cy="114" r="1" fill="#FF4500"/>
    <circle cx="109" cy="114" r="1" fill="#FF4500"/>
    
    <!-- Cejas diabólicas -->
    <path d="M 88 110 L 96 108 L 94 112 Z" fill="#000"/>
    <path d="M 112 110 L 104 108 L 106 112 Z" fill="#000"/>
    
    <!-- Nariz -->
    <ellipse cx="100" cy="122" rx="2" ry="3" fill="#8B0000"/>
    
    <!-- Boca malvada con sonrisa -->
    <path d="M 92 128 Q 100 135 108 128" stroke="#000" stroke-width="2" fill="none"/>
    <path d="M 92 128 Q 100 132 108 128" fill="#8B0000"/>
    
    <!-- Dientes/colmillos -->
    <polygon points="96,130 98,135 94,135" fill="#FFF"/>
    <polygon points="104,130 106,135 102,135" fill="#FFF"/>
    
    <!-- Barba de chivo -->
    <path d="M 100 135 Q 98 145 100 150 Q 102 145 100 135" fill="#000"/>
    
    <!-- Cola -->
    <path d="M 118 185 Q 135 190 140 175 Q 145 180 142 185 Q 138 188 135 185" stroke="#8B0000" stroke-width="3" fill="none"/>
    <path d="M 138 175 L 142 172 L 145 178 L 140 180 Z" fill="#8B0000"/>
    
    <!-- Tridente -->
    <rect x="65" y="120" width="2" height="40" fill="#8B4513"/>
    <path d="M 60 115 L 64 120 L 68 120 L 72 115" stroke="#FFD700" stroke-width="2" fill="none"/>
    <line x1="60" y1="115" x2="60" y2="110" stroke="#FFD700" stroke-width="2"/>
    <line x1="66" y1="118" x2="66" y2="113" stroke="#FFD700" stroke-width="2"/>
    <line x1="72" y1="115" x2="72" y2="110" stroke="#FFD700" stroke-width="2"/>
    
    <!-- Llamas alrededor -->
    <path d="M 130 140 Q 135 135 140 140 Q 138 145 135 142 Q 132 138 130 140" fill="#FF4500" opacity="0.7"/>
    <path d="M 60 140 Q 55 135 50 140 Q 52 145 55 142 Q 58 138 60 140" fill="#FF4500" opacity="0.7"/>
    <path d="M 100 90 Q 105 85 110 90 Q 108 95 105 92 Q 102 88 100 90" fill="#FF4500" opacity="0.7"/>
    
    <!-- Animación de fuego -->
    <g v-if="animated" class="fire-animation">
      <circle cx="100" cy="120" r="25" fill="none" stroke="#FF4500" stroke-width="1" opacity="0.3"/>
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
.fire-animation {
  animation: hellfire 2s ease-in-out infinite;
}

@keyframes hellfire {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.05);
  }
}
</style>