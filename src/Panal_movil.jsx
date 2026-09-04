import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import './Panal_movil.css'

const bees = [
  { id: 1, title: 'La abeja obrera', text: 'Las abejas obreras realizan distintas tareas dentro de la colmena.' },
  { id: 2, title: 'La polinización', text: 'Las abejas ayudan a polinizar una gran cantidad de plantas y cultivos.' },
  { id: 3, title: 'La colmena', text: 'Una colonia puede trabajar de forma coordinada como una enorme comunidad.' },
  { id: 4, title: 'La reina', text: 'La abeja reina es fundamental para mantener la colonia.' },
  { id: 5, title: 'La miel', text: 'La miel es el resultado del trabajo colectivo de miles de abejas.' },
]

const cells = Array.from({ length: 19 }, (_, index) => bees[index % bees.length])
const cellRows = [3, 4, 5, 4, 3]

function Panal({ bee, onClose }) {
  const [selectedCell, setSelectedCell] = useState(bee)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const panalRef = useRef(null)
  const gridRef = useRef(null)
  const dragRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0, pressed: false, dragging: false, moved: false })

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handlePointerDown = (event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
      pressed: true,
      dragging: false,
      moved: false,
    }
    setIsDragging(false)
  }

  const handlePointerMove = (event) => {
    const gridWidth = gridRef.current?.scrollWidth ?? 0
    const gridHeight = gridRef.current?.scrollHeight ?? 0
    const panLimit = Math.max(
      0,
      (Math.max(gridWidth - window.innerWidth, gridHeight - window.innerHeight)) / 2,
    )

    if (!dragRef.current.pressed) {
      const horizontalDirection = (window.innerWidth / 2 - event.clientX) / (window.innerWidth / 2)
      const verticalDirection = (window.innerHeight / 2 - event.clientY) / (window.innerHeight / 2)
      const nextX = horizontalDirection * panLimit
      const nextY = verticalDirection * panLimit

      setOffset({
        x: Math.max(-panLimit, Math.min(panLimit, nextX)),
        y: Math.max(-panLimit, Math.min(panLimit, nextY)),
      })
      return
    }

    const distanceX = event.clientX - dragRef.current.x
    const distanceY = event.clientY - dragRef.current.y

    if (!dragRef.current.dragging && Math.hypot(distanceX, distanceY) > 5) {
      dragRef.current.dragging = true
      dragRef.current.moved = true
      setIsDragging(true)
    }

    if (!dragRef.current.dragging) return

    const nextX = dragRef.current.offsetX + event.clientX - dragRef.current.x
    const nextY = dragRef.current.offsetY + event.clientY - dragRef.current.y

    setOffset({
      x: Math.max(-panLimit, Math.min(panLimit, nextX)),
      y: Math.max(-panLimit, Math.min(panLimit, nextY)),
    })
  }

  const handlePointerUp = (event) => {
    if (panalRef.current?.hasPointerCapture(event.pointerId)) {
      panalRef.current.releasePointerCapture(event.pointerId)
    }
    dragRef.current.pressed = false
    dragRef.current.dragging = false
    setIsDragging(false)
  }

  const handleCellClick = (cell) => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false
      return
    }

    setSelectedCell(cell)
  }


  return (
    <motion.section className="Panal-movil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Explorador del panal">
      <button className="Panal-cerrar" type="button" onClick={onClose} aria-label="Cerrar panal">×</button>
      <header className="Panal-encabezado">
        <span className="Panal-indicador">EXPLORACIÓN {String(bee.id).padStart(2, '0')}</span>
        <h2>{selectedCell.title}</h2>
        <p>{selectedCell.text}</p>
      </header>
      <div className={`Panal-visor ${isDragging ? 'arrastrando' : ''}`} ref={panalRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        <div className="Panal-centro">
          <motion.div ref={gridRef} className="Panal-grid" animate={{ x: offset.x, y: offset.y }} transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 24, mass: 0.7 }}>
            {cellRows.map((rowSize, rowIndex) => {
              const rowStart = cellRows.slice(0, rowIndex).reduce((total, size) => total + size, 0)

              return (
                <div className="Panal-fila" key={`${rowSize}-${rowIndex}`}>
                  {cells.slice(rowStart, rowStart + rowSize).map((cell, rowOffset) => {
                    const index = rowStart + rowOffset

                    return (
                      <button className={`Panal-celda ${index === 9 ? 'activa' : ''}`} key={`${cell.id}-${index}`} type="button" onClick={() => handleCellClick(cell)} aria-label={`Panal número ${index + 1}: ${cell.title}`}>
                        <span>{index === 9 ? '1' : index < 9 ? index + 2 : index + 1}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
      <div className="Panal-pista">Mueve el puntero para recorrer la colonia</div>
    </motion.section>
  )
}

export default Panal