// Tipos principales para la aplicación de Lotería Día de Muertos

// ============================================================================
// ENUMS
// ============================================================================

export enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  FINISHED = 'finished'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum PlayerType {
  HUMAN = 'human',
  BOT = 'bot'
}

export enum AchievementCategory {
  GAMEPLAY = 'gameplay',
  SEASONAL = 'seasonal',
  MILESTONE = 'milestone'
}

export enum CelebrationStyle {
  SUBTLE = 'subtle',
  ANIMATED = 'animated',
  ENTHUSIASTIC = 'enthusiastic'
}

// ============================================================================
// CORE GAME INTERFACES
// ============================================================================

export interface LoteriaCard {
  id: number
  name: string
  image: string
  description: string
  culturalSignificance?: string
}

export interface Player {
  id: string
  name: string
  type: PlayerType
  board: LoteriaCard[]
  markedCards: Set<number>
  isWinner: boolean
}

export interface BotPersonality {
  name: string
  reactionSpeed: number
  errorProbability: number
  celebrationStyle: CelebrationStyle
}

export interface BotPlayer extends Player {
  difficulty: Difficulty
  reactionTimeRange: [number, number]
  errorRate: number
  personality: BotPersonality
}

export interface GameSession {
  id: string
  startTime: Date
  endTime?: Date
  players: Player[]
  winner?: Player
  cardsDrawn: LoteriaCard[]
  duration?: number
}

export interface GameState {
  currentGame: GameSession | null
  players: Player[]
  currentCard: LoteriaCard | null
  gameStatus: GameStatus
  winner: Player | null
  cardsDrawn: LoteriaCard[]
  gameStartTime?: Date
}

// ============================================================================
// USER DATA INTERFACES
// ============================================================================

export interface MonthlyStats {
  month: string
  year: number
  gamesPlayed: number
  wins: number
  losses: number
  winPercentage: number
  averageGameTime: number
}

export interface UserStatistics {
  totalGames: number
  wins: number
  losses: number
  winPercentage: number
  averageGameTime: number
  longestWinStreak: number
  currentWinStreak: number
  totalPlayTime: number
  monthlyStats: Record<string, MonthlyStats>
  lastUpdated: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
  progress: number
  maxProgress: number
  category: AchievementCategory
  isUnlocked: boolean
}

export interface UserPreferences {
  soundEnabled: boolean
  musicEnabled: boolean
  volume: number
  theme: 'light' | 'dark' | 'auto'
  language: 'es' | 'en'
  animationsEnabled: boolean
}

export interface UserProfile {
  id: string
  name: string
  createdAt: Date
  lastPlayed: Date
  statistics: UserStatistics
  achievements: Achievement[]
  preferences: UserPreferences
  version: number
}

// ============================================================================
// BOT CONFIGURATION INTERFACES
// ============================================================================

export interface DifficultySettings {
  [Difficulty.EASY]: {
    reactionTimeRange: [number, number]
    errorRate: number
    adaptiveSpeedMultiplier: number
  }
  [Difficulty.MEDIUM]: {
    reactionTimeRange: [number, number]
    errorRate: number
    adaptiveSpeedMultiplier: number
  }
  [Difficulty.HARD]: {
    reactionTimeRange: [number, number]
    errorRate: number
    adaptiveSpeedMultiplier: number
  }
}

export interface BotConfiguration {
  names: string[]
  personalities: BotPersonality[]
  difficultySettings: DifficultySettings
}

// ============================================================================
// GAME MECHANICS INTERFACES
// ============================================================================

export interface WinPattern {
  type: 'row' | 'column' | 'diagonal'
  positions: number[]
  name: string
}

export interface GameRules {
  boardSize: number
  winPatterns: WinPattern[]
  maxPlayers: number
  minPlayers: number
  cardDrawInterval: number
}

// ============================================================================
// AUDIO INTERFACES
// ============================================================================

export interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  enabled: boolean
}

export interface SoundEffect {
  id: string
  src: string
  volume: number
  loop: boolean
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type GameEventType = 
  | 'game_started'
  | 'card_drawn'
  | 'card_marked'
  | 'player_won'
  | 'game_ended'
  | 'bot_action'
  | 'achievement_unlocked'

export interface GameEvent {
  type: GameEventType
  timestamp: Date
  playerId?: string
  data?: any
}

export type StorageKey = 
  | 'user_profile'
  | 'game_settings'
  | 'audio_settings'
  | 'achievements'
  | 'statistics'

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

export interface GameError {
  code: string
  message: string
  timestamp: Date
  context?: any
}

export type ErrorCode = 
  | 'STORAGE_ERROR'
  | 'AUDIO_ERROR'
  | 'GAME_STATE_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Re-export data for convenience
export * from '../data'