import { useEffect, useState } from 'react'
import { PaperUnfold } from './components/animation'
import invasiveBeeImage from './assets/Abeja Invasora.png'
import invasiveBeeDraw from './assets/AbejaDibujo1.png'
import './App.css'

const highlights = [
  {
    title: '¿De dónde viene la abeja africana?',
    text: 'Comprenderas el origen de la abeja africana y de donde viene esta especie colonizadora en nuestro continente.',
    subtitulo: 'La abeja africana',
    image: invasiveBeeImage,
    details:
      'Las abejas ajustan sus recorridos y horarios cuando cambian las temperaturas. Esta adaptación ayuda a mantener la producción, pero también aumenta el esfuerzo de toda la colonia.',
  },
  {
    title: '¿Cómo se estableció la apicultura en América?',
    text: 'Explorando la historia de la apicultura en el continente americano.',
    subtitulo: 'Apis mellifera scutellata',
    image: invasiveBeeDraw,
    details:
      'La pérdida de diversidad floral deja a las colonias con menos alimento durante el año. Recuperar plantas nativas y reducir el uso de pesticidas ofrece refugios más seguros.',
  },
  {
    title: '¿Cómo llegaron las abejas africanas a América?',
    text: 'Entenderas cómo llegaron las abejas africanas a América.',
    subtitulo: 'La llegada de las abejas africanas',
    details:
      'Cada abeja cumple una función distinta y la colonia responde como un sistema coordinado. Esa cooperación permite resolver cambios del entorno con rapidez y eficiencia.',
  },
]

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [openHighlights, setOpenHighlights] = useState(new Set())
  const [isScrolled, setIsScrolled] = useState(false) /*estado para controlar la compacidad del encabezado*/

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className={`paper-intro ${showIntro ? 'visible' : 'hidden'}`} aria-hidden={!showIntro}>
        {showIntro && <PaperUnfold onComplete={() => setShowIntro(false)} />}
      </div>

      <div className={`newspaper-page ${showIntro ? 'content-hidden' : 'content-visible'}`}>
        <header className={`masthead ${isScrolled ? 'is-compact' : ''}`}> 
          {/*<div className="top-bar">
            <span>Portada</span>
            <span>Fin de semana</span>
            <span>Suplemento ecológico</span>
          </div>*/}

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
            <h2>HEROE O AMENAZA </h2>
            <p className="lead">
              Las abejas no solo producen miel: sostienen cultivos, ecosistemas y comunidades
              enteras. Pero su futuro depende de decisiones que hoy se toman en cada jardín,
              campo y ciudad.
            </p>

            <div className="cta-row">
              <button type="button">Leer noticia</button>
              <span>Investigación · Medio ambiente · Sociedad</span>
            </div>
          </section>

          <aside className="bee-visual" aria-label="Bee-themed illustration">
            <div className="honeycomb honeycomb-large">
              <span className="cell c1" />
              <span className="cell c2" />
              <span className="cell c3" />
              <span className="cell c4" />
              <span className="cell c5" />
              <span className="cell c6" />
            </div>
          </aside>
        </main>

        <section className="highlights-grid">
          {highlights.map((item, index) => {
            const isOpen = openHighlights.has(index)
            const detailsId = `highlight-details-${index}`
            const toggleHighlight = () => {
              setOpenHighlights((currentOpenHighlights) => {
                const nextOpenHighlights = new Set(currentOpenHighlights)

                if (nextOpenHighlights.has(index)) {
                  nextOpenHighlights.delete(index)
                } else {
                  nextOpenHighlights.add(index)
                }

                return nextOpenHighlights
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
      </div>
    </>
  )
}

export default App
