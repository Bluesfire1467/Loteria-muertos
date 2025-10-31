// Stores de Pinia para la aplicación de Lotería Día de Muertos

export { useStatisticsStore } from './statistics'
export { useAchievementsStore } from './achievements'

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  GameStatus,
  PlayerType,
  Difficulty
} from '@/types'
import type {
  GameState,
  GameSession,
  Player,
  BotPlayer,
  LoteriaCard,
  WinPattern
} from '@/types'
import { getRandomCards } from '@/data/loteriaCards'
import {
  checkAllPlayersVictory,
  validateCardMark,
  getPlayerVictoryProgress,
  handleSimultaneousWinners
} from '@/utils/victoryDetection'
import { botManager, createDefaultBots } from '@/utils/botManager'
import { adaptiveAI, autoAdjustDifficulty } from '@/utils/adaptiveAI'
import { botAnimationManager } from '@/utils/botAnimations'
import { cantor, type CantorConfig, type CantorPreset, CANTOR_PRESETS } from '@/utils/cantor'
import { useStatisticsStore } from './statistics'

export const useGameStore = defineStore('game', () => {
  // ============================================================================
  // ESTADO
  // ============================================================================

  const gameState = ref<GameState>({
    currentGame: null,
    players: [],
    currentCard: null,
    gameStatus: GameStatus.WAITING,
    winner: null,
    cardsDrawn: [],
    gameStartTime: undefined
  })

  // ============================================================================
  // GETTERS COMPUTADOS
  // ============================================================================

  const isGameActive = computed(() => gameState.value.gameStatus === GameStatus.PLAYING)
  const isGameFinished = computed(() => gameState.value.gameStatus === GameStatus.FINISHED)
  const humanPlayer = computed(() => gameState.value.players.find(p => p.type === PlayerType.HUMAN))
  const botPlayers = computed(() => gameState.value.players.filter(p => p.type === PlayerType.BOT) as BotPlayer[])
  const currentGameDuration = computed(() => {
    if (!gameState.value.gameStartTime) return 0
    const now = gameState.value.currentGame?.endTime || new Date()
    return Math.floor((now.getTime() - gameState.value.gameStartTime.getTime()) / 1000)
  })

  // ============================================================================
  // ACCIONES DE GESTIÓN DE JUEGO
  // ============================================================================

  // ============================================================================
  // ACCIONES DEL CANTOR
  // ============================================================================

  /**
   * Inicia el sistema de cantado de cartas
   */
  function startCantor(config?: Partial<CantorConfig>): boolean {
    // Configurar callbacks del cantor
    const cantorConfig: Partial<CantorConfig> = {
      ...config,
      onCardCalled: (card) => {
        // Actualizar la carta actual en el estado
        gameState.value.currentCard = card
        gameState.value.cardsDrawn.push(card)

        // Simular reacción de bots
        simulateBotsReaction(card)

        // Callback personalizado si existe
        config?.onCardCalled?.(card)

        console.log(`🎤 Nueva carta cantada: ${card.name}`)
      },
      onDeckFinished: () => {
        console.log('🎤 Se terminaron todas las cartas del mazo')
        config?.onDeckFinished?.()
      }
    }

    // Configurar y iniciar el cantor
    cantor.updateConfig(cantorConfig)
    return cantor.start()
  }

  /**
   * Detiene el sistema de cantado
   */
  function stopCantor(): void {
    cantor.stop()
  }

  /**
   * Pausa el cantado de cartas
   */
  function pauseCantor(): void {
    cantor.pause()
  }

  /**
   * Reanuda el cantado de cartas
   */
  function resumeCantor(): void {
    cantor.resume()
  }

  /**
   * Reinicia el cantor con nuevas cartas
   */
  function resetCantor(): void {
    cantor.reset()
    gameState.value.currentCard = null
    gameState.value.cardsDrawn = []
  }

  /**
   * Canta la siguiente carta manualmente
   */
  function callNextCard(): LoteriaCard | null {
    const card = cantor.callNextCard()
    if (card) {
      gameState.value.currentCard = card
      gameState.value.cardsDrawn.push(card)
      simulateBotsReaction(card)
    }
    return card
  }

  /**
   * Configura el cantor con un preset predefinido
   */
  function setCantorPreset(preset: CantorPreset): void {
    const config = CANTOR_PRESETS[preset]
    cantor.updateConfig(config)
    console.log(`🎤 Cantor configurado con preset: ${preset}`)
  }

  /**
   * Obtiene el estado actual del cantor
   */
  function getCantorState() {
    return cantor.getState()
  }

  /**
   * Obtiene estadísticas del cantor
   */
  function getCantorStats() {
    return cantor.getStats()
  }

  /**
   * Verifica si una carta ya fue cantada
   */
  function wasCardCalled(cardId: number): boolean {
    return cantor.wasCardCalled(cardId)
  }

  /**
   * Inicia una nueva partida con jugador humano y bots
   */
  function startNewGame(playerName: string = 'Jugador'): GameSession {
    const gameId = `game_${Date.now()}`
    const startTime = new Date()

    // Crear jugador humano
    const humanPlayer: Player = {
      id: 'human_player',
      name: playerName,
      type: PlayerType.HUMAN,
      board: getRandomCards(16),
      markedCards: new Set<number>(),
      isWinner: false
    }

    // Crear bots usando BotManager
    const bots: BotPlayer[] = createDefaultBots(2)

    // Debug: verificar que todos los tableros tienen 16 cartas únicas
    console.log(`🎮 Tableros generados:`)
    console.log(`👤 ${humanPlayer.name}: ${humanPlayer.board.length} cartas`, humanPlayer.board.map(c => c.name))
    bots.forEach(bot => {
      console.log(`🤖 ${bot.name}: ${bot.board.length} cartas`, bot.board.map(c => c.name))
    })

    // Verificar que no hay victorias al inicio (sin cartas cantadas)
    const initialWinners = checkAllPlayersVictory([humanPlayer, ...bots], [])
    if (initialWinners.length > 0) {
      console.error(`⚠️ PROBLEMA: Se detectaron victorias al inicio del juego!`, initialWinners)
    } else {
      console.log(`✅ Verificación inicial: No hay victorias detectadas al inicio`)
    }

    // Crear sesión de juego
    const gameSession: GameSession = {
      id: gameId,
      startTime,
      players: [humanPlayer, ...bots],
      cardsDrawn: [],
      duration: undefined
    }

    // Actualizar estado
    gameState.value = {
      currentGame: gameSession,
      players: [humanPlayer, ...bots],
      currentCard: null,
      gameStatus: GameStatus.PLAYING,
      winner: null,
      cardsDrawn: [],
      gameStartTime: startTime
    }

    // Reiniciar y configurar el cantor para la nueva partida
    resetCantor()

    console.log(`🎮 Nueva partida iniciada: ${gameId}`)
    console.log(`📊 Estado inicial - Jugadores: ${gameState.value.players.length}`)

    return gameSession
  }

  /**
   * Finaliza la partida actual
   */
  function endGame(winner?: Player): void {
    if (!gameState.value.currentGame) {
      console.warn('⚠️ Intento de finalizar juego sin partida activa')
      return
    }

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - gameState.value.currentGame.startTime.getTime()) / 1000)

    console.log(`🏁 Finalizando partida - Ganador: ${winner?.name || 'Ninguno'}, Duración: ${duration}s, Cartas cantadas: ${gameState.value.cardsDrawn.length}`)

    // Detener el cantor
    stopCantor()

    // Actualizar sesión de juego
    gameState.value.currentGame.endTime = endTime
    gameState.value.currentGame.duration = duration
    gameState.value.currentGame.winner = winner

    // Actualizar estado
    gameState.value.gameStatus = GameStatus.FINISHED
    gameState.value.winner = winner || null

    if (winner) {
      winner.isWinner = true
      console.log(`🏆 ¡${winner.name} ha ganado la partida!`)

      // Mostrar estado final de todos los jugadores
      gameState.value.players.forEach(player => {
        console.log(`📊 ${player.name}: ${player.markedCards.size} cartas marcadas, Ganador: ${player.isWinner}`)
      })
    }

    console.log(`⏱️ Duración de la partida: ${duration} segundos`)

    // 🔥 REGISTRAR ESTADÍSTICAS
    const human = humanPlayer.value
    if (human && gameState.value.currentGame) {
      const statisticsStore = useStatisticsStore()
      try {
        console.log(`📊 Registrando estadísticas - Jugador: ${human.name}, Ganador: ${human.isWinner}, Duración: ${duration}s`)
        statisticsStore.recordGameResult(gameState.value.currentGame, human)
        console.log(`✅ Estadísticas registradas exitosamente`)
        console.log(`📈 Nuevas estadísticas - Total: ${statisticsStore.userStats.totalGames}, Victorias: ${statisticsStore.userStats.wins}, %: ${statisticsStore.userStats.winPercentage}%`)
      } catch (error) {
        console.error('❌ Error al registrar estadísticas:', error)
      }
    } else {
      console.warn('⚠️ No se pudieron registrar estadísticas - Jugador humano o sesión no encontrados')
    }
  }

  /**
   * Reinicia el juego al estado inicial
   */
  function resetGame(): void {
    // Detener y limpiar el cantor
    stopCantor()
    resetCantor()

    // Limpiar bots del manager
    botManager.cleanup()

    // Limpiar cartas marcadas de todos los jugadores
    gameState.value.players.forEach(player => {
      player.markedCards.clear()
      player.isWinner = false
    })

    gameState.value = {
      currentGame: null,
      players: [],
      currentCard: null,
      gameStatus: GameStatus.WAITING,
      winner: null,
      cardsDrawn: [],
      gameStartTime: undefined
    }
    console.log('🔄 Juego reiniciado')
  }

  /**
   * Pausa o reanuda el juego
   */
  function togglePause(): void {
    if (gameState.value.gameStatus === GameStatus.PLAYING) {
      gameState.value.gameStatus = GameStatus.WAITING
      pauseCantor()
      console.log('⏸️ Juego pausado')
    } else if (gameState.value.gameStatus === GameStatus.WAITING && gameState.value.currentGame) {
      gameState.value.gameStatus = GameStatus.PLAYING
      resumeCantor()
      console.log('▶️ Juego reanudado')
    }
  }

  // ============================================================================
  // ACCIONES DE JUGADORES
  // ============================================================================

  /**
   * Marca una carta en el tablero del jugador y verifica victorias
   */
  function markCard(playerId: string, cardId: number): { success: boolean; hasWon: boolean; winPattern?: WinPattern } {
    const player = gameState.value.players.find(p => p.id === playerId)
    if (!player || !gameState.value.currentCard) {
      console.warn(`❌ No se puede marcar carta: jugador no encontrado o no hay carta actual`)
      return { success: false, hasWon: false }
    }

    // Validar que la carta se puede marcar
    if (!validateCardMark(player, cardId, gameState.value.currentCard)) {
      console.warn(`❌ ${player.name} intentó marcar carta inválida:`, {
        cardId,
        currentCardId: gameState.value.currentCard?.id,
        hasCardInBoard: player.board.some(c => c.id === cardId),
        alreadyMarked: player.markedCards.has(cardId)
      })
      return { success: false, hasWon: false }
    }

    // Marcar la carta
    player.markedCards.add(cardId)
    console.log(`✅ ${player.name} marcó la carta: ${gameState.value.currentCard.name} (${player.markedCards.size}/16 cartas marcadas)`)

    // Verificación de integridad: todas las cartas marcadas deben haber sido cantadas
    const invalidMarkedCards: number[] = []
    const calledCardIds = new Set(gameState.value.cardsDrawn.map(c => c.id))

    player.markedCards.forEach(markedCardId => {
      if (!calledCardIds.has(markedCardId)) {
        invalidMarkedCards.push(markedCardId)
      }
    })

    if (invalidMarkedCards.length > 0) {
      console.error(`⚠️ PROBLEMA: ${player.name} tiene cartas marcadas que no fueron cantadas:`, invalidMarkedCards)
      // Limpiar cartas inválidas
      invalidMarkedCards.forEach(cardId => player.markedCards.delete(cardId))
      console.log(`🔧 Cartas inválidas removidas del jugador ${player.name}`)
    }

    // Verificar integridad del juego
    verifyGameIntegrity()

    // Debug: mostrar progreso de todos los jugadores
    gameState.value.players.forEach(p => {
      const progress = getPlayerVictoryProgress(p, gameState.value.cardsDrawn)
      console.log(`📊 ${p.name}: ${progress.completedPositions}/${progress.totalPositions} en mejor patrón (${Math.round(progress.progress)}%) - Cartas cantadas: ${gameState.value.cardsDrawn.length}`)
    })

    // Solo verificar victoria si el juego está activo
    if (gameState.value.gameStatus === GameStatus.PLAYING) {
      // Verificación de seguridad: debe haber al menos 4 cartas cantadas para cualquier victoria
      if (gameState.value.cardsDrawn.length < 4) {
        console.log(`📊 Solo ${gameState.value.cardsDrawn.length} cartas cantadas, no es posible ganar aún`)
        return { success: true, hasWon: false }
      }

      // Verificar victoria después de marcar, pasando las cartas cantadas
      const winners = checkAllPlayersVictory(gameState.value.players, gameState.value.cardsDrawn)

      if (winners.length > 0) {
        console.log(`🏆 Victoria detectada! Ganadores:`, winners.map(w => `${w.player.name} (${w.pattern.name})`))
        console.log(`📊 Cartas cantadas hasta ahora: ${gameState.value.cardsDrawn.length}`)

        // Verificación adicional: asegurar que la victoria es válida
        let validVictory = true
        winners.forEach(({ player, pattern }) => {
          const patternCards = pattern.positions.map(pos => player.board[pos])
          const calledCardIds = new Set(gameState.value.cardsDrawn.map(c => c.id))

          patternCards.forEach(card => {
            if (!calledCardIds.has(card.id)) {
              console.error(`⚠️ VICTORIA INVÁLIDA: ${player.name} tiene carta ${card.name} en patrón ganador pero no fue cantada`)
              validVictory = false
            }
          })
        })

        if (!validVictory) {
          console.error(`⚠️ Victoria inválida detectada, ignorando...`)
          return { success: true, hasWon: false }
        }

        const { primaryWinner, simultaneousWinners, winDetails } = handleSimultaneousWinners(winners)

        // Finalizar el juego
        endGame(primaryWinner)

        // Log de resultados
        if (simultaneousWinners.length > 0) {
          console.log(`🏆 ¡Victoria simultánea! Ganador principal: ${primaryWinner.name}`)
          console.log(`🏆 Ganadores simultáneos: ${simultaneousWinners.map(p => p.name).join(', ')}`)
        }

        // Verificar si el jugador que marcó la carta ganó
        const playerWon = winDetails.some(w => w.player.id === playerId)
        const playerWinPattern = winDetails.find(w => w.player.id === playerId)?.pattern

        return {
          success: true,
          hasWon: playerWon,
          winPattern: playerWinPattern
        }
      }
    }

    return { success: true, hasWon: false }
  }

  /**
   * Obtiene el progreso de un jugador (cartas marcadas / total)
   */
  function getPlayerProgress(playerId: string): number {
    const player = gameState.value.players.find(p => p.id === playerId)
    if (!player) return 0
    return (player.markedCards.size / player.board.length) * 100
  }

  /**
   * Obtiene el progreso de victoria de un jugador
   */
  function getPlayerVictoryStatus(playerId: string) {
    const player = gameState.value.players.find(p => p.id === playerId)
    if (!player) return null
    return getPlayerVictoryProgress(player)
  }

  /**
   * Verifica si algún jugador está cerca de ganar (3 de 4 cartas en un patrón)
   */
  function getPlayersNearVictory(): Array<{ player: Player; progress: ReturnType<typeof getPlayerVictoryProgress> }> {
    return gameState.value.players
      .map(player => ({
        player,
        progress: getPlayerVictoryProgress(player)
      }))
      .filter(({ progress }) => progress.progress >= 75) // 3 de 4 cartas = 75%
      .sort((a, b) => b.progress.progress - a.progress.progress)
  }

  /**
   * Fuerza la verificación de victoria para todos los jugadores
   */
  function checkForVictories(): Array<{ player: Player; pattern: WinPattern }> {
    return checkAllPlayersVictory(gameState.value.players)
  }

  // ============================================================================
  // FUNCIONES DE BOTS
  // ============================================================================

  /**
   * Simula la reacción de bots a una carta cantada
   */
  function simulateBotsReaction(currentCard: LoteriaCard): void {
    if (!currentCard) return

    botPlayers.value.forEach(bot => {
      botManager.simulateBotReaction(bot.id, currentCard, (botId, cardId) => {
        // Callback cuando el bot reacciona
        const result = markCard(botId, cardId)
        if (result.hasWon) {
          console.log(`🏆 ¡Bot ${bot.name} ha ganado!`)
        }
      })
    })
  }

  /**
   * Actualiza la dificultad de un bot específico
   */
  function updateBotDifficulty(botId: string, newDifficulty: Difficulty): boolean {
    return botManager.updateBotDifficulty(botId, newDifficulty)
  }

  /**
   * Obtiene estadísticas de rendimiento de los bots
   */
  function getBotStats() {
    return botManager.getBotStats()
  }

  /**
   * Reinicia todos los bots para una nueva partida
   */
  function resetBots(): void {
    botManager.resetAllBots()
  }

  /**
   * Analiza el rendimiento del jugador y ajusta la dificultad de los bots
   */
  function analyzeAndAdjustDifficulty(
    playerStats: any, // UserStatistics type
    recentGames: GameSession[]
  ): any[] { // DifficultyAdjustment[] type
    const adjustments = autoAdjustDifficulty(playerStats, recentGames, botPlayers.value)

    if (adjustments.length > 0) {
      console.log(`🎯 Se realizaron ${adjustments.length} ajustes de dificultad`)
      adjustments.forEach(adj => {
        console.log(`   ${adj.oldDifficulty} → ${adj.newDifficulty}: ${adj.reason}`)
      })
    }

    return adjustments
  }

  /**
   * Obtiene métricas de rendimiento del jugador
   */
  function getPlayerPerformanceMetrics(
    playerStats: any, // UserStatistics type
    recentGames: GameSession[]
  ): any { // PlayerPerformanceMetrics type
    return adaptiveAI.analyzePlayerPerformance(playerStats, recentGames)
  }

  /**
   * Verifica si se debe ajustar la dificultad
   */
  function shouldAdjustBotDifficulty(
    playerStats: any, // UserStatistics type
    recentGames: GameSession[]
  ): boolean {
    const metrics = adaptiveAI.analyzePlayerPerformance(playerStats, recentGames)
    return adaptiveAI.shouldAdjustDifficulty(metrics, botPlayers.value)
  }

  /**
   * Registra un elemento DOM para animaciones de bot
   */
  function registerBotElement(botId: string, element: HTMLElement): boolean {
    return botManager.registerBotElement(botId, element)
  }

  /**
   * Desregistra un elemento DOM de bot
   */
  function unregisterBotElement(botId: string): boolean {
    return botManager.unregisterBotElement(botId)
  }

  /**
   * Ejecuta una celebración manual para un bot
   */
  function celebrateBot(botId: string, cardName: string): boolean {
    return botManager.celebrateBot(botId, cardName)
  }

  /**
   * Obtiene estadísticas de celebraciones
   */
  function getBotCelebrationStats() {
    return botAnimationManager.getCelebrationStats()
  }

  /**
   * Obtiene el historial de celebraciones
   */
  function getCelebrationHistory() {
    return botAnimationManager.getCelebrationHistory()
  }

  /**
   * Verifica la integridad del juego (para debugging)
   */
  function verifyGameIntegrity(): boolean {
    if (!gameState.value.currentGame) return true

    let hasIssues = false
    const calledCardIds = new Set(gameState.value.cardsDrawn.map(c => c.id))

    gameState.value.players.forEach(player => {
      const invalidCards: number[] = []

      player.markedCards.forEach(cardId => {
        if (!calledCardIds.has(cardId)) {
          invalidCards.push(cardId)
          hasIssues = true
        }
      })

      if (invalidCards.length > 0) {
        console.error(`⚠️ ${player.name} tiene ${invalidCards.length} cartas marcadas inválidas:`, invalidCards)
        // Limpiar cartas inválidas automáticamente
        invalidCards.forEach(cardId => player.markedCards.delete(cardId))
        console.log(`🔧 Cartas inválidas removidas automáticamente de ${player.name}`)
      }
    })

    // Verificar si hay victorias falsas
    if (gameState.value.gameStatus === GameStatus.FINISHED && gameState.value.cardsDrawn.length < 4) {
      console.error(`⚠️ ESTADO CORRUPTO: Juego terminado con solo ${gameState.value.cardsDrawn.length} cartas cantadas`)
      hasIssues = true

      // Reiniciar el estado del juego
      gameState.value.gameStatus = GameStatus.PLAYING
      gameState.value.winner = null
      gameState.value.players.forEach(player => {
        player.isWinner = false
      })
      console.log(`🔧 Estado del juego corregido automáticamente`)
    }

    if (!hasIssues) {
      console.log('✅ Integridad del juego verificada - Todo correcto')
    }

    return !hasIssues
  }

  /**
   * Obtiene estadísticas de la partida actual
   */
  function getCurrentGameStats() {
    if (!gameState.value.currentGame) return null

    return {
      gameId: gameState.value.currentGame.id,
      duration: currentGameDuration.value,
      cardsDrawn: gameState.value.cardsDrawn.length,
      playersProgress: gameState.value.players.map(player => ({
        name: player.name,
        progress: getPlayerProgress(player.id),
        markedCards: player.markedCards.size
      }))
    }
  }

  // ============================================================================
  // RETURN STORE
  // ============================================================================

  return {
    // Estado
    gameState,

    // Getters
    isGameActive,
    isGameFinished,
    humanPlayer,
    botPlayers,
    currentGameDuration,

    // Acciones principales
    startNewGame,
    endGame,
    resetGame,
    togglePause,

    // Acciones de jugadores
    markCard,
    getPlayerProgress,
    getPlayerVictoryStatus,

    // Detección de victorias
    getPlayersNearVictory,
    checkForVictories,

    // Funciones de bots
    simulateBotsReaction,
    updateBotDifficulty,
    getBotStats,
    resetBots,

    // Funciones de IA adaptativa
    analyzeAndAdjustDifficulty,
    getPlayerPerformanceMetrics,
    shouldAdjustBotDifficulty,

    // Funciones de animaciones
    registerBotElement,
    unregisterBotElement,
    celebrateBot,
    getBotCelebrationStats,
    getCelebrationHistory,

    // Funciones del cantor
    startCantor,
    stopCantor,
    pauseCantor,
    resumeCantor,
    resetCantor,
    callNextCard,
    setCantorPreset,
    getCantorState,
    getCantorStats,
    wasCardCalled,

    // Utilidades
    getCurrentGameStats,
    verifyGameIntegrity
  }
})