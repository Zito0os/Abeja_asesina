import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'motion/react'
import './Panal_movil.css'
import { panalPorCapas } from './panalPorCapas'
import orchidBeeImage from './assets/AbejadelasOrquIdeas.png'
import carpenterBeeImage from './assets/AbejaCarpinteradelSur.png'
import meliponaBeeImage from './assets/AbejaRealMelipona.png'
import miningBeeImage from './assets/AbejadelSuelodeNoreste.png'
import agapostemonBeeImage from './assets/AbejaVerdeMetalizada.png'

const cells = panalPorCapas(35)

const beeInformation = {
  1: {
    commonName: 'Abeja de las orquídeas',
    image: orchidBeeImage,
    scientificName: 'Tribu científica Euglossini',
    where: 'Principalmente regiones tropicales de América',
    habitat: 'Bosques y zonas donde crecen orquídeas y otras plantas tropicales',
    characteristics: 'Los machos recolectan compuestos aromáticos de orquídeas, hongos y cortezas, y los almacenan en estructuras especiales de sus patas traseras.',
    importance: 'Los machos utilizan estas fragancias para atraer a las hembras. Alrededor de 600 especies de orquídeas dependen de estas abejas para su polinización.',
  },
  2: {
    commonName: 'Abeja carpintera del sur',
    image: carpenterBeeImage,
    scientificName: 'Xylocopa micans',
    where: 'Sur de Estados Unidos y regiones de México',
    habitat: 'Ramas secas y material vegetal leñoso donde construye sus nidos',
    characteristics: 'Utiliza sus fuertes mandíbulas para excavar túneles en la madera. Es de gran tamaño y produce un zumbido fuerte al volar.',
    importance: 'Es una abeja solitaria y poco agresiva. Casi nunca daña la madera estructural de casas o edificios.',
  },
  3: {
    commonName: 'Abeja melipona',
    image: meliponaBeeImage,
    scientificName: 'Melipona beecheii',
    where: 'Regiones tropicales de México y Centroamérica',
    habitat: 'Vive en colmenas dentro de troncos huecos llamados jobones',
    characteristics: 'Tiene el aguijón atrofiado y no puede picar a los humanos. Si se siente amenazada puede dar un pequeño mordisco inofensivo. Produce entre 1 y 2 litros de miel al año por colmena.',
    importance: 'Es una abeja nativa importante para la polinización y para la producción tradicional de miel.',
  },
  4: {
    commonName: 'Abeja del suelo / abeja minera',
    image: miningBeeImage,
    scientificName: 'Familia Andrenidae',
    where: 'Noreste de México y noreste de Norteamérica',
    habitat: 'Construye sus nidos bajo tierra',
    characteristics: 'No corresponde a una sola especie, sino a un gran grupo de abejas nativas solitarias.',
    importance: 'Cerca del 70 % de las especies de abejas nativas de estas regiones construyen sus nidos bajo tierra. Son importantes polinizadoras.',
  },
  5: {
    commonName: 'Abeja Agapostemon',
    image: agapostemonBeeImage,
    scientificName: 'Agapostemon, familia Halictidae',
    where: 'América del Norte y otras regiones del continente americano',
    habitat: 'Zonas con plantas silvestres y cultivos agrícolas',
    characteristics: 'Son polinizadoras generalistas y visitan plantas como girasol, tomate y alfalfa.',
    importance: 'Realizan polinización por zumbido, haciendo vibrar sus músculos de vuelo para liberar el polen de determinadas flores.',
  },
}

const beeIds = Object.keys(beeInformation).map(Number)
const PANAL_REACTION_SPEED = 0.55
const PANAL_REACTION_DISTANCE = 28

function Panal({ bee, onClose }) {
  const initialBeeId = beeInformation[bee.id] ? Number(bee.id) : beeIds[0]
  const [activeBeeId, setActiveBeeId] = useState(initialBeeId)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const currentBee = { ...beeInformation[activeBeeId] }
  const gridAnimation = useAnimation()
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

      const nextOffset = {
        x: Math.max(-panLimit, Math.min(panLimit, nextX)),
        y: Math.max(-panLimit, Math.min(panLimit, nextY)),
      }
      setOffset(nextOffset)
      gridAnimation.set(nextOffset)
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

    const nextOffset = {
      x: Math.max(-panLimit, Math.min(panLimit, nextX)),
      y: Math.max(-panLimit, Math.min(panLimit, nextY)),
    }
    setOffset(nextOffset)
    gridAnimation.set(nextOffset)
  }

  const handlePointerUp = (event) => {
    if (panalRef.current?.hasPointerCapture(event.pointerId)) {
      panalRef.current.releasePointerCapture(event.pointerId)
    }
    dragRef.current.pressed = false
    dragRef.current.dragging = false
    setIsDragging(false)
  }

  const handleCellClick = (number) => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false
      return
    }

    if (number !== 13 && number !== 19) {
      return
    }

    setActiveBeeId((currentId) => {
      const currentIndex = beeIds.indexOf(currentId)
      const direction = number === 19 ? 1 : -1
      return beeIds[(currentIndex + direction + beeIds.length) % beeIds.length]
    })

    gridAnimation.start({
      x: [offset.x, offset.x + PANAL_REACTION_DISTANCE, offset.x - PANAL_REACTION_DISTANCE, offset.x],
      y: offset.y,
      transition: {
        duration: PANAL_REACTION_SPEED,
        ease: 'easeInOut',
      },
    })
  }


  return (
    <motion.section className="Panal-movil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Explorador del panal">
      <button className="Panal-cerrar" type="button" onClick={onClose} aria-label="Cerrar panal">X</button>
      <header className="Panal-encabezado">
    
      </header>
      <div className={`Panal-visor ${isDragging ? 'arrastrando' : ''}`} ref={panalRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        <div className="Panal-centro">
          <motion.div ref={gridRef} className="Panal-grid" animate={gridAnimation} initial={{ x: offset.x, y: offset.y }} transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 24, mass: 0.7 }}>
            {cells.map((cell, index) => {
              const number = index === 0 ? 1 : index + 1
              const beeData = currentBee
              const cellContent = {
                1: { label: 'Imagen', value: 'image' },
                2: { label: 'Hábitat', value: currentBee.habitat },
                3: { label: 'Nombre científico', value: currentBee.scientificName },
                4: { label: 'Importancia', value: currentBee.importance },
                5: { label: 'Características', value: currentBee.characteristics },
                6: { label: 'Nombre común', value: currentBee.commonName },
                7: { label: 'Dónde es', value: currentBee.where },
              }[number]

              return (
                <button className={`Panal-celda ${index === 0 ? 'activa' : ''} ${number === 13 || number === 19 ? 'navegacion' : ''}`} key={`${cell.layer}-${index}`} type="button" style={{ '--x': `${cell.x}vw`, '--y': `${cell.y}vw` }} onPointerDown={(event) => { if (number === 13 || number === 19) event.stopPropagation() }} onClick={(event) => { event.stopPropagation(); handleCellClick(number) }} aria-label={number === 19 ? 'Siguiente abeja' : number === 13 ? 'Abeja anterior' : `Panal número ${number}`}>
                  {number === 1 ? <img className="Panal-imagen" src={beeData.image} alt={currentBee.commonName} /> : number <= 7 ? <><span className="Panal-texto">{cellContent.label}</span><small>{cellContent.value}</small></> : null}
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>
      <div className="Panal-pista"></div>
    </motion.section>
  )
}

export default Panal