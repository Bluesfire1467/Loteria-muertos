// Utilidades para la aplicación de Lotería Día de Muertos

/**
 * Genera un ID único para elementos del juego
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Mezcla un array usando el algoritmo Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Formatea tiempo en formato MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// ============================================================================
// STORAGE AND PERSISTENCE UTILITIES
// ============================================================================

export {
  StorageManager,
  storageManager,
  saveData,
  loadData,
  removeData,
  dataExists
} from './storage'

export {
  DataMigrationManager,
  dataMigrationManager,
  performStartupMigration,
  checkMigrationNeeded,
  getVersionInfo,
  CURRENT_DATA_VERSION,
  MIN_SUPPORTED_VERSION
} from './dataMigration'

// ============================================================================
// BOT MANAGEMENT UTILITIES
// ============================================================================

export {
  BotManager,
  botManager,
  createDefaultBots,
  getDifficultySettings,
  getRandomBotPersonality,
  getRandomBotName,
  BOT_NAMES,
  BOT_PERSONALITIES,
  DIFFICULTY_SETTINGS,
  BOT_CONFIGURATION
} from './botManager'

export {
  AdaptiveAIManager,
  adaptiveAI,
  autoAdjustDifficulty,
  getRecommendedDifficulty,
  isPlayerReadyForChallenge,
  doesPlayerNeedHelp
} from './adaptiveAI'

export {
  BotAnimationManager,
  botAnimationManager,
  celebrateBotAction,
  registerBotForAnimations,
  unregisterBotFromAnimations,
  getRandomCelebrationPhrase,
  isAnimationSupported,
  getCelebrationConfig
} from './botAnimations'

// ============================================================================
// CANTOR (CARD CALLING) UTILITIES
// ============================================================================

export {
  CantorManager,
  cantor,
  CANTOR_PRESETS,
  type CantorConfig,
  type CantorState,
  type CantorPreset
} from './cantor'

// ============================================================================
// AUDIO MANAGEMENT UTILITIES
// ============================================================================

export {
  AudioManager,
  audioManager,
  initializeAudio,
  type AudioTrack,
  type AudioManagerOptions
} from './audioManager'

export {
  MexicanAudioManager,
  mexicanAudioManager,
  playMexicanMusic,
  narrateCard,
  playCulturalEffect,
  celebrateVictory,
  preloadMexicanAudio,
  type MexicanAudioTrack,
  type CardNarration
} from './mexicanAudioManager'

export {
  AudioSynthesizer,
  audioSynthesizer
} from './audioSynthesizer'