import { useState } from 'react'
import { PaperUnfold } from './components/animation'
import Logo from './assets/Logo.png'
import './App.css'

const highlights = [
  {
    title: 'Miel de temporada',
    text: 'La producción local se adapta a climas extremos y nuevas rutas de polinización.',
  },
  {
    title: 'Colmena en alerta',
    text: 'Especialistas alertan sobre cambios climáticos y la presión del monocultivo.',
  },
  {
    title: 'El secreto de la unión',
    text: 'La convivencia de la colonia revela lecciones de trabajo colectivo y resiliencia.',
  },
]

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [showFunFact, setShowFunFact] = useState(false)

  return (
    <>
      {/* Animation */}
      {showIntro && (
        <div className="paper-intro">
          <PaperUnfold onComplete={() => setShowIntro(false)} />
        </div>
      )}

      {/* Newspaper */}
      <div
        className={`newspaper-page ${
          showIntro ? 'content-hidden' : 'content-visible'
        }`}
      >
        <header className="masthead">
          <div className="top-bar">
            <span>Portada</span>
            <span>Fin de semana</span>
            <span>Suplemento ecológico</span>
          </div>

          <div className="masthead-main">
            <p className="edition">
              Edición especial · 01 de septiembre
            </p>

            <div className="masthead-title">
              <img
                src={Logo}
                alt=""
                className="masthead-image"
              />

              <h1>¿No verdad?</h1>
            </div>

            <div className="tagline">
              El periódico que escucha a la naturaleza
            </div>
          </div>
        </header>

        <main className="hero-section">
          <section className="headline-panel">
            <div className="kicker">Nacional</div>

            <h2>HEROE O AMENAZA</h2>

            <p className="lead">
              Las abejas no solo producen miel: sostienen cultivos,
              ecosistemas y comunidades enteras. Pero su futuro depende de
              decisiones que hoy se toman en cada jardín, campo y ciudad.
            </p>

            <div className="cta-row">
              <button type="button">Leer noticia</button>

              <span>
                Investigación · Medio ambiente · Sociedad
              </span>
            </div>
          </section>

          <aside
            className="bee-visual"
            aria-label="Bee-themed illustration"
          >
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

        {/* Highlights */}
        <section className="highlights-grid">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="story-card"
            >
              <p className="meta">Investigación</p>

              <h3>{item.title}</h3>

              <p>{item.text}</p>
            </article>
          ))}
        </section>

         {/* Fun Fact */}
        <section
          className={`bee-fun-fact ${
            showFunFact ? 'open' : 'closed'
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
      </div>
    </>
  )
}

export default App
