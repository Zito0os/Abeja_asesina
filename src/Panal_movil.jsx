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
  const panalRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handlePointerMove = (event) => {
    const bounds = panalRef.current?.getBoundingClientRect()
    if (!bounds) return

    setOffset({
      x: (bounds.width / 2 - (event.clientX - bounds.left)) * 0.18,
      y: (bounds.height / 2 - (event.clientY - bounds.top)) * 0.18,
    })
  }


  return (
    <motion.section className="Panal-movil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Explorador del panal">
      <button className="Panal-cerrar" type="button" onClick={onClose} aria-label="Cerrar panal">×</button>
      <header className="Panal-encabezado">
        <span className="Panal-indicador">EXPLORACIÓN {String(bee.id).padStart(2, '0')}</span>
        <h2>{selectedCell.title}</h2>
        <p>{selectedCell.text}</p>
      </header>
      <div className="Panal-visor" ref={panalRef} onPointerMove={handlePointerMove}>
        <motion.div className="Panal-grid" animate={{ x: offset.x, y: offset.y }} transition={{ type: 'spring', stiffness: 100, damping: 24, mass: 0.7 }}>
          {cellRows.map((rowSize, rowIndex) => {
            const rowStart = cellRows.slice(0, rowIndex).reduce((total, size) => total + size, 0)

            return (
              <div className="Panal-fila" key={`${rowSize}-${rowIndex}`}>
                {cells.slice(rowStart, rowStart + rowSize).map((cell, rowOffset) => {
                  const index = rowStart + rowOffset

                  return (
                    <button className={`Panal-celda ${index === 9 ? 'activa' : ''}`} key={`${cell.id}-${index}`} type="button" onClick={() => setSelectedCell(cell)} aria-label={`Panal número ${index + 1}: ${cell.title}`}>
                      <span>{index === 9 ? '1' : index + 1}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </motion.div>
      </div>
      <div className="Panal-pista">Mueve el puntero para recorrer la colonia</div>
    </motion.section>
  )
}

export default Panal