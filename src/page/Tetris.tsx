import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/Button"

// Tetromino shapes
const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]]
}

const COLORS = {
  I: 'bg-cyan-500',
  J: 'bg-blue-500',
  L: 'bg-orange-500',
  O: 'bg-yellow-500',
  S: 'bg-green-500',
  T: 'bg-purple-500',
  Z: 'bg-red-500'
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

export default function Tetris() {
  
    const createEmptyBoard = () => 
      Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const spawnPiece = useCallback(() => {
    const pieceTypes = Object.keys(TETROMINOS)
    const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)]
    const piece = {
      type: randomType,
      shape: TETROMINOS[randomType],
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOS[randomType][0].length / 2),
      y: 0
    }
    setCurrentPiece(piece)
  }, [])

  const isCollision = (piece, board) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = piece.x + x
          const boardY = piece.y + y
          if (
            boardY >= BOARD_HEIGHT ||
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            (board[boardY] && board[boardY][boardX])
          ) {
            return true
          }
        }
      }
    }
    return false
  }

  const mergePieceToBoard = (piece, board) => {
    const newBoard = board.map(row => [...row])
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          newBoard[piece.y + y][piece.x + x] = piece.type
        }
      })
    })
    return newBoard
  }

  const movePiece = (dx, dy) => {
    if (!currentPiece) return
    const newPiece = {
      ...currentPiece,
      x: currentPiece.x + dx,
      y: currentPiece.y + dy
    }
    if (!isCollision(newPiece, board)) {
      setCurrentPiece(newPiece)
    } else if (dy > 0) {
      // If moving down causes a collision, merge the piece and spawn a new one
      setBoard(prevBoard => mergePieceToBoard(currentPiece, prevBoard))
      spawnPiece()
    }
  }

  const rotatePiece = () => {
    if (!currentPiece) return
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    )
    const newPiece = {
      ...currentPiece,
      shape: rotatedShape
    }
    if (!isCollision(newPiece, board)) {
      setCurrentPiece(newPiece)
    }
  }

  const clearLines = useCallback(() => {
    const newBoard = board.filter(row => row.some(cell => cell === 0))
    const clearedLines = BOARD_HEIGHT - newBoard.length
    const newScore = score + clearedLines * 100
    setScore(newScore)
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0))
    }
    setBoard(newBoard)
  }, [board, score])

  const gameLoop = useCallback(() => {
    if (!currentPiece) {
      spawnPiece()
    } else {
      movePiece(0, 1)
    }
    clearLines()
  }, [currentPiece, spawnPiece, clearLines])

  useEffect(() => {
    if (gameOver) return
    const intervalId = setInterval(gameLoop, 1000)
    return () => clearInterval(intervalId)
  }, [gameLoop, gameOver])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0)
          break
        case 'ArrowRight':
          movePiece(1, 0)
          break
        case 'ArrowDown':
          movePiece(0, 1)
          break
        case 'ArrowUp':
          rotatePiece()
          break
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPiece, board, gameOver])

  useEffect(() => {
    if (currentPiece && isCollision(currentPiece, board)) {
      setGameOver(true)
    }
  }, [currentPiece, board])

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
    setGameOver(false)
    setScore(0)
    spawnPiece()
  }

  const renderBoard = () => {
    const boardWithPiece = board.map(row => [...row])
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = currentPiece.y + y
            const boardX = currentPiece.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              boardWithPiece[boardY][boardX] = currentPiece.type
            }
          }
        })
      })
    }

    return boardWithPiece.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-gray-700 ${cell ? COLORS[cell] : 'bg-gray-900'}`}
          />
        ))}
      </div>
    ))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Tetris</h1>
      <div className="border-4 border-gray-600 p-2 mb-4">
        {renderBoard()}
      </div>
      <div className="text-2xl mb-4">Score: {score}</div>
      {gameOver && (
        <div className="text-2xl mb-4 text-red-500">Game Over!</div>
      )}
      <Button onClick={resetGame} className="px-4 py-2 bg-blue-500 text-white rounded">
        {gameOver ? 'Play Again' : 'Reset Game'}
      </Button>
      <div className="mt-4 text-sm">
        Use arrow keys to move and rotate the pieces
      </div>
    </div>
  )
}