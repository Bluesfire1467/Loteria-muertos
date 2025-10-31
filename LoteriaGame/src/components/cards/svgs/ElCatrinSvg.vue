<template>
  <g class="el-catrin-svg">
    <!-- Cuerpo/Traje -->
    <ellipse cx="100" cy="170" rx="20" ry="35" fill="#2F4F4F"/>
    <ellipse cx="100" cy="170" rx="17" ry="32" fill="#708090" opacity="0.8"/>
    
    <!-- Chaleco -->
    <ellipse cx="100" cy="155" rx="12" ry="20" fill="#8B0000"/>
    <ellipse cx="100" cy="155" rx="10" ry="18" fill="#B22222" opacity="0.8"/>
    
    <!-- Botones del chaleco -->
    <circle cx="100" cy="145" r="1.5" fill="#FFD700"/>
    <circle cx="100" cy="155" r="1.5" fill="#FFD700"/>
    <circle cx="100" cy="165" r="1.5" fill="#FFD700"/>
    
    <!-- Brazos -->
    <ellipse cx="75" cy="160" rx="8" ry="18" fill="#2F4F4F" transform="rotate(-15 75 160)"/>
    <ellipse cx="125" cy="160" rx="8" ry="18" fill="#2F4F4F" transform="rotate(15 125 160)"/>
    
    <!-- Manos con guantes -->
    <circle cx="70" cy="178" r="5" fill="#FFF"/>
    <circle cx="130" cy="178" r="5" fill="#FFF"/>
    <circle cx="70" cy="178" r="4" fill="#F5F5F5"/>
    <circle cx="130" cy="178" r="4" fill="#F5F5F5"/>
    
    <!-- Bastón elegante -->
    <rect x="132" y="140" width="2" height="40" fill="#8B4513"/>
    <circle cx="133" cy="138" r="3" fill="#FFD700"/>
    <ellipse cx="133" cy="138" rx="2" ry="1" fill="#DAA520"/>
    
    <!-- Piernas -->
    <rect x="90" y="200" width="8" height="20" fill="#2F4F4F"/>
    <rect x="102" y="200" width="8" height="20" fill="#2F4F4F"/>
    
    <!-- Zapatos elegantes -->
    <ellipse cx="94" cy="220" rx="8" ry="4" fill="#000"/>
    <ellipse cx="106" cy="220" rx="8" ry="4" fill="#000"/>
    <ellipse cx="94" cy="218" rx="6" ry="3" fill="#333"/>
    <ellipse cx="106" cy="218" rx="6" ry="3" fill="#333"/>
    
    <!-- Cuello y corbata -->
    <rect x="95" y="130" width="10" height="8" fill="#FDBCB4"/>
    <polygon points="98,138 102,138 101,148 99,148" fill="#8B0000"/>
    <polygon points="98.5,138 101.5,138 101,145 99,145" fill="#B22222"/>
    
    <!-- Cabeza -->
    <circle cx="100" cy="115" r="15" fill="#FDBCB4"/>
    
    <!-- Sombrero de copa -->
    <ellipse cx="100" cy="95" rx="18" ry="6" fill="#000"/>
    <rect x="88" y="75" width="24" height="20" fill="#000" rx="2"/>
    <ellipse cx="100" cy="75" rx="12" ry="4" fill="#333"/>
    
    <!-- Banda del sombrero -->
    <rect x="88" y="90" width="24" height="3" fill="#8B0000"/>
    
    <!-- Cabello -->
    <path d="M 85 105 Q 100 100 115 105 Q 112 110 100 108 Q 88 110 85 105" fill="#8B4513"/>
    
    <!-- Ojos -->
    <circle cx="95" cy="112" r="2" fill="#000"/>
    <circle cx="105" cy="112" r="2" fill="#000"/>
    <circle cx="96" cy="111" r="1" fill="#FFF"/>
    <circle cx="106" cy="111" r="1" fill="#FFF"/>
    
    <!-- Monóculo -->
    <circle cx="105" cy="112" r="6" fill="none" stroke="#C0C0C0" stroke-width="1"/>
    <circle cx="105" cy="112" r="5" fill="rgba(255,255,255,0.1)"/>
    <line x1="111" y1="112" x2="118" y2="115" stroke="#C0C0C0" stroke-width="1"/>
    
    <!-- Nariz aristocrática -->
    <ellipse cx="100" cy="118" rx="1.5" ry="3" fill="#F4A460"/>
    
    <!-- Bigote elegante -->
    <path d="M 92 120 Q 100 118 108 120" stroke="#8B4513" stroke-width="2" fill="none"/>
    <ellipse cx="92" cy="120" rx="3" ry="1" fill="#8B4513"/>
    <ellipse cx="108" cy="120" rx="3" ry="1" fill="#8B4513"/>
    
    <!-- Boca -->
    <path d="M 97 125 Q 100 127 103 125" stroke="#8B0000" stroke-width="1" fill="none"/>
    
    <!-- Corbatín -->
    <polygon points="95,135 105,135 102,140 98,140" fill="#000"/>
    <circle cx="100" cy="137" r="1" fill="#FFD700"/>
    
    <!-- Detalles del traje -->
    <line x1="85" y1="150" x2="85" y2="180" stroke="#C0C0C0" stroke-width="1" opacity="0.5"/>
    <line x1="115" y1="150" x2="115" y2="180" stroke="#C0C0C0" stroke-width="1" opacity="0.5"/>
    
    <!-- Pañuelo en el bolsillo -->
    <rect x="108" y="145" width="6" height="4" fill="#FFF" opacity="0.8"/>
    <path d="M 108 145 Q 111 143 114 145" stroke="#C0C0C0" stroke-width="0.5" fill="none"/>
    
    <!-- Animación de elegancia -->
    <g v-if="animated" class="elegance-animation">
      <circle cx="100" cy="115" r="20" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3"/>
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
  animation: gentleman-glow 3s ease-in-out infinite;
}

@keyframes gentleman-glow {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.02);
  }
}
</style>