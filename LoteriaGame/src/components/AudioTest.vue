<template>
  <div class="audio-test">
    <h2>🔊 Prueba de Audio</h2>
    <p>Haz clic en los botones para probar los sonidos sintéticos:</p>
    
    <div class="test-buttons">
      <button @click="testClick" class="test-btn">
        🖱️ Click
      </button>
      
      <button @click="testCardMark" class="test-btn">
        ✅ Marcar Carta
      </button>
      
      <button @click="testError" class="test-btn">
        ❌ Error
      </button>
      
      <button @click="testVictory" class="test-btn">
        🏆 Victoria
      </button>
      
      <button @click="testBell" class="test-btn">
        🔔 Campana
      </button>
      
      <button @click="testTrumpet" class="test-btn">
        🎺 Trompeta
      </button>
      
      <button @click="testGuitar" class="test-btn">
        🎸 Guitarra
      </button>
      
      <button @click="testMaracas" class="test-btn">
        🥁 Maracas
      </button>
      
      <button @click="testGrito" class="test-btn">
        🗣️ Grito
      </button>
    </div>

    <div class="audio-info">
      <p><strong>Estado del sintetizador:</strong> 
        <span :class="{ 'status-ok': synthAvailable, 'status-error': !synthAvailable }">
          {{ synthAvailable ? '✅ Disponible' : '❌ No disponible' }}
        </span>
      </p>
      
      <p><strong>Nota:</strong> Los sonidos son sintéticos generados por código. 
      En la versión final, estos serán reemplazados por archivos de audio auténticos.</p>
    </div>

    <div class="mexican-audio-test">
      <h3>🇲🇽 Prueba de Audio Mexicano</h3>
      <div class="mexican-buttons">
        <button @click="testMexicanEffect('mariachi-trumpet')" class="test-btn mexican-btn">
          🎺 Mariachi
        </button>
        
        <button @click="testMexicanEffect('guitar-strum')" class="test-btn mexican-btn">
          🎸 Guitarra Mexicana
        </button>
        
        <button @click="testMexicanEffect('grito-mexicano')" class="test-btn mexican-btn">
          🗣️ Grito Mexicano
        </button>
        
        <button @click="testMexicanEffect('loteria-call')" class="test-btn mexican-btn">
          📢 ¡Lotería!
        </button>
        
        <button @click="testCardNarration" class="test-btn mexican-btn">
          🎭 Narrar Carta
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { audioSynthesizer } from '@/utils/audioSynthesizer'
import { useMexicanAudio } from '@/composables/useMexicanAudio'
import { LOTERIA_CARDS } from '@/data/loteriaCards'

const synthAvailable = ref(false)

// Composable de audio mexicano
const { playCulturalSound, playCardName } = useMexicanAudio()

// Funciones de prueba para sonidos sintéticos básicos
const testClick = () => audioSynthesizer.playClickSound()
const testCardMark = () => audioSynthesizer.playCardMarkSound()
const testError = () => audioSynthesizer.playErrorSound()
const testVictory = () => audioSynthesizer.playVictorySound()
const testBell = () => audioSynthesizer.playBellSound()
const testTrumpet = () => audioSynthesizer.playTrumpetSound()
const testGuitar = () => audioSynthesizer.playGuitarSound()
const testMaracas = () => audioSynthesizer.playMaracasSound()
const testGrito = () => audioSynthesizer.playGritoSound()

// Funciones de prueba para audio mexicano
const testMexicanEffect = async (effectId: string) => {
  console.log(`Probando efecto mexicano: ${effectId}`)
  await playCulturalSound(effectId, 0.8)
}

const testCardNarration = async () => {
  // Probar con la primera carta (La Muerte)
  const firstCard = LOTERIA_CARDS[0]
  console.log(`Probando narración de carta: ${firstCard.name}`)
  await playCardName(firstCard.id)
}

onMounted(() => {
  synthAvailable.value = audioSynthesizer.isAvailable()
  console.log('AudioTest montado, sintetizador disponible:', synthAvailable.value)
})
</script>

<style scoped>
.audio-test {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #ff6b35 0%, #7209b7 100%);
  border-radius: 16px;
  color: white;
  font-family: Arial, sans-serif;
}

.audio-test h2 {
  text-align: center;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.audio-test p {
  text-align: center;
  margin-bottom: 24px;
  opacity: 0.9;
}

.test-buttons, .mexican-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.test-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.test-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mexican-btn {
  background: rgba(255, 210, 63, 0.3);
  border-color: #FFD23F;
}

.mexican-btn:hover {
  background: rgba(255, 210, 63, 0.5);
  border-color: #FFD23F;
}

.audio-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.audio-info p {
  margin: 8px 0;
  text-align: left;
}

.status-ok {
  color: #06ffa5;
  font-weight: 600;
}

.status-error {
  color: #ff006e;
  font-weight: 600;
}

.mexican-audio-test {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.mexican-audio-test h3 {
  margin: 0 0 16px 0;
  text-align: center;
  color: #FFD23F;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .test-buttons, .mexican-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .test-btn {
    font-size: 0.8rem;
    padding: 10px 12px;
  }
}
</style>