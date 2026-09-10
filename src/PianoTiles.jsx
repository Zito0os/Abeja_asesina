import { useState, useEffect, useRef } from 'react'
import PastoBackground from './assets/PastoBackground.png'
import AbejaJugador from './assets/AbejaJugador.png'
import FlorPolen from './assets/FlorPolen.png'
import DepredadoraObstaculo from './assets/DepredadoraObstaculo.png'
import './PianoTiles.css'

const NUM_COLS = 4

export function PianoTiles() {
  const [tiles, setTiles] = useState([])
  const [score, setScore] = useState(0)
  const [obstacleHits, setObstacleHits] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [playerLane, setPlayerLane] = useState(0)
  const speedRef = useRef(3)
  const animFrameRef = useRef(null)
  const processedHitsRef = useRef(new Set())

  const startGame = () => {
    processedHitsRef.current.clear()
    setScore(0)
    setObstacleHits(0)
    setGameOver(false)
    setGameStarted(true)
    setPlayerLane(0)
    speedRef.current = 3

    const initialTiles = Array.from({ length: 6 }, (_, index) => ({
      id: Date.now() + index,
      lane: Math.floor(Math.random() * NUM_COLS),
      y: index * -110 - 80,
      hit: false,
      hitAt: null,
      type: Math.random() < 0.2 ? 'obstacle' : 'note',
    }))

    setTiles(initialTiles)
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const updateGame = () => {
      const now = performance.now()

      setTiles((prevTiles) => {
        const nextTiles = []

        for (const tile of prevTiles) {
          const nextY = tile.y + speedRef.current
          const updatedTile = { ...tile, y: nextY }

          // Detección de colisión con la bola
          if (updatedTile.y > 395 && updatedTile.y < 470 && updatedTile.lane === playerLane) {
            const tileWasAlreadyProcessed = processedHitsRef.current.has(updatedTile.id)

            if (!tileWasAlreadyProcessed) {
              processedHitsRef.current.add(updatedTile.id)
              updatedTile.hit = true
              updatedTile.hitAt = now

              if (updatedTile.type === 'note') {
                setScore((currentScore) => currentScore + 1)
                speedRef.current += 0.04
              } else {
                setObstacleHits((currentHits) => {
                  const nextHits = currentHits + 1
                  if (nextHits >= 3) {
                    setGameOver(true)
                  }
                  return nextHits
                })
              }
            }
          }

          // Procesamiento de piezas colisionadas (animaciones de salida)
          if (updatedTile.hit) {
            const hitDuration = updatedTile.hitAt ? now - updatedTile.hitAt : 0

            if (updatedTile.type === 'note') {
              if (hitDuration < 90 && updatedTile.y < 620) {
                nextTiles.push(updatedTile)
              }
              continue
            }

            if (updatedTile.type === 'obstacle') {
              if (hitDuration < 350 && updatedTile.y < 620) {
                nextTiles.push(updatedTile)
              }
              continue
            }
          }

          // Piezas no tocadas que aún están dentro del canvas
          if (!updatedTile.hit && updatedTile.y < 620) {
            nextTiles.push(updatedTile)
          }
        }

        // Mantiene una densidad constante de 5 o más piezas
        if (nextTiles.length < 5) {
          const nextLane = Math.floor(Math.random() * NUM_COLS)
          const nextType = Math.random() < 0.2 ? 'obstacle' : 'note'

          nextTiles.push({
            id: Date.now() + Math.random(),
            lane: nextLane,
            y: -130,
            hit: false,
            hitAt: null,
            type: nextType,
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
        <p className="keyboard-hint">Usa D, F, J y K para mover la abeja</p>
        {!gameStarted && <button onClick={startGame}>Iniciar Juego</button>}
      </div>

      <div
  className="tile-board"
  onClick={handleBoardClick}
  style={{
    backgroundImage: `url(${PastoBackground})`,
  }}
>
        {[0, 1, 2, 3].map((colIndex) => (
          <div key={colIndex} className="tile-col" />
        ))}

        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`tile-item ${tile.type === 'obstacle' ? 'obstacle' : ''} ${tile.type === 'obstacle' && tile.hit ? 'obstacle-hit' : ''} ${tile.type === 'note' && tile.hit ? 'note-hit' : ''}`}
            style={{
              top: `${tile.y}px`,
              left: `${(tile.lane + 0.5) * 25}%`,
              ...(tile.type === 'note'
                ? {
                    backgroundImage: `url(${FlorPolen})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent',
                  }
                : tile.type === 'obstacle'
                  ? {
                      backgroundImage: `url(${DepredadoraObstaculo})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: 'transparent',
                    }
                  : {}),
            }}
          />
        ))}

        <div
          className="player-ball"
          style={{
            left: `${(playerLane + 0.5) * 25}%`,
            backgroundImage: `url(${AbejaJugador})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            boxShadow: 'none',
          }}
        />

        <div className="game-status">
          <span className="status-pill status-obstacle">Obstáculos: {obstacleHits}/3</span>
          <span className="status-pill status-score">Puntos: {score}</span>
        </div>

        {gameOver && (
          <div className="game-over-overlay">
            <h3>{score >= 50 ? '¡Felicidades! Eres una super abeja polinizadora' : 'Sigue polinizando'}</h3>
            <p>Puntaje final: {score}</p>
            <button onClick={startGame}>Reintentar</button>
          </div>
        )}
      </div>
    </div>
  )
}