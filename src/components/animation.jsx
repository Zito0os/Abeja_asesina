import { useEffect, useState } from 'react'
import spriteSheet from '../assets/spritesheet.png'

const TOTAL_FRAMES = 36
const COLUMNS = 4
const ROWS = 9

export function PaperUnfold({ onComplete }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrame((current) => {
        if (current >= TOTAL_FRAMES - 1) {
          window.clearInterval(interval)
          onComplete?.()
          return current
        }

        return current + 1
      })
    }, 24)

    return () => window.clearInterval(interval)
  }, [onComplete])

  const column = COLUMNS - 1 - (frame % COLUMNS)
  const row = ROWS - 1 - Math.floor(frame / COLUMNS)
  const x = (column / (COLUMNS - 1)) * 100
  const y = (row / (ROWS - 1)) * 100

  return (
    <div
      className="sprite-sheet"
      style={{
        backgroundImage: `url(${spriteSheet})`,
        backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
        backgroundPosition: `${x}% ${y}%`,
      }}
    />
  )
}