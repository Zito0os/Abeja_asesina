import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { PaperUnfold } from './components/animation'
import loneBee from './assets/lone.jpg'
import invasiveBeeImage from './assets/Abeja Invasora.png'
import invasiveBeeDraw from './assets/AbejaDibujo1.png'
import africa from './assets/africa.png'
import beeGif from './assets/beeGif.gif'
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
    title: 'Disminución de las Abejas Melíferas en America del Norte durante los últimos años.',
    text: 'Las poblaciones críticas de abejas melíferas en Estados Unidos han disminuido en los últimos años debido a diversos factores, lo que genera preocupación sobre la seguridad futura de los servicios de polinización en el país. Investigadores del USGS están estudiando los efectos de factores como el cambio de uso del suelo y el uso de productos químicos en el hábitat de las abejas melíferas para comprender mejor cómo conservarlas en el territorio.',
    subtitulo: 'Abejas Melíferas',
    image: invasiveBeeImage,
    details:
      'Si bien son importantes para la polinización de algunos cultivos, las abejas melíferas también son importantes competidoras de las abejas autóctonas y no deben introducirse en áreas de conservación, parques o zonas donde se desee fomentar la conservación de plantas y abejas autóctonas.'
  },
  {
    title: 'México es el segundo hogar de la mayor diversidad de abejas nativas del planeta.',
    text: 'Proteger a las abejas es invertir en nuestro propio bienestar y en el futuro de nuestro planeta.',
    subtitulo: '¿Sabias que hay una gran diversidad de abejas nativas en Nuevo León?',
    image: invasiveBeeDraw,
    details:
      ' Se han confirmado casi 400 especies nativas en la región (un cuarto del total de México), ¡con 2,100 especies en total!.'
  },
  {
    title: 'Conoce las fascinantes características de nuestras abejas nativas',
    text: 'Sabias que muchas de nuestras abejas nativas son sin aguijón',
    subtitulo: 'También llamadas abejas meliponas o meliponinos.',
    image: africa,
    details:
      'Son abejas de menor tamaño comparadas con las abejas europeas, de colores oscuros con tonos rojizos o marrón, con anillos negros y amarillos en el abdomen y con vellos en el tórax; además tienen una menor cantidad de venas en las alas. A diferencia de las europeas, las obreras de las abejas meliponas poseen una cesta de polen en sus patas posteriores y carecen de aguijón.'
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
    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    const startLink = document.querySelector('a[href="#pagina-inicio"]')

    root.style.scrollBehavior = 'auto'
    startLink?.click()
    root.style.scrollBehavior = previousScrollBehavior
    setShowIntro(false)
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
      <a id="pagina-inicio" className="page-anchor" href="#pagina-inicio" aria-hidden="true" tabIndex={-1} />
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
            <h1>    ¿Son las abejas melíferas originarias de Norteamérica?</h1>
            <p className="lead">
         Las abejas melíferas no son originarias de Norteamérica. Fueron importadas de Europa en el siglo XVII. Actualmente, las abejas melíferas ayudan a polinizar muchos cultivos estadounidenses, como frutas y frutos secos. En un solo año, una colonia de abejas puede recolectar alrededor de 18 kilogramos de polen y 120 kilogramos de néctar. Las abejas melíferas incrementan el valor de los cultivos de nuestro país en más de 15 mil millones de dólares cada año.
            </p>


             {/* Fun Fact */}
        <section
          className={`bee-fun-fact ${
            showFunFact ? 'open' : 'closed'
          }`}
          style={{ '--fun-fact-gif': `url("${beeGif}")` }}
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
              {honeycombData.map((item) => (
                <motion.button
                  key={item.id}
                  layoutId={`hexagon-${item.id}`}
                  className={`cell-node cell-${item.id}`}
                  onClick={() => setSelectedCell(item)}
                  whileHover={{ scale: 1.08, filter: 'brightness(1.15)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                >
                  <span className="cell-label">{item.shortLabel}</span>
                </motion.button>
              ))}
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
                style={{ '--story-image': `url("${item.image}")` }}
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
                

                {isOpen && (
                  <div id={detailsId} className="story-details">
                    <h4 className="story-subtitle">{item.subtitulo}</h4>
                    {item.image && (
                      <div className="story-media">
                        <img src={item.image} alt={item.subtitulo} />
                        <p>{item.text}</p>
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

         {/* PUBLICIDAD */}
        <aside className="bee-ad">
          <span className="bee-ad-label">PUBLICIDAD</span>

          <img
            src={loneBee}
            alt="Abeja"
          />

          <h3>PROTEJAMOS A LAS ABEJAS</h3>

          <p>
          ¡PROTEGE A NUESTROS POLINIZADORES!
      Planta flores nativas.
      Evita productos químicos dañinos.
      Cada jardín cuenta.
          </p>

        <button 
        type="button" 
        onClick={() => window.open("https://www.gob.mx/conabio/prensa/mexico-es-el-segundo-hogar-de-la-mayor-diversidad-de-abejas-nativas-del-planeta-con-2-100-especies?idiom=es", "_blank", "noopener,noreferrer")}
        >
        CONOCE MÁS
        </button>
        </aside>

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