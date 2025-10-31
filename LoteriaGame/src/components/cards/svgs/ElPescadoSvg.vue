<template>
  <g class="el-pescado-svg">
    <!-- Cuerpo del pescado -->
    <ellipse cx="100" cy="150" rx="35" ry="20" fill="#4682B4"/>
    <ellipse cx="100" cy="150" rx="32" ry="17" fill="#5F9EA0" opacity="0.8"/>
    
    <!-- Cabeza -->
    <ellipse cx="75" cy="150" rx="15" ry="18" fill="#4682B4"/>
    <ellipse cx="75" cy="150" rx="12" ry="15" fill="#5F9EA0" opacity="0.8"/>
    
    <!-- Ojo -->
    <circle cx="70" cy="145" r="6" fill="#FFF"/>
    <circle cx="70" cy="145" r="4" fill="#000"/>
    <circle cx="71" cy="144" r="1" fill="#FFF"/>
    
    <!-- Boca -->
    <ellipse cx="60" cy="150" rx="4" ry="2" fill="#000"/>
    
    <!-- Cola -->
    <path d="M 135 150 L 155 140 L 160 150 L 155 160 L 135 150" fill="#4682B4"/>
    <path d="M 135 150 L 152 142 L 155 150 L 152 158 L 135 150" fill="#5F9EA0" opacity="0.8"/>
    
    <!-- Aletas -->
    <!-- Aleta dorsal -->
    <path d="M 85 130 Q 100 125 115 130 Q 110 135 100 138 Q 90 135 85 130" fill="#4682B4"/>
    <path d="M 85 130 Q 100 127 115 130 Q 110 133 100 135 Q 90 133 85 130" fill="#87CEEB" opacity="0.7"/>
    
    <!-- Aleta ventral -->
    <path d="M 85 170 Q 100 175 115 170 Q 110 165 100 162 Q 90 165 85 170" fill="#4682B4"/>
    <path d="M 85 170 Q 100 173 115 170 Q 110 167 100 165 Q 90 167 85 170" fill="#87CEEB" opacity="0.7"/>
    
    <!-- Aletas pectorales -->
    <ellipse cx="80" cy="140" rx="8" ry="4" fill="#4682B4" transform="rotate(-30 80 140)"/>
    <ellipse cx="80" cy="160" rx="8" ry="4" fill="#4682B4" transform="rotate(30 80 160)"/>
    
    <!-- Escamas -->
    <g class="scales">
      <circle cx="90" cy="145" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="100" cy="140" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="110" cy="145" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="120" cy="150" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="90" cy="155" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="100" cy="160" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="110" cy="155" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="95" cy="150" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="105" cy="150" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="115" cy="140" r="2" fill="#87CEEB" opacity="0.6"/>
      <circle cx="115" cy="160" r="2" fill="#87CEEB" opacity="0.6"/>
    </g>
    
    <!-- Línea lateral -->
    <path d="M 75 150 Q 100 148 125 150" stroke="#B0C4DE" stroke-width="1" fill="none"/>
    
    <!-- Burbujas de agua -->
    <circle cx="50" cy="130" r="3" fill="#87CEEB" opacity="0.6"/>
    <circle cx="45" cy="120" r="2" fill="#87CEEB" opacity="0.5"/>
    <circle cx="40" cy="110" r="1.5" fill="#87CEEB" opacity="0.4"/>
    <circle cx="55" cy="115" r="2.5" fill="#87CEEB" opacity="0.5"/>
    
    <circle cx="150" cy="120" r="2" fill="#87CEEB" opacity="0.5"/>
    <circle cx="155" cy="110" r="1.5" fill="#87CEEB" opacity="0.4"/>
    <circle cx="160" cy="100" r="1" fill="#87CEEB" opacity="0.3"/>
    
    <!-- Ondas de agua -->
    <path d="M 30 180 Q 60 175 90 180 Q 120 185 150 180 Q 180 175 210 180" stroke="#4682B4" stroke-width="2" fill="none" opacity="0.4"/>
    <path d="M 30 190 Q 60 185 90 190 Q 120 195 150 190 Q 180 185 210 190" stroke="#87CEEB" stroke-width="2" fill="none" opacity="0.3"/>
    
    <!-- Algas en el fondo -->
    <path d="M 40 200 Q 45 190 50 200 Q 55 185 60 200" stroke="#228B22" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M 140 200 Q 145 190 150 200 Q 155 185 160 200" stroke="#228B22" stroke-width="2" fill="none" opacity="0.6"/>
    
    <!-- Animación de natación -->
    <g v-if="animated" class="swimming-animation">
      <ellipse cx="100" cy="150" rx="40" ry="25" fill="none" stroke="#87CEEB" stroke-width="1" opacity="0.3"/>
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
  animation: fish-swim 3s ease-in-out infinite;
}

@keyframes fish-swim {
  0%, 100% { 
    transform: translateX(0) rotate(0deg);
  }
  50% { 
    transform: translateX(2px) rotate(1deg);
  }
}

.scales {
  animation: scale-shimmer 4s ease-in-out infinite;
}

@keyframes scale-shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
}
</style>