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
  return (
    <div className="newspaper-page">
      <header className="masthead">
        <div className="top-bar">
          <span>Portada</span>
          <span>Fin de semana</span>
          <span>Suplemento ecológico</span>
        </div>

        <div className="masthead-main">
          <p className="edition">Edición especial · 01 de septiembre</p>
          <h1>¿No verdad?</h1>
          <div className="tagline">El periódico que escucha a la naturaleza</div>
        </div>
      </header>

      <main className="hero-section">
        <section className="headline-panel">
          <div className="kicker">Nacional</div>
          <h2>HEROE O AMENAZA</h2>
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
        {highlights.map((item) => (
          <article key={item.title} className="story-card">
            <p className="meta">Investigación</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

export default App
