import { useState, useEffect, useRef } from 'react'

import PastoBackground from './assets/PastoBackground.png'
import Backround from './assets/fondo_amarillo.jpeg'
import AbejaJugador from './assets/AbejaJugador.png'
import FlorPolen from './assets/FlorPolen.png'
import Araña_a from './assets/araña_animada.png'
import Abeja_player from './assets/abeja_simple.png'
import Flor_cartoon from './assets/flor_cartoon.png'
import DepredadoraObstaculo from './assets/DepredadoraObstaculo.png'
import './PianoTiles.css'

const NUM_COLS = 4
const BOARD_HEIGHT = 600
const PLAYER_HEIGHT = 54
const PLAYER_BOTTOM_OFFSET = 14
const PLAYER_TOP = BOARD_HEIGHT - PLAYER_BOTTOM_OFFSET - PLAYER_HEIGHT
const PLAYER_BOTTOM = PLAYER_TOP + PLAYER_HEIGHT
const TILE_HEIGHT = 76
const MISS_LINE_MARGIN = 5
const MISS_LINE_Y = PLAYER_BOTTOM + MISS_LINE_MARGIN
const OBSTACLE_OVERLAP_THRESHOLD = 0.65 // Ajusta esto entre 0 y 1 (0.65 = 65%)

export function PianoTiles() {
  const [tiles, setTiles] = useState([])
  const [score, setScore] = useState(0)
  const [obstacleHits, setObstacleHits] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [playerLane, setPlayerLane] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [flashId, setFlashId] = useState(0)
  const [scoreFlashId, setScoreFlashId] = useState(0)
  const [showHitboxes, setShowHitboxes] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  const speedRef = useRef(2)
  const animFrameRef = useRef(null)
  const processedHitsRef = useRef(new Set())
  const shakeTimeoutRef = useRef(null)

  // Calcula el porcentaje de superposición vertical entre dos rectángulos
  const calculateOverlapPercentage = (
    tileTop,
    tileBottom,
    playerTop,
    playerBottom
  ) => {
    const overlapStart = Math.max(tileTop, playerTop)
    const overlapEnd = Math.min(tileBottom, playerBottom)
    const overlapHeight = Math.max(0, overlapEnd - overlapStart)
    const tileHeight = tileBottom - tileTop
    
    return tileHeight > 0 ? overlapHeight / tileHeight : 0
  }

  const triggerHitFeedback = () => {
    setFlashId((id) => id + 1)
    setIsShaking(true)

    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current)
    }

    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false)
    }, 400)
  }

  const triggerScoreFeedback = () => {
    setScoreFlashId((id) => id + 1)
  }

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current)
      }
    }
  }, [])

  const startGame = () => {
    processedHitsRef.current.clear()

    setScore(0)
    setObstacleHits(0)
    setGameOver(false)
    setGameStarted(true)
    setPlayerLane(0)
    setIsShaking(false)

    speedRef.current = 2

    const initialTiles = Array.from({ length: 6 }, (_, index) => ({
      id: Date.now() + index,
      lane: Math.floor(Math.random() * NUM_COLS),
      y: index * -110 - 80,
      hit: false,
      hitAt: null,
      type: Math.random() < 0.2 ? 'obstacle' : 'note'
    }))

    setTiles(initialTiles)
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const updateGame = () => {
      const now = performance.now()

      setTiles((prevTiles) => {
        const movedTiles = prevTiles.map((tile) => {
          const nextY = tile.y + speedRef.current
          const tileTop = nextY
          const tileBottom = nextY + TILE_HEIGHT

          const overlapsPlayer =
            tileTop < PLAYER_BOTTOM &&
            tileBottom > PLAYER_TOP

          const inPlayerLane = tile.lane === playerLane
          const alreadyProcessed =
            processedHitsRef.current.has(tile.id)

          // Para notas: solo requiere superposición simple
          // Para obstáculos: requiere al menos 65% de superposición
          const isValidHit =
            tile.type === 'note'
              ? overlapsPlayer
              : overlapsPlayer &&
                calculateOverlapPercentage(
                  tileTop,
                  tileBottom,
                  PLAYER_TOP,
                  PLAYER_BOTTOM
                ) >= OBSTACLE_OVERLAP_THRESHOLD

          if (
            isValidHit &&
            inPlayerLane &&
            !alreadyProcessed &&
            !tile.hit
          ) {
            processedHitsRef.current.add(tile.id)

            if (tile.type === 'note') {
              setScore((currentScore) => currentScore + 1)
              speedRef.current += 0.02
              triggerScoreFeedback()
            } else {
              setObstacleHits((currentHits) => {
                const nextHits = currentHits + 1

                if (nextHits >= 3) {
                  setGameOver(true)
                }

                return nextHits
              })

              triggerHitFeedback()
            }

            return {
              ...tile,
              y: nextY,
              hit: true,
              hitAt: now
            }
          }

          const prevTileBottom = tile.y + TILE_HEIGHT
          const crossedMissLine =
            prevTileBottom < MISS_LINE_Y &&
            tileBottom >= MISS_LINE_Y

          if (
            tile.type === 'note' &&
            !tile.hit &&
            !alreadyProcessed &&
            crossedMissLine
          ) {
            processedHitsRef.current.add(tile.id)

            setObstacleHits((currentHits) => {
              const nextHits = currentHits + 1

              if (nextHits >= 3) {
                setGameOver(true)
              }

              return nextHits
            })

            triggerHitFeedback()

            return {
              ...tile,
              y: nextY,
              hit: true,
              hitAt: now
            }
          }

          return {
            ...tile,
            y: nextY
          }
        })

        const nextTiles = movedTiles.filter((tile) => {
          if (tile.type === 'note' && tile.hit) {
            return false
          }

          if (tile.type === 'obstacle' && tile.hit) {
            const hitDuration = tile.hitAt
              ? now - tile.hitAt
              : 0

            return hitDuration < 350 && tile.y < 620
          }

          return tile.y < 620
        })

        const MIN_LANE_GAP = 160
        const SPAWN_Y = -130

        if (nextTiles.length < 5) {
          const laneCandidates = Array.from(
            { length: NUM_COLS },
            (_, lane) => lane
          ).filter((lane) => {
            const topmostYInLane = nextTiles
              .filter((t) => t.lane === lane)
              .reduce(
                (minY, t) => Math.min(minY, t.y),
                Infinity
              )

            return (
              topmostYInLane >
              SPAWN_Y + MIN_LANE_GAP
            )
          })

          if (laneCandidates.length > 0) {
            const nextLane =
              laneCandidates[
                Math.floor(
                  Math.random() * laneCandidates.length
                )
              ]

            const nextType =
              Math.random() < 0.2
                ? 'obstacle'
                : 'note'

            nextTiles.push({
              id: Date.now() + Math.random(),
              lane: nextLane,
              y: SPAWN_Y,
              hit: false,
              hitAt: null,
              type: nextType
            })
          }
        }

        return nextTiles
      })

      animFrameRef.current =
        requestAnimationFrame(updateGame)
    }

    animFrameRef.current =
      requestAnimationFrame(updateGame)

    return () =>
      cancelAnimationFrame(animFrameRef.current)
  }, [gameStarted, gameOver, playerLane])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameStarted || gameOver) return

      const key = event.key.toLowerCase()
      let newLane = playerLane

      const directLaneMap = {
        f: 0,
        g: 1,
        j: 2,
        k: 3
      }

      if (directLaneMap[key] !== undefined) {
        newLane = directLaneMap[key]
        event.preventDefault()
      } else if (
        key === 'arrowleft' ||
        key === 'a'
      ) {
        newLane = Math.max(
          0,
          playerLane - 1
        )

        event.preventDefault()
      } else if (
        key === 'arrowright' ||
        key === 'd'
      ) {
        newLane = Math.min(
          NUM_COLS - 1,
          playerLane + 1
        )

        event.preventDefault()
      } else {
        return
      }

      setPlayerLane(newLane)
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
  }, [gameStarted, gameOver, playerLane])

  const handleBoardClick = (event) => {
    if (!gameStarted || gameOver) return

    const rect =
      event.currentTarget.getBoundingClientRect()

    const x = event.clientX - rect.left

    const laneIndex = Math.min(
      NUM_COLS - 1,
      Math.max(
        0,
        Math.floor(
          (x / rect.width) * NUM_COLS
        )
      )
    )

    setPlayerLane(laneIndex)
  }

  return (
    <div className="piano-container">
      <div className="piano-header">
       

        <div className="piano-header-controls">
          {!gameStarted && (
            <button onClick={startGame} className="piano-start-button">
              Iniciar Juego
            </button>
          )}

          <button
            type="button"
            className="piano-instructions-button"
            onClick={() => setShowInstructions(!showInstructions)}
            aria-label="Ver instrucciones del juego"
          >
            ?
          </button>

          {/* 
          <button
            type="button"
            className="hitbox-toggle-button"
            onClick={() =>
              setShowHitboxes(
                (value) => !value
              )
            }
          >
            {showHitboxes
              ? 'Ocultar cajas de colisión'
              : 'Ver cajas de colisión'}
          </button>
          */}
        </div>

        {showInstructions && (
          <div className="piano-instructions-modal">
            <div className="piano-instructions-content">
              <button
                className="piano-instructions-close"
                onClick={() => setShowInstructions(false)}
                aria-label="Cerrar instrucciones"
              >
                ×
              </button>
              
              <h3>¿Cómo Jugar?</h3>
              
              <div className="piano-instructions-text">
                <p><strong>Objetivo:</strong> Recoge todas las flores sin ser atrapado por las arañas.</p>
                
                <p><strong>Controles:</strong></p>
                <ul>
                  <li><code>←</code> <code>→</code> - Mover izquierda/derecha</li>
                  <li><code>A</code> <code>D</code> - Mover izquierda/derecha</li>
                  <li><code>F</code> <code>G</code> <code>J</code> <code>K</code> - Ir directamente a ese carril</li>
                  <li>Toca la pantalla en móvil para moverte</li>
                </ul>

                <p><strong>Reglas:</strong></p>
                <ul>
                  <li>Recolecta flores (amarillas) para ganar puntos</li>
                  <li>Evita las arañas (negras) - son tus enemigos</li>
                  <li>Pierdes una vida si una araña te toca</li>
                  <li>Pierdes una vida si una flor cruza la línea roja de muerte</li>
                  <li>3 vidas y es GAME OVER</li>
                </ul>

                <p><strong>¡Buena suerte!</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className={`tile-board ${
          isShaking ? 'shaking' : ''
        }`}
        onClick={handleBoardClick}
        style={{
          backgroundImage:
            `url(${Backround})`
        }}
      >
        {[0, 1, 2, 3].map((colIndex) => (
          <div
            key={colIndex}
            className="tile-col"
          />
        ))}

        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={`tile-item ${
              tile.type === 'obstacle'
                ? 'obstacle'
                : ''
            } ${
              tile.type === 'obstacle' &&
              tile.hit
                ? 'obstacle-hit'
                : ''
            } ${
              tile.type === 'note' &&
              tile.hit
                ? 'note-hit'
                : ''
            }`}
            style={{
              top: `${tile.y}px`,
              left: `${(tile.lane + 0.5) * 25}%`,
              ...(tile.type === 'note'
                ? {
                    backgroundImage:
                      `url(${Flor_cartoon})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent'
                  }
                : tile.type === 'obstacle'
                  ? {
                      backgroundImage:
                        `url(${Araña_a})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: 'transparent'
                    }
                  : {})
            }}
          />
        ))}

        <div
          className="player-ball"
          style={{
            left:
              `${(playerLane + 0.5) * 25}%`,
            backgroundImage:
              `url(${Abeja_player})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            boxShadow: 'none'
          }}
        />

        {gameStarted && (
          <div
            className="miss-line"
            style={{
              top: `${MISS_LINE_Y}px`
            }}
          >
            <span className="miss-line-label">
              Si cruza aquí, pierdes vida
            </span>
          </div>
        )}

        {showHitboxes && (
          <div
            className="hitbox-debug hitbox-debug-player"
            style={{
              left:
                `${playerLane * 25}%`,
              top:
                `${PLAYER_TOP}px`,
              height:
                `${PLAYER_BOTTOM - PLAYER_TOP}px`
            }}
          />
        )}

        {showHitboxes &&
          tiles.map((tile) => (
            <div
              key={`hitbox-${tile.id}`}
              className="hitbox-debug hitbox-debug-tile"
              style={{
                left:
                  `${tile.lane * 25}%`,
                top:
                  `${tile.y}px`,
                height:
                  `${TILE_HEIGHT}px`
              }}
            />
          ))}

        {flashId > 0 && (
          <div
            key={flashId}
            className="hit-flash-overlay"
          />
        )}

        {scoreFlashId > 0 && (
          <div
            key={scoreFlashId}
            className="score-flash-overlay"
          />
        )}

        <div className="game-status">
          <span className="status-pill status-obstacle">
            Vidas perdidas: {obstacleHits}/3
          </span>

          <span className="status-pill status-score">
            Puntos: {score}
          </span>
        </div>

        {gameOver && (
          <div className="game-over-overlay">
            <h3>
              {score >= 50
                ? '¡Felicidades! Eres una super abeja polinizadora'
                : 'Sigue polinizando'}
            </h3>

            <p>
              Puntaje final: {score}
            </p>

            <button onClick={startGame}>
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}