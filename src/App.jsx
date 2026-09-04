import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { PaperUnfold } from './components/animation'

import invasiveBeeImage from './assets/Abeja Invasora.png'
import invasiveBeeDraw from './assets/AbejaDibujo1.png'
import './App.css'
import Carrusel from './Carrusel'
import Panal from './Panal_movil'

const honeycombData = [
  {
    id: 'center',
    type: 'core',
    role: 'Abejas Nativas vs Invasoras',
    shortLabel: 'Panal Central',
    title: 'Especies Nativas en Riesgo',
    text: 'Las abejas melíferas introducidas compiten agresivamente por recursos florales y desplazan a las especies endémicas sin aguijón y solitarias.',
    img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    stats: {
      label: 'Desplazamiento Floral',
      nativeShare: 18,
      invasiveShare: 82,
      unit: '% de visitas a flores locales'
    }
  },
  {
    id: 'c1',
    type: 'native',
    role: 'Nativa sin aguijón',
    shortLabel: 'Meliponas',
    title: 'Polinizadoras Ancestrales',
    text: 'Vitales para la flora silvestre y cultivos especializados como vainilla o chile. No tienen aguijón y anidan en troncos huecos.',
    img: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=600&q=80',
    stats: {
      label: 'Eficiencia en Plantas Endémicas',
      value: 94,
      unit: '% de efectividad'
    }
  },
  {
    id: 'c2',
    type: 'invasive',
    role: 'Especie introducida',
    shortLabel: 'Apis Mellifera',
    title: 'Monopolio del Polen',
    text: 'Originarias de Europa y África. Su gran número por colonia agota el néctar en pocas horas, dejando sin alimento a las especies locales.',
    img: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=600&q=80',
    stats: {
      label: 'Consumo Diario por Colmena',
      value: 120,
      unit: 'kg de polen al año'
    }
  },
  {
    id: 'c3',
    type: 'threat',
    role: 'Alerta biológica',
    shortLabel: 'Transmisión Viral',
    title: 'Propagación de Patógenos',
    text: 'El comercio masivo de colmenas de miel disemina ácaros como Varroa y virus de deformación alar hacia abejas silvestres vulnerables.',
    img: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=600&q=80',
    stats: {
      label: 'Riesgo de Contagio Silvestre',
      value: 65,
      unit: '% de colmenas silvestres afectadas'
    }
  },
  {
    id: 'c4',
    type: 'native',
    role: 'Nativa solitaria',
    shortLabel: 'Abejas Solitarias',
    title: 'Las Joyas Solitarias',
    text: 'No viven en colmenas ni producen miel comercial; cada hembra cuida su propio nido en el suelo o madera. Son polinizadoras ultra-rápidas.',
    img: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80',
    stats: {
      label: 'Diversidad en la Región',
      value: 70,
      unit: '% del total de especies de abejas'
    }
  },
  {
    id: 'c5',
    type: 'invasive',
    role: 'Híbrido dominante',
    shortLabel: 'Africanizadas',
    title: 'Alta Territorialidad',
    text: 'Híbridos sumamente adaptables que expulsan a fauna nativa de oquedades naturales para establecer sus colonias masivas.',
    img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    stats: {
      label: 'Velocidad de Expansión',
      value: 300,
      unit: 'km anuales de avance'
    }
  },
  {
    id: 'c6',
    type: 'action',
    role: 'Conservación',
    shortLabel: 'Jardines Refugio',
    title: 'Proteger a la Abeja Local',
    text: 'Poner colmenas urbanas de miel no salva a las abejas: sembrar flores nativas y dejar tierra suelta para nidos sí lo hace.',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    stats: {
      label: 'Impacto de Flora Nativa',
      value: 40,
      unit: '% de aumento en biodiversidad local'
    }
  }
]

const highlights = [
  {
    title: '¿De dónde viene la abeja africana?',
    text: 'Comprenderás el origen de la abeja africana y de dónde viene esta especie colonizadora en nuestro continente.',
    subtitulo: 'La abeja africana',
    image: invasiveBeeImage,
    details:
      'Las abejas ajustan sus recorridos y horarios cuando cambian las temperaturas. Esta adaptación ayuda a mantener la producción, pero también aumenta el esfuerzo de toda la colonia.'
  },
  {
    title: '¿Cómo se estableció la apicultura en América?',
    text: 'Explorando la historia de la apicultura en el continente americano.',
    subtitulo: 'Apis mellifera scutellata',
    image: invasiveBeeDraw,
    details:
      'La pérdida de diversidad floral deja a las colonias con menos alimento durante el año. Recuperar plantas nativas y reducir el uso de pesticidas ofrece refugios más seguros.'
  },
  {
    title: '¿Cómo llegaron las abejas africanas a América?',
    text: 'Entenderás cómo llegaron las abejas africanas a América.',
    subtitulo: 'La llegada de las abejas africanas',
    details:
      'Cada abeja cumple una función distinta y la colonia responde como un sistema coordinado. Esa cooperación permite resolver cambios del entorno con rapidez y eficiencia.'
  }
]

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [showFunFact, setShowFunFact] = useState(false)
  const [selectedCell, setSelectedCell] = useState(null)
  const [selectedBee, setSelectedBee] = useState(null)
  const [openHighlights, setOpenHighlights] = useState(new Set())
  const [isScrolled, setIsScrolled] = useState(false)
  const pageRef = useRef(null)

  const finishIntro = () => {
    setShowIntro(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!showIntro) {
        setIsScrolled(window.scrollY > 0)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showIntro])

  return (
    <>
      <div className={`paper-intro ${showIntro ? 'visible' : 'hidden'}`} aria-hidden={!showIntro}>
        {showIntro && <PaperUnfold targetRef={pageRef} onComplete={finishIntro} />}
      </div>

      <div ref={pageRef} className={`newspaper-page ${showIntro ? 'content-hidden' : 'content-visible'} ${selectedBee ? 'content-blurred' : ''}`}>
        <header className={`masthead ${isScrolled ? 'is-compact' : ''}`}>
          <div className="masthead-main">
            <p className="edition">Edición especial · 01 de septiembre</p>
            <h1>
              <button
                className="headline-button"
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ¿No verdad?
              </button>
            </h1>
            <div className="tagline">El periódico que escucha a la naturaleza</div>
          </div>
        </header>

        <main className="hero-section">
          <section className="headline-panel">
            <div className="kicker">Nacional</div>
            <h2>HÉROE O AMENAZA</h2>
            <p className="lead">
              Las abejas no solo producen miel: sostienen cultivos, ecosistemas y comunidades
              enteras. Pero su futuro depende de decisiones que hoy se toman en cada jardín,
              campo y ciudad.
            </p>

            <div className="cta-row">
              <button type="button">Leer noticia</button>
              <span>Investigación · Medio ambiente · Sociedad</span>
            </div>
            {/* Fun Fact */}
            <section
              className={`bee-fun-fact ${showFunFact ? 'open' : 'closed'
                }`}
            >
              {!showFunFact ? (
                <button
                  className="fun-fact-bee"
                  onClick={() => setShowFunFact(true)}
                  aria-label="Mostrar fun fact"
                >
                  🐝
                </button>
              ) : (
                <div className="fun-fact-content">
                  <button
                    className="fun-fact-close"
                    onClick={() => setShowFunFact(false)}
                    aria-label="Cerrar fun fact"
                  >
                    ×
                  </button>

                  <span className="fun-fact-label">
                    FUN FACT
                  </span>

                  <h3>
                    ¿Sabías que las abejas pueden reconocer rostros?
                  </h3>

                  <p>
                    Las abejas pueden aprender a distinguir patrones
                    que se parecen a rostros humanos. ¡Su pequeño
                    cerebro tiene una capacidad de reconocimiento
                    sorprendente!
                  </p>
                </div>
              )}
            </section>

          </section>


          <aside className="bee-visual" aria-label="Bee-themed illustration">
            <div className="honeycomb-cluster">
              {/* Central static panel */}
              {honeycombData.filter(item => item.id === 'center').map((item) => (
                <div key={item.id} className={`cell-wrapper cell-${item.id}`}>
                  <motion.button
                    layoutId={`hexagon-${item.id}`}
                    className="cell-node"
                    onClick={() => setSelectedCell(item)}
                    whileHover={{ scale: 1.08, filter: 'brightness(1.15)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  >
                    <span className="cell-label">{item.shortLabel}</span>
                  </motion.button>
                </div>
              ))}

              {/* Orbiting panels */}
              <div className="orbit-ring">
                {honeycombData.filter(item => item.id !== 'center').map((item) => (
                  <div key={item.id} className={`cell-wrapper cell-${item.id} counter-orbit`}>
                    <motion.button
                      layoutId={`hexagon-${item.id}`}
                      className="cell-node"
                      onClick={() => setSelectedCell(item)}
                      whileHover={{ scale: 1.08, filter: 'brightness(1.15)' }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    >
                      <span className="cell-label">{item.shortLabel}</span>
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        <section className="highlights-grid">
          {highlights.map((item, index) => {
            const isOpen = openHighlights.has(index)
            const detailsId = `highlight-details-${index}`

            const toggleHighlight = () => {
              setOpenHighlights((current) => {
                const next = new Set(current)
                if (next.has(index)) {
                  next.delete(index)
                } else {
                  next.add(index)
                }
                return next
              })
            }

            return (
              <article
                key={item.title}
                className={`story-card ${isOpen ? 'is-open' : ''}`}
                role="button"
                tabIndex="0"
                aria-expanded={isOpen}
                aria-controls={detailsId}
                onClick={toggleHighlight}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    toggleHighlight()
                  }
                }}
              >
                <p className="meta">Investigación</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>

                {isOpen && (
                  <div id={detailsId} className="story-details">
                    <h4 className="story-subtitle">{item.subtitulo}</h4>
                    {item.image && (
                      <div className="story-media">
                        <img src={item.image} alt={item.subtitulo} />
                      </div>
                    )}
                    <p>{item.details}</p>
                  </div>
                )}
              </article>
            )
          })}
        </section>
        <Carrusel onBeeSelect={setSelectedBee} />
      </div>



      <AnimatePresence>
        {selectedCell && (
          <div className="hex-modal-backdrop" onClick={() => setSelectedCell(null)}>
            <motion.div
              layoutId={`hexagon-${selectedCell.id}`}
              className="hex-modal-card"
              onClick={(e) => e.stopPropagation()}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            >
              <button
                type="button"
                className="hex-close-btn"
                onClick={() => setSelectedCell(null)}
                aria-label="Cerrar"
              >
                ✕
              </button>

              <div className="hex-modal-inner">
                <h2>{selectedCell.title}</h2>
                <p className="hex-desc">{selectedCell.text}</p>

                {selectedCell.img && (
                  <img
                    src={selectedCell.img}
                    alt={selectedCell.title}
                    className="hex-image"
                  />
                )}

                {selectedCell.stats && (
                  <div className="hex-stat-box">
                    <span className="stat-label">{selectedCell.stats.label}</span>

                    {selectedCell.stats.nativeShare !== undefined ? (
                      <div className="stat-bar-group">
                        <div className="stat-bar-track">
                          <div
                            className="stat-bar-fill native"
                            style={{ width: `${selectedCell.stats.nativeShare}%` }}
                          />
                          <div
                            className="stat-bar-fill invasive"
                            style={{ width: `${selectedCell.stats.invasiveShare}%` }}
                          />
                        </div>
                        <div className="stat-legend">
                          <span>Nativas: {selectedCell.stats.nativeShare}%</span>
                          <span>Invasoras: {selectedCell.stats.invasiveShare}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="stat-metric">
                        <span className="metric-number">{selectedCell.stats.value}</span>
                        <span className="metric-unit">{selectedCell.stats.unit}</span>
                      </div>
                    )}
                  </div>

                )}
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {selectedBee && (
          <Panal bee={selectedBee} onClose={() => setSelectedBee(null)} />
        )}
      </AnimatePresence>


    </>
  )
}

export default App