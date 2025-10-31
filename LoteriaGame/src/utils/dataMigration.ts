import type { UserProfile, UserStatistics, Achievement, UserPreferences, GameError } from '../types'
import { AchievementCategory } from '../types'
import { storageManager } from './storage'

// ============================================================================
// VERSION CONSTANTS
// ============================================================================

export const CURRENT_DATA_VERSION = 3
export const MIN_SUPPORTED_VERSION = 1

// ============================================================================
// MIGRATION INTERFACES
// ============================================================================

interface MigrationResult {
  success: boolean
  fromVersion: number
  toVersion: number
  errors?: GameError[]
  warnings?: string[]
}



// ============================================================================
// LEGACY DATA STRUCTURES
// ============================================================================

// Version 1 structures (initial version)
interface UserProfileV1 {
  id: string
  name: string
  createdAt: string // Was string instead of Date
  totalGames: number
  wins: number
  losses: number
}

// Version 2 structures (added achievements and preferences)
interface UserProfileV2 {
  id: string
  name: string
  createdAt: Date
  lastPlayed: Date
  statistics: {
    totalGames: number
    wins: number
    losses: number
    winPercentage: number
    averageGameTime: number
  }
  achievements: string[] // Was array of IDs instead of full objects
  preferences?: {
    soundEnabled: boolean
    volume: number
  }
}

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

/**
 * Migrate from version 1 to version 2
 */
function migrateV1ToV2(data: UserProfileV1): UserProfileV2 {
  const winPercentage = data.totalGames > 0 ? (data.wins / data.totalGames) * 100 : 0

  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.createdAt),
    lastPlayed: new Date(),
    statistics: {
      totalGames: data.totalGames,
      wins: data.wins,
      losses: data.losses,
      winPercentage,
      averageGameTime: 300 // Default 5 minutes
    },
    achievements: [], // Start with empty achievements
    preferences: {
      soundEnabled: true,
      volume: 0.7
    }
  }
}

/**
 * Migrate from version 2 to version 3 (current)
 */
function migrateV2ToV3(data: UserProfileV2): UserProfile {
  // Create default achievements structure
  const defaultAchievements: Achievement[] = [
    {
      id: 'first_win',
      name: 'Primera Victoria',
      description: 'Gana tu primera partida',
      icon: '🏆',
      progress: data.statistics.wins > 0 ? 1 : 0,
      maxProgress: 1,
      category: AchievementCategory.GAMEPLAY,
      isUnlocked: data.statistics.wins > 0,
      unlockedAt: data.statistics.wins > 0 ? data.lastPlayed : undefined
    },
    {
      id: 'ten_wins',
      name: 'Veterano',
      description: 'Gana 10 partidas',
      icon: '🎯',
      progress: Math.min(data.statistics.wins, 10),
      maxProgress: 10,
      category: AchievementCategory.MILESTONE,
      isUnlocked: data.statistics.wins >= 10,
      unlockedAt: data.statistics.wins >= 10 ? data.lastPlayed : undefined
    }
  ]

  // Enhanced statistics with new fields
  const enhancedStatistics: UserStatistics = {
    ...data.statistics,
    longestWinStreak: 0, // Can't calculate from old data
    currentWinStreak: 0, // Can't calculate from old data
    totalPlayTime: data.statistics.totalGames * data.statistics.averageGameTime,
    monthlyStats: {}, // Start fresh
    lastUpdated: new Date()
  }

  // Enhanced preferences with new options
  const enhancedPreferences: UserPreferences = {
    soundEnabled: data.preferences?.soundEnabled ?? true,
    musicEnabled: true,
    volume: data.preferences?.volume ?? 0.7,
    theme: 'auto',
    language: 'es',
    animationsEnabled: true
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    lastPlayed: data.lastPlayed,
    statistics: enhancedStatistics,
    achievements: defaultAchievements,
    preferences: enhancedPreferences,
    version: CURRENT_DATA_VERSION
  }
}

// ============================================================================
// MIGRATION REGISTRY
// ============================================================================

type MigrationFunction = (data: any) => any

const migrations: Record<number, MigrationFunction> = {
  1: migrateV1ToV2,
  2: migrateV2ToV3
}

// ============================================================================
// MAIN MIGRATION CLASS
// ============================================================================

export class DataMigrationManager {
  private errors: GameError[] = []
  private warnings: string[] = []

  /**
   * Check if data needs migration
   */
  needsMigration(data: any): boolean {
    const version = this.getDataVersion(data)
    return version < CURRENT_DATA_VERSION
  }

  /**
   * Get version from data object
   */
  private getDataVersion(data: any): number {
    // Check for version field (v3+)
    if (data && typeof data.version === 'number') {
      return data.version
    }

    // Check for v2 structure
    if (data && data.statistics && data.achievements && Array.isArray(data.achievements)) {
      return 2
    }

    // Check for v1 structure
    if (data && typeof data.totalGames === 'number' && typeof data.wins === 'number') {
      return 1
    }

    // Unknown or invalid data
    return 0
  }

  /**
   * Validate that migration is possible
   */
  private canMigrate(fromVersion: number): boolean {
    if (fromVersion < MIN_SUPPORTED_VERSION) {
      this.errors.push({
        code: 'VALIDATION_ERROR',
        message: `Data version ${fromVersion} is too old and cannot be migrated`,
        timestamp: new Date(),
        context: { fromVersion, minSupported: MIN_SUPPORTED_VERSION }
      })
      return false
    }

    if (fromVersion > CURRENT_DATA_VERSION) {
      this.errors.push({
        code: 'VALIDATION_ERROR',
        message: `Data version ${fromVersion} is newer than supported version ${CURRENT_DATA_VERSION}`,
        timestamp: new Date(),
        context: { fromVersion, currentVersion: CURRENT_DATA_VERSION }
      })
      return false
    }

    return true
  }

  /**
   * Perform migration from one version to the next
   */
  private migrateStep(data: any, fromVersion: number): any {
    const migrationFn = migrations[fromVersion]

    if (!migrationFn) {
      throw new Error(`No migration function found for version ${fromVersion}`)
    }

    try {
      const migratedData = migrationFn(data)
      this.warnings.push(`Successfully migrated from version ${fromVersion} to ${fromVersion + 1}`)
      return migratedData
    } catch (error) {
      this.errors.push({
        code: 'STORAGE_ERROR',
        message: `Migration failed from version ${fromVersion}: ${error}`,
        timestamp: new Date(),
        context: { fromVersion, error }
      })
      throw error
    }
  }

  /**
   * Migrate data through all necessary versions
   */
  async migrateData(data: any): Promise<MigrationResult> {
    this.errors = []
    this.warnings = []

    const originalVersion = this.getDataVersion(data)
    let currentVersion = originalVersion
    let currentData = data

    // Validate migration is possible
    if (!this.canMigrate(originalVersion)) {
      return {
        success: false,
        fromVersion: originalVersion,
        toVersion: currentVersion,
        errors: this.errors
      }
    }

    // If already current version, no migration needed
    if (currentVersion >= CURRENT_DATA_VERSION) {
      return {
        success: true,
        fromVersion: originalVersion,
        toVersion: currentVersion,
        warnings: ['Data is already at current version']
      }
    }

    try {
      // Migrate step by step to current version
      while (currentVersion < CURRENT_DATA_VERSION) {
        currentData = this.migrateStep(currentData, currentVersion)
        currentVersion++
      }

      // Migration completed successfully

      return {
        success: true,
        fromVersion: originalVersion,
        toVersion: CURRENT_DATA_VERSION,
        warnings: this.warnings
      }
    } catch (error) {
      return {
        success: false,
        fromVersion: originalVersion,
        toVersion: currentVersion,
        errors: this.errors,
        warnings: this.warnings
      }
    }
  }

  /**
   * Create backup of data before migration
   */
  async createBackup(data: any): Promise<boolean> {
    try {
      const backupData = {
        timestamp: new Date(),
        version: this.getDataVersion(data),
        data: data
      }

      // Store backup with a special key (using timestamp for uniqueness)
      const backupResult = await storageManager.save('user_profile' as any, backupData)
      return backupResult
    } catch (error) {
      this.errors.push({
        code: 'STORAGE_ERROR',
        message: `Failed to create backup: ${error}`,
        timestamp: new Date(),
        context: { error }
      })
      return false
    }
  }

  /**
   * Migrate user profile with full error handling and backup
   */
  async migrateUserProfile(): Promise<MigrationResult> {
    try {
      // Load existing user profile
      const existingData = await storageManager.load('user_profile')

      if (!existingData) {
        return {
          success: true,
          fromVersion: CURRENT_DATA_VERSION,
          toVersion: CURRENT_DATA_VERSION,
          warnings: ['No existing user profile found']
        }
      }

      // Check if migration is needed
      if (!this.needsMigration(existingData)) {
        return {
          success: true,
          fromVersion: CURRENT_DATA_VERSION,
          toVersion: CURRENT_DATA_VERSION,
          warnings: ['User profile is already at current version']
        }
      }

      // Create backup before migration
      const backupSuccess = await this.createBackup(existingData)
      if (!backupSuccess) {
        this.warnings.push('Failed to create backup, proceeding with migration anyway')
      }

      // Perform migration
      const migrationResult = await this.migrateData(existingData)

      if (migrationResult.success) {
        // Save migrated data
        const saveSuccess = await storageManager.save('user_profile', migrationResult)
        if (!saveSuccess) {
          return {
            success: false,
            fromVersion: migrationResult.fromVersion,
            toVersion: migrationResult.toVersion,
            errors: [{
              code: 'STORAGE_ERROR',
              message: 'Migration completed but failed to save migrated data',
              timestamp: new Date()
            }]
          }
        }
      }

      return migrationResult
    } catch (error) {
      return {
        success: false,
        fromVersion: 0,
        toVersion: 0,
        errors: [{
          code: 'STORAGE_ERROR',
          message: `Unexpected error during migration: ${error}`,
          timestamp: new Date(),
          context: { error }
        }]
      }
    }
  }

  /**
   * Get migration status for all data
   */
  async getMigrationStatus(): Promise<{
    userProfile: { version: number; needsMigration: boolean }
    isSupported: boolean
  }> {
    try {
      const userProfileData = await storageManager.load('user_profile')
      const userProfileVersion = this.getDataVersion(userProfileData)

      return {
        userProfile: {
          version: userProfileVersion,
          needsMigration: this.needsMigration(userProfileData)
        },
        isSupported: userProfileVersion >= MIN_SUPPORTED_VERSION && userProfileVersion <= CURRENT_DATA_VERSION
      }
    } catch (error) {
      return {
        userProfile: {
          version: 0,
          needsMigration: false
        },
        isSupported: false
      }
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const dataMigrationManager = new DataMigrationManager()

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Perform automatic migration check and migration on app startup
 */
export async function performStartupMigration(): Promise<MigrationResult> {
  return dataMigrationManager.migrateUserProfile()
}

/**
 * Check if any data needs migration
 */
export async function checkMigrationNeeded(): Promise<boolean> {
  const status = await dataMigrationManager.getMigrationStatus()
  return status.userProfile.needsMigration
}

/**
 * Get current data version information
 */
export function getVersionInfo() {
  return {
    current: CURRENT_DATA_VERSION,
    minimum: MIN_SUPPORTED_VERSION
  }
}