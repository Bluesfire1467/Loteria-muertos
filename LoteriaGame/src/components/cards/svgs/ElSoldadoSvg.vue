<template>
  <g class="el-soldado-svg">
    <!-- Cuerpo/Uniforme -->
    <rect x="85" y="140" width="30" height="50" fill="#4B0082" rx="5"/>
    <rect x="85" y="140" width="30" height="50" fill="#6A5ACD" opacity="0.7" rx="5"/>
    
    <!-- Botones del uniforme -->
    <circle cx="100" cy="150" r="2" fill="#FFD700"/>
    <circle cx="100" cy="160" r="2" fill="#FFD700"/>
    <circle cx="100" cy="170" r="2" fill="#FFD700"/>
    
    <!-- Brazos -->
    <ellipse cx="75" cy="155" rx="8" ry="20" fill="#4B0082" transform="rotate(-15 75 155)"/>
    <ellipse cx="125" cy="155" rx="8" ry="20" fill="#4B0082" transform="rotate(15 125 155)"/>
    
    <!-- Manos -->
    <circle cx="70" cy="175" r="5" fill="#FDBCB4"/>
    <circle cx="130" cy="175" r="5" fill="#FDBCB4"/>
    
    <!-- Rifle -->
    <rect x="132" y="120" width="3" height="40" fill="#8B4513"/>
    <rect x="130" y="115" width="7" height="8" fill="#2F4F4F"/>
    <circle cx="133" cy="119" r="1" fill="#000"/>
    
    <!-- Piernas -->
    <rect x="90" y="190" width="8" height="25" fill="#4B0082"/>
    <rect x="102" y="190" width="8" height="25" fill="#4B0082"/>
    
    <!-- Botas -->
    <rect x="88" y="215" width="12" height="8" fill="#000" rx="2"/>
    <rect x="100" y="215" width="12" height="8" fill="#000" rx="2"/>
    
    <!-- Cuello -->
    <rect x="95" y="130" width="10" height="8" fill="#FDBCB4"/>
    
    <!-- Cabeza -->
    <circle cx="100" cy="115" r="15" fill="#FDBCB4"/>
    
    <!-- Gorra militar -->
    <ellipse cx="100" cy="105" rx="18" ry="12" fill="#4B0082"/>
    <ellipse cx="100" cy="100" rx="15" ry="8" fill="#6A5ACD"/>
    <rect x="85" y="108" width="30" height="3" fill="#FFD700"/>
    
    <!-- Insignia en la gorra -->
    <circle cx="100" cy="102" r="3" fill="#FFD700"/>
    <polygon points="100,99 102,104 98,104" fill="#8B0000"/>
    
    <!-- Ojos -->
    <circle cx="96" cy="112" r="2" fill="#000"/>
    <circle cx="104" cy="112" r="2" fill="#000"/>
    <circle cx="97" cy="111" r="1" fill="#FFF"/>
    <circle cx="105" cy="111" r="1" fill="#FFF"/>
    
    <!-- Nariz -->
    <ellipse cx="100" cy="118" rx="1" ry="2" fill="#F4A460"/>
    
    <!-- Boca seria -->
    <line x1="97" y1="122" x2="103" y2="122" stroke="#8B0000" stroke-width="1.5"/>
    
    <!-- Bigote -->
    <ellipse cx="100" cy="120" rx="4" ry="1" fill="#8B4513"/>
    
    <!-- Charreteras -->
    <rect x="82" y="140" width="6" height="4" fill="#FFD700"/>
    <rect x="112" y="140" width="6" height="4" fill="#FFD700"/>
    
    <!-- Cinturón -->
    <rect x="85" y="175" width="30" height="4" fill="#8B4513"/>
    <rect x="98" y="173" width="4" height="8" fill="#FFD700"/>
    
    <!-- Animación militar -->
    <g v-if="animated" class="military-animation">
      <rect x="83" y="138" width="34" height="54" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.3" rx="5"/>
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
.military-animation {
  animation: military-stance 2s ease-in-out infinite;
}

@keyframes military-stance {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1px); }
}
</style>