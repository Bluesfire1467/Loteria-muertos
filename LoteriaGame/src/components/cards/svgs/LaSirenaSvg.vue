<template>
  <g class="la-sirena-svg">
    <!-- Ondas de agua -->
    <path d="M 20 200 Q 50 195 80 200 Q 110 205 140 200 Q 170 195 200 200" stroke="#4682B4" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M 20 210 Q 50 205 80 210 Q 110 215 140 210 Q 170 205 200 210" stroke="#87CEEB" stroke-width="2" fill="none" opacity="0.4"/>
    
    <!-- Cola de sirena -->
    <path d="M 85 180 Q 100 190 115 180 Q 120 200 115 220 Q 100 235 85 220 Q 80 200 85 180" fill="#008B8B"/>
    <path d="M 85 180 Q 100 185 115 180 Q 118 195 115 215 Q 100 225 85 215 Q 82 195 85 180" fill="#20B2AA" opacity="0.8"/>
    
    <!-- Aleta de la cola -->
    <path d="M 85 220 Q 70 235 60 225 Q 75 230 85 220" fill="#008B8B"/>
    <path d="M 115 220 Q 130 235 140 225 Q 125 230 115 220" fill="#008B8B"/>
    <path d="M 85 220 Q 70 230 65 220 Q 75 225 85 220" fill="#4682B4" opacity="0.6"/>
    <path d="M 115 220 Q 130 230 135 220 Q 125 225 115 220" fill="#4682B4" opacity="0.6"/>
    
    <!-- Escamas en la cola -->
    <ellipse cx="95" cy="190" rx="3" ry="2" fill="#4682B4" opacity="0.7"/>
    <ellipse cx="105" cy="195" rx="3" ry="2" fill="#4682B4" opacity="0.7"/>
    <ellipse cx="90" cy="200" rx="3" ry="2" fill="#4682B4" opacity="0.7"/>
    <ellipse cx="110" cy="205" rx="3" ry="2" fill="#4682B4" opacity="0.7"/>
    
    <!-- Torso -->
    <ellipse cx="100" cy="150" rx="12" ry="25" fill="#FDBCB4"/>
    
    <!-- Sujetador de conchas -->
    <ellipse cx="95" cy="140" rx="8" ry="6" fill="#FFB6C1"/>
    <ellipse cx="105" cy="140" rx="8" ry="6" fill="#FFB6C1"/>
    <ellipse cx="95" cy="140" rx="6" ry="4" fill="#FFC0CB" opacity="0.8"/>
    <ellipse cx="105" cy="140" rx="6" ry="4" fill="#FFC0CB" opacity="0.8"/>
    
    <!-- Brazos -->
    <ellipse cx="80" cy="155" rx="6" ry="15" fill="#FDBCB4" transform="rotate(-20 80 155)"/>
    <ellipse cx="120" cy="155" rx="6" ry="15" fill="#FDBCB4" transform="rotate(20 120 155)"/>
    
    <!-- Manos -->
    <circle cx="75" cy="170" r="4" fill="#FDBCB4"/>
    <circle cx="125" cy="170" r="4" fill="#FDBCB4"/>
    
    <!-- Cuello -->
    <rect x="95" y="125" width="10" height="8" fill="#FDBCB4"/>
    
    <!-- Cabeza -->
    <circle cx="100" cy="115" r="15" fill="#FDBCB4"/>
    
    <!-- Cabello largo -->
    <path d="M 85 105 Q 100 85 115 105 Q 120 120 125 140 Q 115 145 105 140 Q 100 130 95 140 Q 85 145 75 140 Q 80 120 85 105" fill="#FFD700"/>
    <path d="M 85 105 Q 100 90 115 105 Q 118 115 120 130 Q 115 135 110 130 Q 105 125 100 130 Q 95 125 90 130 Q 85 135 80 130 Q 82 115 85 105" fill="#FFA500" opacity="0.8"/>
    
    <!-- Ojos -->
    <circle cx="96" cy="112" r="2" fill="#000"/>
    <circle cx="104" cy="112" r="2" fill="#000"/>
    <circle cx="97" cy="111" r="1" fill="#FFF"/>
    <circle cx="105" cy="111" r="1" fill="#FFF"/>
    
    <!-- Nariz -->
    <ellipse cx="100" cy="118" rx="1" ry="2" fill="#F4A460"/>
    
    <!-- Boca sonriente -->
    <path d="M 97 122 Q 100 125 103 122" stroke="#8B0000" stroke-width="1.5" fill="none"/>
    
    <!-- Collar de perlas -->
    <circle cx="95" cy="130" r="2" fill="#FFF"/>
    <circle cx="100" cy="132" r="2" fill="#FFF"/>
    <circle cx="105" cy="130" r="2" fill="#FFF"/>
    
    <!-- Burbujas de agua -->
    <circle cx="130" cy="120" r="2" fill="#87CEEB" opacity="0.6"/>
    <circle cx="140" cy="110" r="1.5" fill="#87CEEB" opacity="0.5"/>
    <circle cx="135" cy="100" r="1" fill="#87CEEB" opacity="0.4"/>
    <circle cx="70" cy="130" r="1.5" fill="#87CEEB" opacity="0.5"/>
    <circle cx="60" cy="115" r="1" fill="#87CEEB" opacity="0.4"/>
    
    <!-- Animación de natación -->
    <g v-if="animated" class="swimming-animation">
      <path d="M 20 205 Q 50 200 80 205 Q 110 210 140 205 Q 170 200 200 205" stroke="#4682B4" stroke-width="1" fill="none" opacity="0.3"/>
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
.swimming-animation {
  animation: water-flow 3s ease-in-out infinite;
}

@keyframes water-flow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}
</style>