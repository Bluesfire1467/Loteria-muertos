<template>
  <g class="la-maceta-svg">
    <!-- Maceta -->
    <path d="M 75 180 L 85 220 L 115 220 L 125 180 Z" fill="#8B4513"/>
    <path d="M 75 180 L 85 215 L 115 215 L 125 180 Z" fill="#A0522D" opacity="0.8"/>
    
    <!-- Borde de la maceta -->
    <ellipse cx="100" cy="180" rx="25" ry="5" fill="#654321"/>
    <ellipse cx="100" cy="178" rx="25" ry="5" fill="#8B4513"/>
    
    <!-- Base de la maceta -->
    <ellipse cx="100" cy="220" rx="20" ry="4" fill="#654321"/>
    
    <!-- Tierra -->
    <ellipse cx="100" cy="180" rx="22" ry="4" fill="#8B4513"/>
    <ellipse cx="100" cy="182" rx="20" ry="3" fill="#A0522D"/>
    
    <!-- Planta principal - Geranio -->
    <circle cx="100" cy="170" r="3" fill="#228B22"/>
    <rect x="98" y="170" width="4" height="15" fill="#228B22"/>
    
    <!-- Hojas -->
    <ellipse cx="90" cy="165" rx="8" ry="4" fill="#32CD32" transform="rotate(-30 90 165)"/>
    <ellipse cx="110" cy="165" rx="8" ry="4" fill="#32CD32" transform="rotate(30 110 165)"/>
    <ellipse cx="85" cy="175" rx="6" ry="3" fill="#32CD32" transform="rotate(-45 85 175)"/>
    <ellipse cx="115" cy="175" rx="6" ry="3" fill="#32CD32" transform="rotate(45 115 175)"/>
    
    <!-- Más hojas pequeñas -->
    <ellipse cx="95" cy="155" rx="5" ry="2" fill="#228B22" transform="rotate(-20 95 155)"/>
    <ellipse cx="105" cy="155" rx="5" ry="2" fill="#228B22" transform="rotate(20 105 155)"/>
    
    <!-- Flores rojas -->
    <circle cx="95" cy="145" r="4" fill="#DC143C"/>
    <circle cx="105" cy="140" r="4" fill="#DC143C"/>
    <circle cx="100" cy="150" r="3" fill="#FF6347"/>
    
    <!-- Pétalos de las flores -->
    <ellipse cx="93" cy="143" rx="2" ry="1" fill="#FF69B4"/>
    <ellipse cx="97" cy="143" rx="2" ry="1" fill="#FF69B4"/>
    <ellipse cx="95" cy="141" rx="1" ry="2" fill="#FF69B4"/>
    <ellipse cx="95" cy="147" rx="1" ry="2" fill="#FF69B4"/>
    
    <ellipse cx="103" cy="138" rx="2" ry="1" fill="#FF69B4"/>
    <ellipse cx="107" cy="138" rx="2" ry="1" fill="#FF69B4"/>
    <ellipse cx="105" cy="136" rx="1" ry="2" fill="#FF69B4"/>
    <ellipse cx="105" cy="142" rx="1" ry="2" fill="#FF69B4"/>
    
    <!-- Tallos -->
    <line x1="95" y1="145" x2="98" y2="165" stroke="#228B22" stroke-width="2"/>
    <line x1="105" y1="140" x2="102" y2="165" stroke="#228B22" stroke-width="2"/>
    <line x1="100" y1="150" x2="100" y2="170" stroke="#228B22" stroke-width="2"/>
    
    <!-- Detalles de la maceta -->
    <rect x="80" y="190" width="40" height="2" fill="#654321" opacity="0.7"/>
    <rect x="80" y="200" width="40" height="2" fill="#654321" opacity="0.7"/>
    <rect x="80" y="210" width="40" height="2" fill="#654321" opacity="0.7"/>
    
    <!-- Plato debajo de la maceta -->
    <ellipse cx="100" cy="225" rx="28" ry="6" fill="#8B4513"/>
    <ellipse cx="100" cy="223" rx="28" ry="6" fill="#A0522D" opacity="0.8"/>
    
    <!-- Pequeñas flores adicionales -->
    <circle cx="88" cy="160" r="2" fill="#FFB6C1"/>
    <circle cx="112" cy="158" r="2" fill="#FFB6C1"/>
    
    <!-- Animación de crecimiento -->
    <g v-if="animated" class="growth-animation">
      <circle cx="100" cy="145" r="8" fill="none" stroke="#32CD32" stroke-width="1" opacity="0.3"/>
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
.growth-animation {
  animation: plant-growth 4s ease-in-out infinite;
}

@keyframes plant-growth {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>