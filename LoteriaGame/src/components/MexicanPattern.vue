<template>
  <div 
    class="mexican-pattern"
    :class="[
      `pattern-${pattern}`,
      `intensity-${intensity}`,
      { 'animated': animated }
    ]"
    :style="patternStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  pattern?: 'aztec' | 'talavera' | 'sarape' | 'geometric' | 'floral';
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
  colors?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  pattern: 'aztec',
  intensity: 'subtle',
  animated: false,
  colors: () => ['var(--primary-orange)', 'var(--accent-gold)', 'var(--secondary-purple)']
});

const patternStyle = computed(() => {
  const [color1, color2, color3] = props.colors;
  
  const patterns = {
    aztec: {
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          ${color1} 0px,
          ${color1} 4px,
          transparent 4px,
          transparent 12px
        ),
        repeating-linear-gradient(
          -45deg,
          ${color2} 0px,
          ${color2} 4px,
          transparent 4px,
          transparent 12px
        ),
        repeating-linear-gradient(
          90deg,
          ${color3} 0px,
          ${color3} 2px,
          transparent 2px,
          transparent 20px
        )
      `,
      backgroundSize: '24px 24px, 24px 24px, 40px 40px'
    },
    
    talavera: {
      backgroundImage: `
        radial-gradient(circle at 25% 25%, ${color1} 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, ${color2} 2px, transparent 2px),
        radial-gradient(circle at 25% 75%, ${color3} 1px, transparent 1px),
        radial-gradient(circle at 75% 25%, ${color1} 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px, 20px 20px, 15px 15px, 15px 15px',
      backgroundPosition: '0 0, 10px 10px, 5px 5px, 15px 15px'
    },
    
    sarape: {
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          ${color1} 0px,
          ${color1} 3px,
          ${color2} 3px,
          ${color2} 6px,
          ${color3} 6px,
          ${color3} 9px,
          ${color2} 9px,
          ${color2} 12px
        )
      `,
      backgroundSize: '100% 24px'
    },
    
    geometric: {
      backgroundImage: `
        polygon(50% 0%, 0% 100%, 100% 100%)
      `,
      background: `
        conic-gradient(
          from 0deg at 50% 50%,
          ${color1} 0deg,
          ${color2} 120deg,
          ${color3} 240deg,
          ${color1} 360deg
        )
      `,
      backgroundSize: '30px 30px'
    },
    
    floral: {
      backgroundImage: `
        radial-gradient(circle at 50% 50%, ${color1} 3px, transparent 3px),
        radial-gradient(circle at 25% 25%, ${color2} 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, ${color3} 2px, transparent 2px),
        radial-gradient(circle at 25% 75%, ${color2} 1px, transparent 1px),
        radial-gradient(circle at 75% 25%, ${color3} 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px, 30px 30px, 30px 30px, 20px 20px, 20px 20px',
      backgroundPosition: '0 0, 10px 10px, 20px 20px, 5px 15px, 15px 5px'
    }
  };
  
  const intensityOpacity = {
    subtle: 0.05,
    medium: 0.1,
    strong: 0.2
  };
  
  return {
    ...patterns[props.pattern],
    opacity: intensityOpacity[props.intensity]
  };
});
</script>

<style scoped>
.mexican-pattern {
  position: relative;
  width: 100%;
  height: 100%;
}

.mexican-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: inherit;
  background-size: inherit;
  background-position: inherit;
  opacity: inherit;
  pointer-events: none;
  z-index: -1;
}

.animated::before {
  animation: pattern-shift 20s linear infinite;
}

.pattern-aztec.animated::before {
  animation: aztec-dance 15s ease-in-out infinite;
}

.pattern-sarape.animated::before {
  animation: sarape-wave 12s ease-in-out infinite;
}

.pattern-talavera.animated::before {
  animation: talavera-spin 25s linear infinite;
}

.pattern-geometric.animated::before {
  animation: geometric-pulse 8s ease-in-out infinite;
}

.pattern-floral.animated::before {
  animation: floral-bloom 18s ease-in-out infinite;
}

@keyframes pattern-shift {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 100px;
  }
}

@keyframes aztec-dance {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(2px) translateY(-1px);
  }
  50% {
    transform: translateX(0) translateY(-2px);
  }
  75% {
    transform: translateX(-2px) translateY(-1px);
  }
}

@keyframes sarape-wave {
  0%, 100% {
    background-position: 0 0;
  }
  50% {
    background-position: 0 -10px;
  }
}

@keyframes talavera-spin {
  0% {
    background-position: 0 0, 10px 10px, 5px 5px, 15px 15px;
  }
  100% {
    background-position: 20px 20px, 30px 30px, 25px 25px, 35px 35px;
  }
}

@keyframes geometric-pulse {
  0%, 100% {
    opacity: inherit;
    transform: scale(1);
  }
  50% {
    opacity: calc(var(--intensity-opacity) * 1.5);
    transform: scale(1.02);
  }
}

@keyframes floral-bloom {
  0%, 100% {
    background-size: 40px 40px, 30px 30px, 30px 30px, 20px 20px, 20px 20px;
  }
  50% {
    background-size: 45px 45px, 35px 35px, 35px 35px, 25px 25px, 25px 25px;
  }
}

/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  .animated::before {
    animation: none;
  }
}
</style>