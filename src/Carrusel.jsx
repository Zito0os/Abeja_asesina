import { useState } from 'react'
import './Carrusel.css'

const bees = [
  {
    id: 1,
    title: 'La abeja obrera',
    text: 'Las abejas obreras realizan distintas tareas dentro de la colmena.',
  },
  {
    id: 2,
    title: 'La polinización',
    text: 'Las abejas ayudan a polinizar una gran cantidad de plantas y cultivos.',
  },
  {
    id: 3,
    title: 'La colmena',
    text: 'Una colonia puede trabajar de forma coordinada como una enorme comunidad.',
  },
  {
    id: 4,
    title: 'La reina',
    text: 'La abeja reina es fundamental para mantener la colonia.',
  },
  {
    id: 5,
    title: 'La miel',
    text: 'La miel es el resultado del trabajo colectivo de miles de abejas.',
  },
]

function Carrusel({ onBeeSelect }) {
  const [activeBee, setActiveBee] = useState(2)

  return (
    <section className="bee-carousel">
      <div className="bee-carousel-track">
        {bees.map((bee, index) => {
          const position =
            (index - activeBee + bees.length) % bees.length

          return (
            <article
              key={bee.id}
              className={`bee-hex bee-position-${position}`}
              onMouseEnter={() => setActiveBee(index)}
              onClick={() => onBeeSelect(bee)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onBeeSelect(bee)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Abrir ${bee.title}`}
            >
              <div className="bee-hex-inner">
                <span className="bee-icon">🐝</span>

                <h3>{bee.title}</h3>

                <p>{bee.text}</p>

                <span className="bee-next">→</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Carrusel