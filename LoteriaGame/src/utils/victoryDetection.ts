import type { Player, LoteriaCard, WinPattern } from '@/types'

/**
 * Patrones de victoria para un tablero de 4x4 (16 cartas)
 * Posiciones numeradas de 0 a 15:
 * 
 *  0  1  2  3
 *  4  5  6  7
 *  8  9 10 11
 * 12 13 14 15
 */
export const WIN_PATTERNS: WinPattern[] = [
  // Filas
  { type: 'row', positions: [0, 1, 2, 3], name: 'Primera fila' },
  { type: 'row', positions: [4, 5, 6, 7], name: 'Segunda fila' },
  { type: 'row', positions: [8, 9, 10, 11], name: 'Tercera fila' },
  { type: 'row', positions: [12, 13, 14, 15], name: 'Cuarta fila' },

  // Columnas
  { type: 'column', positions: [0, 4, 8, 12], name: 'Primera columna' },
  { type: 'column', positions: [1, 5, 9, 13], name: 'Segunda columna' },
  { type: 'column', positions: [2, 6, 10, 14], name: 'Tercera columna' },
  { type: 'column', positions: [3, 7, 11, 15], name: 'Cuarta columna' },

  // Diagonales
  { type: 'diagonal', positions: [0, 5, 10, 15], name: 'Diagonal principal' },
  { type: 'diagonal', positions: [3, 6, 9, 12], name: 'Diagonal secundaria' }
]

/**
 * Verifica si un jugador ha ganado
 */
export function checkPlayerVictory(player: Player, calledCards?: LoteriaCard[]): WinPattern | null {
  // Verificar que el jugador tiene un tablero válido
  if (!player.board || player.board.length !== 16) {
    console.warn(`⚠️ ${player.name} tiene un tablero inválido: ${player.board?.length || 0} cartas`)
    return null
  }

  // Verificar que el jugador tiene al menos 4 cartas marcadas (mínimo para ganar)
  if (player.markedCards.size < 4) {
    return null
  }

  // Crear set de cartas cantadas para verificación rápida
  const calledCardIds = new Set(calledCards?.map(card => card.id) || [])

  // Verificar cada patrón de victoria
  for (const pattern of WIN_PATTERNS) {
    let hasWinningPattern = true
    const markedPositions: number[] = []
    const patternCards: LoteriaCard[] = []

    for (const position of pattern.positions) {
      const cardAtPosition = player.board[position]
      if (!cardAtPosition || !player.markedCards.has(cardAtPosition.id)) {
        hasWinningPattern = false
        break
      }

      // VERIFICACIÓN CRÍTICA: La carta debe haber sido cantada
      if (calledCards && !calledCardIds.has(cardAtPosition.id)) {
        console.warn(`⚠️ ${player.name} tiene marcada la carta ${cardAtPosition.name} pero no fue cantada`)
        hasWinningPattern = false
        break
      }

      markedPositions.push(position)
      patternCards.push(cardAtPosition)
    }

    if (hasWinningPattern) {
      console.log(`🏆 ${player.name} completó patrón ${pattern.name} en posiciones:`, markedPositions)
      console.log(`🏆 Cartas del patrón ganador:`, patternCards.map(c => c.name))

      // Verificación adicional: mostrar cuántas cartas fueron cantadas
      if (calledCards) {
        console.log(`📊 Total de cartas cantadas: ${calledCards.length}`)
        console.log(`📊 Cartas cantadas:`, calledCards.map(c => c.name))
      }

      return pattern
    }
  }

  return null
}

/**
 * Verifica victorias para todos los jugadores y devuelve los ganadores
 */
export function checkAllPlayersVictory(players: Player[], calledCards?: LoteriaCard[]): Array<{ player: Player; pattern: WinPattern }> {
  const winners: Array<{ player: Player; pattern: WinPattern }> = []

  for (const player of players) {
    const winPattern = checkPlayerVictory(player, calledCards)
    if (winPattern) {
      winners.push({ player, pattern: winPattern })
    }
  }

  return winners
}

/**
 * Valida que una carta marcada sea correcta
 */
export function validateCardMark(player: Player, cardId: number, currentCard: LoteriaCard | null): boolean {
  // Verificar que hay una carta actual
  if (!currentCard) {
    return false
  }

  // Verificar que la carta marcada coincide con la carta actual
  if (currentCard.id !== cardId) {
    return false
  }

  // Verificar que el jugador tiene la carta en su tablero
  const hasCardInBoard = player.board.some(card => card.id === cardId)
  if (!hasCardInBoard) {
    return false
  }

  // Verificar que la carta no esté ya marcada
  if (player.markedCards.has(cardId)) {
    return false
  }

  return true
}

/**
 * Obtiene el progreso de victoria de un jugador (porcentaje de completitud del mejor patrón)
 */
export function getPlayerVictoryProgress(player: Player, calledCards?: LoteriaCard[]): {
  bestPattern: WinPattern | null
  progress: number
  completedPositions: number
  totalPositions: number
} {
  let bestPattern: WinPattern | null = null
  let maxProgress = 0
  let bestCompletedPositions = 0

  // Crear set de cartas cantadas para verificación rápida
  const calledCardIds = new Set(calledCards?.map(card => card.id) || [])

  for (const pattern of WIN_PATTERNS) {
    let completedPositions = 0

    for (const position of pattern.positions) {
      const cardAtPosition = player.board[position]
      if (cardAtPosition && player.markedCards.has(cardAtPosition.id)) {
        // Solo contar si la carta fue cantada (o si no estamos verificando cartas cantadas)
        if (!calledCards || calledCardIds.has(cardAtPosition.id)) {
          completedPositions++
        }
      }
    }

    const progress = (completedPositions / pattern.positions.length) * 100

    if (progress > maxProgress) {
      maxProgress = progress
      bestPattern = pattern
      bestCompletedPositions = completedPositions
    }
  }

  return {
    bestPattern,
    progress: maxProgress,
    completedPositions: bestCompletedPositions,
    totalPositions: bestPattern?.positions.length || 4
  }
}

/**
 * Obtiene todas las cartas que un jugador necesita para ganar
 */
export function getRequiredCardsForVictory(player: Player): LoteriaCard[] {
  const requiredCards: LoteriaCard[] = []
  const addedCardIds = new Set<number>()

  for (const pattern of WIN_PATTERNS) {
    for (const position of pattern.positions) {
      const cardAtPosition = player.board[position]
      if (cardAtPosition && !player.markedCards.has(cardAtPosition.id)) {
        if (!addedCardIds.has(cardAtPosition.id)) {
          requiredCards.push(cardAtPosition)
          addedCardIds.add(cardAtPosition.id)
        }
      }
    }
  }

  return requiredCards
}

/**
 * Verifica si múltiples jugadores ganaron simultáneamente
 */
export function handleSimultaneousWinners(winners: Array<{ player: Player; pattern: WinPattern }>): {
  primaryWinner: Player
  simultaneousWinners: Player[]
  winDetails: Array<{ player: Player; pattern: WinPattern }>
} {
  if (winners.length === 0) {
    throw new Error('No hay ganadores para procesar')
  }

  if (winners.length === 1) {
    return {
      primaryWinner: winners[0].player,
      simultaneousWinners: [],
      winDetails: winners
    }
  }

  // En caso de múltiples ganadores, priorizar por tipo de jugador
  // En un empate, el bot gana (para hacer el juego más desafiante)
  const humanWinners = winners.filter(w => w.player.type === 'human')
  const botWinners = winners.filter(w => w.player.type === 'bot')

  let primaryWinner: Player
  let simultaneousWinners: Player[]

  if (botWinners.length > 0) {
    // Si hay bots ganadores, el primer bot es el ganador principal
    primaryWinner = botWinners[0].player
    simultaneousWinners = [...botWinners.slice(1), ...humanWinners].map(w => w.player)
  } else {
    // Si solo hay humanos ganadores
    primaryWinner = humanWinners[0].player
    simultaneousWinners = humanWinners.slice(1).map(w => w.player)
  }

  console.log(`🏆 Manejo de ganadores simultáneos: Principal=${primaryWinner.name}, Simultáneos=[${simultaneousWinners.map(p => p.name).join(', ')}]`)

  return {
    primaryWinner,
    simultaneousWinners,
    winDetails: winners
  }
}