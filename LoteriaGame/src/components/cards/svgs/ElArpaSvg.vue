<template>
  <g class="el-arpa-svg">
    <!-- Marco principal del arpa -->
    <path d="M 80 200 Q 85 120 90 100 Q 95 90 105 95 Q 115 100 120 120 L 125 200 Z" fill="#8B4513"/>
    <path d="M 80 200 Q 85 125 90 105 Q 95 95 105 100 Q 115 105 120 125 L 125 200 Z" fill="#A0522D" opacity="0.8"/>
    
    <!-- Columna principal -->
    <rect x="88" y="100" width="8" height="100" fill="#654321" rx="4"/>
    <rect x="90" y="100" width="4" height="100" fill="#8B4513" rx="2"/>
    
    <!-- Caja de resonancia -->
    <ellipse cx="102" cy="180" rx="18" ry="25" fill="#DAA520"/>
    <ellipse cx="102" cy="180" rx="15" ry="22" fill="#FFD700" opacity="0.8"/>
    
    <!-- Agujero de sonido -->
    <ellipse cx="102" cy="175" rx="4" ry="6" fill="#8B4513"/>
    <ellipse cx="102" cy="175" rx="2" ry="4" fill="#654321"/>
    
    <!-- Cuerdas del arpa -->
    <line x1="95" y1="110" x2="110" y2="160" stroke="#C0C0C0" stroke-width="0.8"/>
    <line x1="95" y1="115" x2="112" y2="165" stroke="#C0C0C0" stroke-width="0.8"/>
    <line x1="95" y1="120" x2="114" y2="170" stroke="#C0C0C0" stroke-width="0.8"/>
    <line x1="95" y1="125" x2="116" y2="175" stroke="#C0C0C0" stroke-width="0.8"/>
    <line x1="95" y1="130" x2="118" y2="180" stroke="#C0C0C0" stroke-width="0.8"/>
    <line x1="95" y1="135" x2="120" y2="185" stroke="#C0C0C0" stroke-width="0.8"/>
    <line x1="95" y1="140" x2="122" y2="190" stroke="#C0C0C0" stroke-width="0.8"/>
    <line x1="95" y1="145" x2="124" y2="195" stroke="#C0C0C0" stroke-width="0.8"/>
    
    <!-- Clavijas de afinación -->
    <circle cx="93" cy="110" r="1.5" fill="#8B4513"/>
    <circle cx="93" cy="115" r="1.5" fill="#8B4513"/>
    <circle cx="93" cy="120" r="1.5" fill="#8B4513"/>
    <circle cx="93" cy="125" r="1.5" fill="#8B4513"/>
    <circle cx="93" cy="130" r="1.5" fill="#8B4513"/>
    <circle cx="93" cy="135" r="1.5" fill="#8B4513"/>
    <circle cx="93" cy="140" r="1.5" fill="#8B4513"/>
    <circle cx="93" cy="145" r="1.5" fill="#8B4513"/>
    
    <!-- Decoraciones doradas -->
    <ellipse cx="102" cy="120" rx="8" ry="4" fill="#FFD700" opacity="0.6"/>
    <circle cx="98" cy="118" r="1" fill="#DAA520"/>
    <circle cx="106" cy="118" r="1" fill="#DAA520"/>
    <circle cx="102" cy="115" r="1" fill="#DAA520"/>
    
    <!-- Base del arpa -->
    <ellipse cx="102" cy="200" rx="20" ry="6" fill="#8B4513"/>
    <ellipse cx="102" cy="198" rx="20" ry="6" fill="#A0522D" opacity="0.8"/>
    
    <!-- Detalles ornamentales -->
    <path d="M 95 105 Q 102 100 109 105" stroke="#FFD700" stroke-width="1" fill="none"/>
    <circle cx="102" cy="102" r="2" fill="#FFD700"/>
    
    <!-- Volutas decorativas -->
    <path d="M 88 105 Q 85 102 88 99 Q 91 102 88 105" stroke="#DAA520" stroke-width="1" fill="none"/>
    <path d="M 116 105 Q 119 102 116 99 Q 113 102 116 105" stroke="#DAA520" stroke-width="1" fill="none"/>
    
    <!-- Sombra -->
    <ellipse cx="105" cy="205" rx="25" ry="4" fill="#000" opacity="0.2"/>
    
    <!-- Notas musicales flotantes -->
    <g class="musical-notes" opacity="0.6">
      <circle cx="130" cy="120" r="2" fill="#4169E1"/>
      <rect x="132" y="115" width="1" height="8" fill="#4169E1"/>
      <path d="M 133 115 Q 136 113 138 115" stroke="#4169E1" stroke-width="1" fill="none"/>
      
      <circle cx="140" cy="140" r="1.5" fill="#9370DB"/>
      <rect x="141.5" y="136" width="1" height="6" fill="#9370DB"/>
      
      <circle cx="125" cy="160" r="1.5" fill="#FF69B4"/>
      <rect x="126.5" y="156" width="1" height="6" fill="#FF69B4"/>
    </g>
    
    <!-- Animación de cuerdas -->
    <g v-if="animated" class="string-animation">
      <line x1="95" y1="125" x2="116" y2="175" stroke="#FFD700" stroke-width="0.5" opacity="0.4"/>
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
.string-animation {
  animation: string-vibration 2s ease-in-out infinite;
}

@keyframes string-vibration {
  0%, 100% { 
    transform: translateX(0);
    opacity: 0.4;
  }
  50% { 
    transform: translateX(0.5px);
    opacity: 0.7;
  }
}

.musical-notes {
  animation: notes-float 4s ease-in-out infinite;
}

@keyframes notes-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
</style>