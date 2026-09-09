import { useState, useEffect, useRef } from 'react'
import './PianoTiles.css'

const NUM_COLS = 4

export function PianoTiles() {
  const [tiles, setTiles] = useState([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [playerLane, setPlayerLane] = useState(0)
  const speedRef = useRef(3)
  const animFrameRef = useRef(null)

  const startGame = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
    setPlayerLane(0)
    speedRef.current = 3

    const initialTiles = Array.from({ length: 6 }, (_, index) => ({
      id: Date.now() + index,
      lane: Math.floor(Math.random() * NUM_COLS),
      y: index * -110 - 80,
      hit: false,
    }))

    setTiles(initialTiles)
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const updateGame = () => {
      setTiles((prevTiles) => {
        let failed = false
        const nextTiles = []

        for (const tile of prevTiles) {
          const nextY = tile.y + speedRef.current

          if (nextY > 500 && !tile.hit) {
            failed = true
            break
          }

          const updatedTile = { ...tile, y: nextY }

          if (updatedTile.y > 395 && updatedTile.y < 470 && updatedTile.lane === playerLane) {
            updatedTile.hit = true
            setScore((currentScore) => currentScore + 1)
            speedRef.current += 0.04
          }

          if (!updatedTile.hit && updatedTile.y < 620) {
            nextTiles.push(updatedTile)
          }
        }

        if (failed) {
          setGameOver(true)
          return prevTiles
        }

        if (nextTiles.length < 5) {
          const nextLane = Math.floor(Math.random() * NUM_COLS)
          nextTiles.push({
            id: Date.now() + Math.random(),
            lane: nextLane,
            y: -130,
            hit: false,
          })
        }

        return nextTiles
      })

      animFrameRef.current = requestAnimationFrame(updateGame)
    }

    animFrameRef.current = requestAnimationFrame(updateGame)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [gameStarted, gameOver, playerLane])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameStarted || gameOver) return

      const keyToLane = {
        d: 0,
        f: 1,
        j: 2,
        k: 3,
      }

      const laneIndex = keyToLane[event.key.toLowerCase()]
      if (laneIndex === undefined) return

      event.preventDefault()
      setPlayerLane(laneIndex)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver])

  const handleBoardClick = (event) => {
    if (!gameStarted || gameOver) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const laneIndex = Math.min(NUM_COLS - 1, Math.max(0, Math.floor((x / rect.width) * NUM_COLS)))
    setPlayerLane(laneIndex)
  }

  return (
    <div className="piano-container">
      <div className="piano-header">
        <h2>Puntaje: {score}</h2>
        <p className="keyboard-hint">Usa D, F, J y K para mover la bolita</p>
        {!gameStarted && <button onClick={startGame}>Iniciar Juego</button>}
      </div>

      <div className="tile-board" onClick={handleBoardClick}>
        {[0, 1, 2, 3].map((colIndex) => (
          <div key={colIndex} className="tile-col" />
        ))}

        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`tile-item ${tile.hit ? 'clicked' : ''}`}
            style={{
              top: `${tile.y}px`,
              left: `${(tile.lane + 0.5) * 25}%`,
            }}
          />
        ))}

        <div
          className="player-ball"
          style={{
            left: `${(playerLane + 0.5) * 25}%`,
          }}
        />

        {gameOver && (
          <div className="game-over-overlay">
            <h3>¡Game Over!</h3>
            <p>Puntaje final: {score}</p>
            <button onClick={startGame}>Reintentar</button>
          </div>
        )}
      </div>
    </div>
  )
}