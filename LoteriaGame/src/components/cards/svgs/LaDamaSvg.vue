<template>
  <g class="la-dama-svg">
    <!-- Vestido -->
    <path d="M 70 180 Q 100 160 130 180 L 135 220 Q 100 230 65 220 Z" fill="#9370DB"/>
    <path d="M 70 180 Q 100 160 130 180 L 135 220 Q 100 225 65 220 Z" fill="#BA55D3" opacity="0.8"/>
    
    <!-- Corsé -->
    <ellipse cx="100" cy="150" rx="15" ry="25" fill="#4B0082"/>
    <rect x="95" y="135" width="10" height="30" fill="#6A5ACD" opacity="0.7"/>
    
    <!-- Brazos -->
    <ellipse cx="80" cy="155" rx="6" ry="15" fill="#FDBCB4" transform="rotate(-20 80 155)"/>
    <ellipse cx="120" cy="155" rx="6" ry="15" fill="#FDBCB4" transform="rotate(20 120 155)"/>
    
    <!-- Manos -->
    <circle cx="75" cy="170" r="4" fill="#FDBCB4"/>
    <circle cx="125" cy="170" r="4" fill="#FDBCB4"/>
    
    <!-- Abanico en la mano -->
    <path d="M 120 165 Q 130 160 135 170 Q 130 175 125 172 Q 122 168 120 165" fill="#FFD700"/>
    <line x1="125" y1="170" x2="130" y2="165" stroke="#8B4513" stroke-width="1"/>
    
    <!-- Cuello -->
    <rect x="95" y="125" width="10" height="8" fill="#FDBCB4"/>
    
    <!-- Cabeza -->
    <circle cx="100" cy="115" r="18" fill="#FDBCB4"/>
    
    <!-- Cabello -->
    <path d="M 82 105 Q 100 85 118 105 Q 115 95 100 90 Q 85 95 82 105" fill="#8B4513"/>
    <circle cx="90" cy="100" r="8" fill="#8B4513"/>
    <circle cx="110" cy="100" r="8" fill="#8B4513"/>
    
    <!-- Moño -->
    <ellipse cx="100" cy="95" rx="12" ry="8" fill="#8B4513"/>
    <circle cx="100" cy="95" r="3" fill="#FFD700"/>
    
    <!-- Ojos -->
    <circle cx="95" cy="112" r="2" fill="#000"/>
    <circle cx="105" cy="112" r="2" fill="#000"/>
    <circle cx="96" cy="111" r="1" fill="#FFF"/>
    <circle cx="106" cy="111" r="1" fill="#FFF"/>
    
    <!-- Nariz -->
    <ellipse cx="100" cy="118" rx="1" ry="2" fill="#F4A460"/>
    
    <!-- Boca -->
    <path d="M 97 122 Q 100 125 103 122" stroke="#8B0000" stroke-width="1.5" fill="none"/>
    
    <!-- Collar -->
    <ellipse cx="100" cy="130" rx="8" ry="3" fill="none" stroke="#FFD700" stroke-width="2"/>
    <circle cx="100" cy="133" r="2" fill="#FFD700"/>
    
    <!-- Detalles del vestido -->
    <path d="M 75 190 Q 100 185 125 190" stroke="#DDA0DD" stroke-width="2" fill="none"/>
    <path d="M 80 200 Q 100 195 120 200" stroke="#DDA0DD" stroke-width="2" fill="none"/>
    <path d="M 85 210 Q 100 205 115 210" stroke="#DDA0DD" stroke-width="2" fill="none"/>
    
    <!-- Animación de elegancia -->
    <g v-if="animated" class="elegance-animation">
      <circle cx="100" cy="115" r="25" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3"/>
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
.elegance-animation {
  animation: elegant-glow 4s ease-in-out infinite;
}

@keyframes elegant-glow {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}
</style>