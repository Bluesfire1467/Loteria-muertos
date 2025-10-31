<template>
  <g class="la-rana-svg">
    <!-- Cuerpo de la rana -->
    <ellipse cx="100" cy="160" rx="25" ry="20" fill="#228B22"/>
    <ellipse cx="100" cy="160" rx="22" ry="17" fill="#32CD32" opacity="0.8"/>
    
    <!-- Cabeza -->
    <ellipse cx="100" cy="130" rx="20" ry="18" fill="#228B22"/>
    <ellipse cx="100" cy="130" rx="17" ry="15" fill="#32CD32" opacity="0.8"/>
    
    <!-- Ojos saltones -->
    <circle cx="90" cy="120" r="8" fill="#228B22"/>
    <circle cx="110" cy="120" r="8" fill="#228B22"/>
    <circle cx="90" cy="120" r="6" fill="#ADFF2F"/>
    <circle cx="110" cy="120" r="6" fill="#ADFF2F"/>
    <circle cx="90" cy="118" r="4" fill="#000"/>
    <circle cx="110" cy="118" r="4" fill="#000"/>
    <circle cx="91" cy="117" r="1" fill="#FFF"/>
    <circle cx="111" cy="117" r="1" fill="#FFF"/>
    
    <!-- Boca -->
    <path d="M 85 140 Q 100 150 115 140" stroke="#006400" stroke-width="3" fill="none"/>
    <ellipse cx="100" cy="142" rx="12" ry="4" fill="#228B22"/>
    
    <!-- Lengua (opcional, asomando un poco) -->
    <ellipse cx="105" cy="145" rx="3" ry="1" fill="#FF69B4"/>
    
    <!-- Patas delanteras -->
    <ellipse cx="75" cy="155" rx="8" ry="12" fill="#228B22" transform="rotate(-30 75 155)"/>
    <ellipse cx="125" cy="155" rx="8" ry="12" fill="#228B22" transform="rotate(30 125 155)"/>
    <ellipse cx="75" cy="155" rx="6" ry="10" fill="#32CD32" transform="rotate(-30 75 155)" opacity="0.8"/>
    <ellipse cx="125" cy="155" rx="6" ry="10" fill="#32CD32" transform="rotate(30 125 155)" opacity="0.8"/>
    
    <!-- Patas traseras (más grandes) -->
    <ellipse cx="70" cy="175" rx="12" ry="18" fill="#228B22" transform="rotate(-45 70 175)"/>
    <ellipse cx="130" cy="175" rx="12" ry="18" fill="#228B22" transform="rotate(45 130 175)"/>
    <ellipse cx="70" cy="175" rx="10" ry="15" fill="#32CD32" transform="rotate(-45 70 175)" opacity="0.8"/>
    <ellipse cx="130" cy="175" rx="10" ry="15" fill="#32CD32" transform="rotate(45 130 175)" opacity="0.8"/>
    
    <!-- Dedos de las patas -->
    <!-- Pata delantera izquierda -->
    <circle cx="68" cy="165" r="2" fill="#228B22"/>
    <circle cx="65" cy="168" r="2" fill="#228B22"/>
    <circle cx="70" cy="170" r="2" fill="#228B22"/>
    
    <!-- Pata delantera derecha -->
    <circle cx="132" cy="165" r="2" fill="#228B22"/>
    <circle cx="135" cy="168" r="2" fill="#228B22"/>
    <circle cx="130" cy="170" r="2" fill="#228B22"/>
    
    <!-- Pata trasera izquierda -->
    <circle cx="60" cy="185" r="3" fill="#228B22"/>
    <circle cx="56" cy="188" r="3" fill="#228B22"/>
    <circle cx="62" cy="192" r="3" fill="#228B22"/>
    <circle cx="58" cy="195" r="3" fill="#228B22"/>
    
    <!-- Pata trasera derecha -->
    <circle cx="140" cy="185" r="3" fill="#228B22"/>
    <circle cx="144" cy="188" r="3" fill="#228B22"/>
    <circle cx="138" cy="192" r="3" fill="#228B22"/>
    <circle cx="142" cy="195" r="3" fill="#228B22"/>
    
    <!-- Manchas en la espalda -->
    <circle cx="95" cy="150" r="3" fill="#006400"/>
    <circle cx="108" cy="155" r="4" fill="#006400"/>
    <circle cx="90" cy="165" r="2" fill="#006400"/>
    <circle cx="110" cy="170" r="3" fill="#006400"/>
    
    <!-- Vientre más claro -->
    <ellipse cx="100" cy="165" rx="15" ry="12" fill="#90EE90" opacity="0.6"/>
    
    <!-- Hoja de nenúfar (opcional) -->
    <ellipse cx="100" cy="200" rx="30" ry="8" fill="#228B22" opacity="0.4"/>
    <ellipse cx="100" cy="200" rx="25" ry="6" fill="#32CD32" opacity="0.3"/>
    <line x1="85" y1="200" x2="115" y2="200" stroke="#006400" stroke-width="1" opacity="0.5"/>
    
    <!-- Animación de salto -->
    <g v-if="animated" class="jumping-animation">
      <ellipse cx="100" cy="140" rx="30" ry="25" fill="none" stroke="#ADFF2F" stroke-width="1" opacity="0.3"/>
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
.jumping-animation {
  animation: frog-jump 2s ease-in-out infinite;
}

@keyframes frog-jump {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
</style>