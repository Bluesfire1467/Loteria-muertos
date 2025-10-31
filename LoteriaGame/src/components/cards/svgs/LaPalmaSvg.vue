<template>
  <g class="la-palma-svg">
    <!-- Tronco de la palma -->
    <rect x="90" y="120" width="20" height="80" fill="#8B4513" rx="3"/>
    <rect x="88" y="125" width="24" height="5" fill="#A0522D" opacity="0.7"/>
    <rect x="88" y="135" width="24" height="3" fill="#A0522D" opacity="0.7"/>
    <rect x="88" y="145" width="24" height="3" fill="#A0522D" opacity="0.7"/>
    <rect x="88" y="155" width="24" height="3" fill="#A0522D" opacity="0.7"/>
    
    <!-- Hojas de palma -->
    <!-- Hoja central superior -->
    <ellipse cx="100" cy="90" rx="8" ry="35" fill="#228B22" transform="rotate(-10 100 90)"/>
    <ellipse cx="100" cy="90" rx="6" ry="30" fill="#32CD32" transform="rotate(-10 100 90)"/>
    
    <!-- Hojas laterales izquierdas -->
    <ellipse cx="85" cy="100" rx="6" ry="30" fill="#228B22" transform="rotate(-45 85 100)"/>
    <ellipse cx="85" cy="100" rx="4" ry="25" fill="#32CD32" transform="rotate(-45 85 100)"/>
    
    <ellipse cx="75" cy="115" rx="5" ry="25" fill="#228B22" transform="rotate(-70 75 115)"/>
    <ellipse cx="75" cy="115" rx="3" ry="20" fill="#32CD32" transform="rotate(-70 75 115)"/>
    
    <!-- Hojas laterales derechas -->
    <ellipse cx="115" cy="100" rx="6" ry="30" fill="#228B22" transform="rotate(45 115 100)"/>
    <ellipse cx="115" cy="100" rx="4" ry="25" fill="#32CD32" transform="rotate(45 115 100)"/>
    
    <ellipse cx="125" cy="115" rx="5" ry="25" fill="#228B22" transform="rotate(70 125 115)"/>
    <ellipse cx="125" cy="115" rx="3" ry="20" fill="#32CD32" transform="rotate(70 125 115)"/>
    
    <!-- Cocos -->
    <circle cx="95" cy="125" r="4" fill="#8B4513"/>
    <circle cx="105" cy="128" r="4" fill="#A0522D"/>
    <circle cx="100" cy="135" r="3" fill="#8B4513"/>
    
    <!-- Detalles de las hojas -->
    <line x1="100" y1="70" x2="100" y2="110" stroke="#006400" stroke-width="1" opacity="0.6"/>
    <line x1="85" y1="85" x2="95" y2="115" stroke="#006400" stroke-width="1" opacity="0.6"/>
    <line x1="115" y1="85" x2="105" y2="115" stroke="#006400" stroke-width="1" opacity="0.6"/>
    
    <!-- Animación de viento -->
    <g v-if="animated" class="wind-animation">
      <ellipse cx="100" cy="90" rx="8" ry="35" fill="none" stroke="#90EE90" stroke-width="1" opacity="0.3" transform="rotate(-8 100 90)"/>
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
.wind-animation {
  animation: palm-sway 3s ease-in-out infinite;
}

@keyframes palm-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
}
</style>