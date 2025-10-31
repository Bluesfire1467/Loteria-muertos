import type { StorageKey, ErrorCode, GameError } from '../types'

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_PREFIX = 'loteria_dia_muertos_'
const COMPRESSION_THRESHOLD = 1024 // Compress data larger than 1KB
const MAX_STORAGE_SIZE = 5 * 1024 * 1024 // 5MB limit

// ============================================================================
// COMPRESSION UTILITIES
// ============================================================================

/**
 * Simple JSON compression using string replacement for common patterns
 */
function compressJSON(data: string): string {
  return data
    .replace(/"id":/g, '"i":')
    .replace(/"name":/g, '"n":')
    .replace(/"timestamp":/g, '"t":')
    .replace(/"createdAt":/g, '"c":')
    .replace(/"lastPlayed":/g, '"l":')
    .replace(/"statistics":/g, '"s":')
    .replace(/"achievements":/g, '"a":')
    .replace(/"preferences":/g, '"p":')
    .replace(/true/g, '1')
    .replace(/false/g, '0')
}

/**
 * Decompress JSON by reversing compression patterns
 */
function decompressJSON(data: string): string {
  return data
    .replace(/"i":/g, '"id":')
    .replace(/"n":/g, '"name":')
    .replace(/"t":/g, '"timestamp":')
    .replace(/"c":/g, '"createdAt":')
    .replace(/"l":/g, '"lastPlayed":')
    .replace(/"s":/g, '"statistics":')
    .replace(/"a":/g, '"achievements":')
    .replace(/"p":/g, '"preferences":')
    .replace(/(?<!")1(?!")/g, 'true')
    .replace(/(?<!")0(?!")/g, 'false')
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

class StorageError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public context?: any
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

/**
 * Create a standardized game error for storage operations
 */
function createStorageError(code: ErrorCode, message: string, context?: any): GameError {
  return {
    code,
    message,
    timestamp: new Date(),
    context
  }
}

// ============================================================================
// STORAGE AVAILABILITY CHECKS
// ============================================================================

/**
 * Check if localStorage is available and functional
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Check available storage space
 */
function getStorageSize(): number {
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

/**
 * Check if we have enough space for new data
 */
function hasStorageSpace(dataSize: number): boolean {
  const currentSize = getStorageSize()
  return (currentSize + dataSize) < MAX_STORAGE_SIZE
}

// ============================================================================
// FALLBACK STORAGE (IN-MEMORY)
// ============================================================================

class MemoryStorage {
  private data: Map<string, string> = new Map()

  setItem(key: string, value: string): void {
    this.data.set(key, value)
  }

  getItem(key: string): string | null {
    return this.data.get(key) || null
  }

  removeItem(key: string): void {
    this.data.delete(key)
  }

  clear(): void {
    this.data.clear()
  }

  get length(): number {
    return this.data.size
  }
}

// ============================================================================
// STORAGE MANAGER CLASS
// ============================================================================

export class StorageManager {
  private storage: Storage | MemoryStorage
  private isUsingFallback: boolean = false
  private errorCallbacks: ((error: GameError) => void)[] = []

  constructor() {
    if (isLocalStorageAvailable()) {
      this.storage = localStorage
    } else {
      this.storage = new MemoryStorage()
      this.isUsingFallback = true
      this.notifyError(createStorageError(
        'STORAGE_ERROR',
        'LocalStorage not available, using memory fallback'
      ))
    }
  }

  /**
   * Register error callback for storage operations
   */
  onError(callback: (error: GameError) => void): void {
    this.errorCallbacks.push(callback)
  }

  /**
   * Notify all error callbacks
   */
  private notifyError(error: GameError): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error)
      } catch (e) {
        console.error('Error in storage error callback:', e)
      }
    })
  }

  /**
   * Generate storage key with prefix
   */
  private getStorageKey(key: StorageKey): string {
    return `${STORAGE_PREFIX}${key}`
  }

  /**
   * Save data to storage with compression and error handling
   */
  async save<T>(key: StorageKey, data: T): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(data)
      let finalData = jsonData

      // Apply compression if data is large enough
      if (jsonData.length > COMPRESSION_THRESHOLD) {
        finalData = compressJSON(jsonData)
      }

      // Check storage space before saving
      if (!this.isUsingFallback && !hasStorageSpace(finalData.length)) {
        throw new StorageError(
          'STORAGE_ERROR',
          'Insufficient storage space',
          { dataSize: finalData.length, availableSpace: MAX_STORAGE_SIZE - getStorageSize() }
        )
      }

      const storageKey = this.getStorageKey(key)
      this.storage.setItem(storageKey, finalData)

      return true
    } catch (error) {
      const gameError = error instanceof StorageError 
        ? createStorageError(error.code, error.message, error.context)
        : createStorageError('STORAGE_ERROR', `Failed to save ${key}: ${error}`, { key, error })
      
      this.notifyError(gameError)
      return false
    }
  }

  /**
   * Load data from storage with decompression and error handling
   */
  async load<T>(key: StorageKey, defaultValue?: T): Promise<T | null> {
    try {
      const storageKey = this.getStorageKey(key)
      const rawData = this.storage.getItem(storageKey)

      if (rawData === null) {
        return defaultValue || null
      }

      // Try to decompress if it looks compressed
      let jsonData = rawData
      if (rawData.includes('"i":') || rawData.includes('"n":')) {
        jsonData = decompressJSON(rawData)
      }

      const parsedData = JSON.parse(jsonData) as T
      return parsedData
    } catch (error) {
      const gameError = createStorageError(
        'STORAGE_ERROR',
        `Failed to load ${key}: ${error}`,
        { key, error }
      )
      
      this.notifyError(gameError)
      return defaultValue || null
    }
  }

  /**
   * Remove data from storage
   */
  async remove(key: StorageKey): Promise<boolean> {
    try {
      const storageKey = this.getStorageKey(key)
      this.storage.removeItem(storageKey)
      return true
    } catch (error) {
      const gameError = createStorageError(
        'STORAGE_ERROR',
        `Failed to remove ${key}: ${error}`,
        { key, error }
      )
      
      this.notifyError(gameError)
      return false
    }
  }

  /**
   * Clear all game data from storage
   */
  async clear(): Promise<boolean> {
    try {
      if (this.storage instanceof MemoryStorage) {
        this.storage.clear()
      } else {
        // Only clear keys with our prefix
        const keysToRemove: string[] = []
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i)
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => this.storage.removeItem(key))
      }
      return true
    } catch (error) {
      const gameError = createStorageError(
        'STORAGE_ERROR',
        `Failed to clear storage: ${error}`,
        { error }
      )
      
      this.notifyError(gameError)
      return false
    }
  }

  /**
   * Check if a key exists in storage
   */
  async exists(key: StorageKey): Promise<boolean> {
    try {
      const storageKey = this.getStorageKey(key)
      return this.storage.getItem(storageKey) !== null
    } catch (error) {
      this.notifyError(createStorageError(
        'STORAGE_ERROR',
        `Failed to check existence of ${key}: ${error}`,
        { key, error }
      ))
      return false
    }
  }

  /**
   * Get storage information and status
   */
  getStorageInfo(): {
    isUsingFallback: boolean
    totalSize: number
    availableSpace: number
    compressionEnabled: boolean
  } {
    return {
      isUsingFallback: this.isUsingFallback,
      totalSize: this.isUsingFallback ? 0 : getStorageSize(),
      availableSpace: this.isUsingFallback ? Infinity : MAX_STORAGE_SIZE - getStorageSize(),
      compressionEnabled: true
    }
  }

  /**
   * Perform storage cleanup by removing old or unnecessary data
   */
  async cleanup(): Promise<boolean> {
    try {
      // This could be extended to remove old game sessions, compress data, etc.
      // For now, just ensure we're not over the size limit
      if (!this.isUsingFallback && getStorageSize() > MAX_STORAGE_SIZE * 0.9) {
        // Could implement LRU cleanup here
        console.warn('Storage approaching size limit')
      }
      return true
    } catch (error) {
      this.notifyError(createStorageError(
        'STORAGE_ERROR',
        `Failed to cleanup storage: ${error}`,
        { error }
      ))
      return false
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const storageManager = new StorageManager()

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Save data with automatic error handling
 */
export async function saveData<T>(key: StorageKey, data: T): Promise<boolean> {
  return storageManager.save(key, data)
}

/**
 * Load data with automatic error handling
 */
export async function loadData<T>(key: StorageKey, defaultValue?: T): Promise<T | null> {
  return storageManager.load(key, defaultValue)
}

/**
 * Remove data with automatic error handling
 */
export async function removeData(key: StorageKey): Promise<boolean> {
  return storageManager.remove(key)
}

/**
 * Check if data exists
 */
export async function dataExists(key: StorageKey): Promise<boolean> {
  return storageManager.exists(key)
}