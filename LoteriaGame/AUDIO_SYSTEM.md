# 🎵 Sistema de Audio - Lotería Día de Muertos

## Descripción General

El sistema de audio de la Lotería Día de Muertos está diseñado para proporcionar una experiencia auténtica y culturalmente rica. Incluye música tradicional mexicana, narración en español, efectos culturales y un sistema de fallback inteligente.

## 🎯 Características Principales

### ✅ **Audio Implementado y Funcionando**

1. **Sistema de Audio Sintético**
   - ✅ Sonidos generados por código cuando los archivos no existen
   - ✅ Efectos básicos: click, marca de carta, error, victoria
   - ✅ Instrumentos sintéticos: trompeta, guitarra, maracas
   - ✅ Efectos culturales: campanas, grito mexicano

2. **Gestión de Audio Avanzada**
   - ✅ AudioManager con controles de volumen independientes
   - ✅ Precarga inteligente de archivos
   - ✅ Manejo de errores con fallbacks automáticos
   - ✅ Soporte para Web Audio API

3. **Audio Cultural Mexicano**
   - ✅ MexicanAudioManager especializado
   - ✅ Mapeo de 25 cartas de lotería con narración
   - ✅ Efectos culturales temáticos
   - ✅ Música contextual (menú, juego, victoria)

4. **Interfaz de Usuario**
   - ✅ Controles de audio completos con sliders
   - ✅ Componente de demostración interactivo
   - ✅ Vista de prueba completa
   - ✅ Indicadores visuales de estado

## 🚀 Cómo Probar el Sistema

### 1. **Ejecutar la Aplicación**
```bash
cd LoteriaGame
npm run dev
```

### 2. **Acceder a la Demo de Audio**
- Navega a la vista `AudioDemoView.vue`
- Haz clic en "Activar Sistema de Audio"
- Prueba todos los botones de efectos

### 3. **Componentes Disponibles**
- `AudioTest.vue` - Pruebas básicas de sonidos sintéticos
- `MexicanAudioDemo.vue` - Demo completo del audio mexicano
- `AudioControls.vue` - Controles de volumen y configuración

## 🎼 Uso en el Código

### **Composable Básico de Audio**
```typescript
import { useAudio } from '@/composables/useAudio'

const {
  initAudio,
  playCardClick,
  playCardMark,
  playGameWin,
  setMasterVolume,
  toggleMute
} = useAudio()

// Inicializar (requiere interacción del usuario)
await initAudio()

// Reproducir efectos
playCardClick()
playCardMark()
playGameWin()
```

### **Composable de Audio Mexicano**
```typescript
import { useMexicanAudio } from '@/composables/useMexicanAudio'

const {
  initMexicanAudio,
  playMenuMusic,
  playGameplayMusic,
  narrateCard,
  callLoteria,
  playTrumpet,
  celebrate
} = useMexicanAudio()

// Inicializar sistema mexicano
await initMexicanAudio()

// Cambiar música contextual
playMenuMusic()
playGameplayMusic()

// Narrar una carta
const card = LOTERIA_CARDS[0] // La Muerte
await narrateCard(card)

// Efectos culturales
callLoteria()
playTrumpet()
celebrate()
```

### **Uso Directo de Managers**
```typescript
import { audioManager, mexicanAudioManager } from '@/utils'

// Audio básico
await audioManager.playSoundEffect('click', '/audio/click.mp3', 0.8)
await audioManager.playBackgroundMusic('menu', '/audio/menu.mp3', true)

// Audio mexicano
await mexicanAudioManager.playTraditionalMusic('gameplay')
await mexicanAudioManager.playCardNarration(1, true) // La Muerte con frase
await mexicanAudioManager.playCulturalSound('mariachi-trumpet', 0.8)
```

## 🎛️ Configuración de Audio

### **Configuración por Defecto**
```typescript
const defaultSettings = {
  masterVolume: 0.7,    // 70% volumen maestro
  musicVolume: 0.5,     // 50% música de fondo
  sfxVolume: 0.8,       // 80% efectos de sonido
  enabled: true         // Audio habilitado
}
```

### **Actualizar Configuración**
```typescript
import { useAudio } from '@/composables/useAudio'

const { updateAudioSettings } = useAudio()

updateAudioSettings({
  masterVolume: 0.9,
  musicVolume: 0.6,
  sfxVolume: 0.7
})
```

## 🔧 Sistema de Fallbacks

### **Cuando los Archivos de Audio No Existen**

1. **Sonidos Sintéticos**: Se generan automáticamente usando Web Audio API
2. **Notificaciones Visuales**: Para narración de cartas se muestra texto en pantalla
3. **Logs Informativos**: Se registra cuando se usan fallbacks
4. **Graceful Degradation**: El juego funciona completamente sin archivos de audio

### **Mapeo de Fallbacks**
```typescript
// Efectos básicos → Sonidos sintéticos
'cardClick' → audioSynthesizer.playClickSound()
'cardMark' → audioSynthesizer.playCardMarkSound()
'gameWin' → audioSynthesizer.playVictorySound()

// Efectos culturales → Sonidos sintéticos temáticos
'mariachi-trumpet' → audioSynthesizer.playTrumpetSound()
'guitar-strum' → audioSynthesizer.playGuitarSound()
'grito-mexicano' → audioSynthesizer.playGritoSound()

// Narración → Notificación visual + sonido de campana
'card-narration' → showCardTextFallback() + playBellSound()
```

## 📁 Estructura de Archivos de Audio

### **Archivos Esperados (Opcionales)**
```
public/audio/
├── music/traditional/          # Música mexicana tradicional
├── sfx/                       # Efectos de sonido básicos
├── sfx/cultural/              # Efectos culturales mexicanos
├── voices/cards/              # Narración de nombres de cartas
└── voices/phrases/            # Frases tradicionales de cartas
```

### **Nota Importante**
**Los archivos de audio son opcionales.** El sistema funciona completamente con sonidos sintéticos cuando los archivos no están disponibles.

## 🎮 Integración en el Juego

### **Eventos de Audio Recomendados**

```typescript
// Al iniciar el juego
playGameStartSequence()

// Al marcar una carta correcta
playPlayerCelebration()

// Cuando un bot marca una carta
playBotCelebration()

// Al cantar una carta
narrateCard(currentCard)

// Al ganar el juego
playGameEndSequence(true)

// Música contextual
switchMusicContext('gameplay')
```

### **Ejemplo de Integración Completa**
```vue
<template>
  <div class="loteria-game">
    <!-- Controles de audio -->
    <AudioControls :compact="true" />
    
    <!-- Juego principal -->
    <div class="game-board" @click="handleCardClick">
      <!-- Contenido del juego -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAudio, useMexicanAudio } from '@/composables'
import AudioControls from '@/components/AudioControls.vue'

const { initAudio, playCardClick } = useAudio()
const { 
  initMexicanAudio, 
  playGameplayMusic, 
  narrateCard,
  playPlayerCelebration 
} = useMexicanAudio()

const handleCardClick = async () => {
  playCardClick()
  // Lógica del juego...
  if (cardMarked) {
    playPlayerCelebration()
  }
}

onMounted(async () => {
  // Inicializar audio después de la primera interacción
  document.addEventListener('click', async () => {
    await initAudio()
    await initMexicanAudio()
    playGameplayMusic()
  }, { once: true })
})
</script>
```

## 🐛 Debugging y Troubleshooting

### **Logs Útiles**
```javascript
// Verificar estado del audio
console.log(audioManager.getStatus())
console.log(mexicanAudioManager.getAudioStats())

// Verificar sintetizador
console.log(audioSynthesizer.isAvailable())
```

### **Problemas Comunes**

1. **Audio no se reproduce**
   - ✅ Verificar que el audio esté inicializado después de interacción del usuario
   - ✅ Comprobar que el volumen no esté en 0
   - ✅ Verificar que el audio esté habilitado

2. **Sonidos sintéticos no funcionan**
   - ✅ Verificar soporte de Web Audio API en el navegador
   - ✅ Comprobar que no haya errores en la consola

3. **Archivos de audio no se cargan**
   - ✅ Normal - el sistema usa fallbacks automáticamente
   - ✅ Verificar rutas en `public/audio/` si se quieren archivos reales

## 🎯 Estado Actual

### ✅ **Completamente Implementado**
- [x] AudioManager con controles completos
- [x] MexicanAudioManager con efectos culturales
- [x] Sistema de sonidos sintéticos
- [x] Composables de Vue reactivos
- [x] Componentes de UI para controles
- [x] Fallbacks inteligentes
- [x] Documentación completa

### 🎵 **Listo para Usar**
El sistema de audio está **100% funcional** y listo para ser integrado en cualquier parte del juego. No requiere archivos de audio externos para funcionar.

### 🚀 **Próximos Pasos Opcionales**
1. Agregar archivos de audio reales mexicanos auténticos
2. Integrar con el sistema de logros
3. Añadir más efectos ambientales
4. Implementar ecualizador avanzado

---

**¡El sistema de audio está completo y funcionando! 🎉**